"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { DEMO_ASSETS, nearestFrameIndex, type PosesData } from "@/lib/demo";

interface Props {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  poses: PosesData | null;
}

// Three.js panel: the sparse VO point cloud (map.ply) + the camera trajectory,
// with a small frustum marker that flies the path in sync with the video clock.
export default function SlamMap({ videoRef, poses }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1b2028); // grv-hard

    const camera = new THREE.PerspectiveCamera(55, 1, 0.01, 1000);
    camera.position.set(2, 1.5, 2);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;

    const resize = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    // ── Trajectory line + moving frustum marker ──────────────────────────────
    let posVecs: THREE.Vector3[] = [];
    let quats: THREE.Quaternion[] = [];
    if (poses && poses.frames.length) {
      posVecs = poses.frames.map(
        (f) => new THREE.Vector3(f.position[0], f.position[1], f.position[2]),
      );
      quats = poses.frames.map(
        (f) =>
          new THREE.Quaternion(
            f.quaternion[0],
            f.quaternion[1],
            f.quaternion[2],
            f.quaternion[3],
          ),
      );
      const trajGeom = new THREE.BufferGeometry().setFromPoints(posVecs);
      const traj = new THREE.Line(
        trajGeom,
        new THREE.LineBasicMaterial({ color: 0x476f82 }), // grv-blue
      );
      scene.add(traj);
    }

    // Small camera frustum that rides the trajectory.
    const frustum = new THREE.Group();
    const coneGeom = new THREE.ConeGeometry(0.08, 0.16, 4);
    coneGeom.rotateX(Math.PI / 2); // point along +Z (camera look dir)
    const cone = new THREE.Mesh(
      coneGeom,
      new THREE.MeshBasicMaterial({ color: 0x78b4c0, wireframe: true }),
    );
    frustum.add(cone);
    scene.add(frustum);
    if (posVecs.length) frustum.position.copy(posVecs[0]);

    let raf = 0;
    let disposed = false;

    // ── Load point cloud, then start the render loop ─────────────────────────
    const loader = new PLYLoader();
    loader.load(
      DEMO_ASSETS.pointcloud,
      (geom) => {
        if (disposed) return;
        geom.computeBoundingSphere();
        const mat = new THREE.PointsMaterial({
          size: 0.02,
          sizeAttenuation: true,
          color: 0x5f9ea8, // grv-aqua
          vertexColors: !!geom.getAttribute("color"),
        });
        const points = new THREE.Points(geom, mat);
        scene.add(points);

        // Frame the camera on the cloud.
        const s = geom.boundingSphere;
        if (s) {
          controls.target.copy(s.center);
          const d = s.radius * 2.4 || 3;
          camera.position.copy(
            s.center.clone().add(new THREE.Vector3(d, d * 0.7, d)),
          );
          camera.near = Math.max(0.001, s.radius / 100);
          camera.far = s.radius * 50;
          camera.updateProjectionMatrix();
        }
      },
      undefined,
      () => {
        /* missing cloud — trajectory/marker still render */
      },
    );

    const poseFrames = poses?.frames ?? [];
    const tmpQ = new THREE.Quaternion();
    const animate = () => {
      const video = videoRef.current;
      if (video && poseFrames.length) {
        const idx = nearestFrameIndex(poseFrames, video.currentTime);
        if (idx >= 0) {
          frustum.position.copy(posVecs[idx]);
          frustum.quaternion.copy(quats[idx] ?? tmpQ);
        }
      }
      controls.update();
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount)
        mount.removeChild(renderer.domElement);
    };
  }, [videoRef, poses]);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full" />;
}

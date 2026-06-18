"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default function RovViewer() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const w = mount.clientWidth;
    const h = mount.clientHeight;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mount.appendChild(renderer.domElement);

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(42, w / h, 0.01, 100000);
    camera.position.set(0, 0, 500);

    // Lights — blue/teal palette to match site theme
    scene.add(new THREE.AmbientLight(0x0d1f3c, 2.5));

    const key = new THREE.DirectionalLight(0x9dd8e8, 3.5);
    key.position.set(2, 3, 4);
    scene.add(key);

    const fill = new THREE.DirectionalLight(0x3a7ca8, 1.2);
    fill.position.set(-3, -1, 2);
    scene.add(fill);

    const rim = new THREE.DirectionalLight(0x5fc8d8, 2.0);
    rim.position.set(0, -3, -4);
    scene.add(rim);

    const top = new THREE.DirectionalLight(0xffffff, 0.6);
    top.position.set(0, 5, 0);
    scene.add(top);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.6;
    controls.enablePan = false;
    controls.minDistance = 50;

    // Material — dark teal metallic matching grv-aqua
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x3a8fa0),
      emissive: new THREE.Color(0x061824),
      metalness: 0.75,
      roughness: 0.22,
    });

    // Load STL
    const loader = new STLLoader();
    loader.load(
      "/rov_cad_online.stl",
      (geometry) => {
        geometry.computeVertexNormals();
        geometry.center();
        geometry.computeBoundingSphere();

        const mesh = new THREE.Mesh(geometry, material);

        const r = geometry.boundingSphere!.radius;
        const scale = 180 / r;
        mesh.scale.setScalar(scale);
        mesh.rotation.x = -Math.PI / 2;

        scene.add(mesh);

        camera.position.set(0, r * scale * 0.4, r * scale * 3.0);
        controls.maxDistance = r * scale * 8;
        controls.target.set(0, 0, 0);
        controls.update();

        setLoading(false);
      },
      (xhr) => {
        if (xhr.total) setProgress(Math.round((xhr.loaded / xhr.total) * 100));
      },
    );

    // Animate
    let raf: number;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      controls.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <div ref={mountRef} className="w-full h-full" />
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none">
          <div className="w-32 h-px bg-grv-b relative overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-grv-aqua transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="font-mono text-[0.62rem] tracking-widest uppercase text-grv-fg4">
            {progress > 0 ? `loading model ${progress}%` : "loading model…"}
          </span>
        </div>
      )}
    </div>
  );
}

import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { COMPANY_NAME, COMPANY_DESCRIPTION } from "@/lib/config";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${COMPANY_NAME} | Marine AI Research`,
    template: `%s | ${COMPANY_NAME}`,
  },
  description: COMPANY_DESCRIPTION,
  keywords: [
    "underwater autonomy",
    "marine robotics",
    "VLA model",
    "AUV",
    "ROV",
    "subsea AI",
    "ocean data",
    "defense technology",
    "offshore inspection",
    "Scripps oceanography",
  ],
  openGraph: {
    type: "website",
    title: `${COMPANY_NAME} | Marine AI Research`,
    description: COMPANY_DESCRIPTION,
    siteName: COMPANY_NAME,
  },
};

export const viewport: Viewport = {
  themeColor: "#1b2028",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans bg-grv-hard text-grv-fg antialiased">
        {children}
      </body>
    </html>
  );
}

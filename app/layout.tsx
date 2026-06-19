import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, Geist } from "next/font/google";
import "./globals.css";
import { COMPANY_NAME, COMPANY_DESCRIPTION } from "@/lib/config";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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
    default: COMPANY_NAME,
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
  ],
  openGraph: {
    type: "website",
    title: COMPANY_NAME,
    description: COMPANY_DESCRIPTION,
    siteName: COMPANY_NAME,
  },
  twitter: {
    card: "summary",
    title: COMPANY_NAME,
    description: COMPANY_DESCRIPTION,
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
    <html lang="en" className={cn(inter.variable, spaceGrotesk.variable, "font-sans", geist.variable, "dark")}>
      <body className="font-sans bg-grv-hard text-grv-fg antialiased">
        <TooltipProvider delay={300}>{children}</TooltipProvider>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: "CodeKraft — Digital Products, Built to Work.",
  description: "CodeKraft designs, builds and secures modern digital products, software and technology solutions. Build. Secure. Innovate.",
  applicationName: "CodeKraft",
  metadataBase: new URL("https://codekraft-studio.amal51925192.chatgpt.site"),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website", locale: "en_US", siteName: "CodeKraft",
    title: "CodeKraft — Digital Products, Built to Work.",
    description: "A technology studio combining software engineering, product design and security-minded development.",
  },
  twitter: {
    card: "summary", title: "CodeKraft — Digital Products, Built to Work.",
    description: "Build. Secure. Innovate. Practical digital products engineered for real-world use.",
  },
  icons: { icon: "/assets/codekraft-logo.png", apple: "/assets/codekraft-logo.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className="dark"><body>{children}</body></html>;
}

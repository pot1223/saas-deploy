import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CloudNote - Your Thoughts, Organized Everywhere",
  description: "Experience seamless cross-device syncing that keeps your notes updated instantly.",
  openGraph: {
    title: "CloudNote - Seamless Note Taking & Management",
    description: "The ultimate cloud-based platform for organizing your thoughts, projects, and ideas.",
    url: "https://cloudnote-memo-service.vercel.app",
    siteName: "CloudNote",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CloudNote - Your Intelligent Workspace",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CloudNote",
    description: "Organize your thoughts in one place with CloudNote.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased font-display">
        {children}
      </body>
    </html>
  );
}

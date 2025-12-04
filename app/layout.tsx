import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nightlife - 1v1 Dice",
  description: "Cyberpunk virtual lounge",
};

// Prevent zooming on mobile
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      {/* Background is dark gray to highlight the 'phone' frame */}
      <body className="bg-[#121212] text-white antialiased flex justify-center min-h-screen overflow-hidden">
        
        {/* Mobile Container: Fixed width, full dynamic height, centered */}
        <div className="w-full max-w-md h-[100dvh] bg-black relative shadow-2xl overflow-hidden border-x border-gray-800 flex flex-col">
          {children}
        </div>

      </body>
    </html>
  );
}
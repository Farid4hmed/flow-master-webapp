import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import SessionWrapper from "@/components/sessionWrapper";
import { AppProvider } from "@/components/context";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Flow Master",
  description: "Converts Text to Diagram",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon-32x32.png",
    other: [
      { rel: "icon", sizes: "32x32", url: "/favicon-32x32.png" },
      { rel: "icon", sizes: "16x16", url: "/favicon-16x16.png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionWrapper>
      <html lang="en">
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <AppProvider> {children}</AppProvider>
          </ThemeProvider>
          <Toaster />
        </body>
      </html>
    </SessionWrapper>
  );
}

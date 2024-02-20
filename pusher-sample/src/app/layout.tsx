"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import UserContext from "@/lib/context";
import React from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
  title: "WebSocket - Pusher Demo",
  description: "Chat application using Pusher",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [display, setDisplay] = React.useState<string>("");
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <UserContext.Provider value={{ display, setDisplay }}>
            {children}
          </UserContext.Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}

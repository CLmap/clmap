"use client";

import "../styles/global.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../utils/react-query-client";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}

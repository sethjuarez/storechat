import "../styles/globals.css";
import React from "react";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@primer/react";
import { SessionProvider } from "next-auth/react";
import AzureAppInsights from "../components/appinsights";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AzureAppInsights>
      <SessionProvider session={pageProps.session}>
        <ThemeProvider>
          <Component {...pageProps} />
        </ThemeProvider>
      </SessionProvider>
    </AzureAppInsights>
  );
}

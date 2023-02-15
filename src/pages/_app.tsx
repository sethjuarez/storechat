import "@styles/globals.css";
import React from "react";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@primer/react";
import { SessionProvider } from "next-auth/react";
import AzureAppInsights from "@components/appinsights";
import { store } from "@services/store";
import { Provider } from "react-redux";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <AzureAppInsights>
        <SessionProvider session={pageProps.session}>
          <ThemeProvider >
            <Component {...pageProps} />
          </ThemeProvider>
        </SessionProvider>
      </AzureAppInsights>
    </Provider>
  );
}

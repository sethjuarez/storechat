import "../styles/globals.css";
import App from "next/app";
import { ThemeProvider } from "@primer/react";
import { SessionProvider } from "next-auth/react";
import { withApplicationInsights } from "../services/insights";

class ChatApp extends App {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <SessionProvider session={pageProps.session}>
        <ThemeProvider>
          <Component {...pageProps} />
        </ThemeProvider>
      </SessionProvider>
    );
  }
}

export default withApplicationInsights({
  connectionString: process.env.NEXT_PUBLIC_APP_INSIGHTS_CONNECTION || "",
  isEnabled: true //process.env.NODE_ENV === "production",
})(ChatApp);

import React, { ReactNode } from "react";
import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import {
  ReactPlugin,
  withAITracking,
  AppInsightsContext,
} from "@microsoft/applicationinsights-react-js";


let reactPlugin = new ReactPlugin();
let appInsights = new ApplicationInsights({
  config: {
    connectionString: process.env.NEXT_PUBLIC_APP_INSIGHTS_CONNECTION,
    enableAutoRouteTracking: false,
    enableCorsCorrelation: false,
    enableRequestHeaderTracking: false,
    enableResponseHeaderTracking: false,
    enableAjaxPerfTracking: false,
    isBrowserLinkTrackingEnabled: false,
    extensions: [reactPlugin],
  },
});

appInsights.loadAppInsights();

type Props = {
  children: ReactNode;
};

const AzureAppInsights = ({ children }: Props) => {
  return (
    <AppInsightsContext.Provider value={reactPlugin}>
      {children}
    </AppInsightsContext.Provider>
  );
};

export default withAITracking(reactPlugin, AzureAppInsights);

import { Box, Text, TabNav } from "@primer/react";
import { AppHeader, Chat, Sources, Prompt } from "@components";
import { MouseEventHandler, useState, useEffect } from "react";
import {
  Customer,
  Turn,
  TurnRequest,
  TurnResponse,
  RequestTelemetry,
  ResponseTelemetry,
} from "@types";
import Head from "next/head";
import { useSession } from "next-auth/react";
import {
  useAppInsightsContext,
  useTrackEvent,
} from "@microsoft/applicationinsights-react-js";

const Project = () => {
  const { data: session, status } = useSession();


  return (
    <>
      <Head>
        <title>Contoso Market ChatGPT</title>
      </Head>
      <Box className="main">
        <Box className="header">heder</Box>
        <Box className="chat">cht</Box>
        <Box className="prompt">prompt</Box>
        <Box className="footer" bg="neutral.emphasisPlus">
          <Box color="fg.onEmphasis">
            <Text>&copy;2023 Microsoft</Text>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Project;

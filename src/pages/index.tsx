import { Box, Text, TabNav } from "@primer/react";
import { AppHeader, Chat, Sources, Prompt } from "@components";
import { MouseEventHandler, useEffect, useState } from "react";
import Head from "next/head";
import { useSession } from "next-auth/react";
import {
  useAppInsightsContext,
  useTrackEvent,
} from "@microsoft/applicationinsights-react-js";
import { useAppDispatch, useAppSelector } from "@services/hooks";
import { addResponse } from "@services/chatSlice";
import { PromptService, DocumentService } from "@services";
import { clearTurns } from "@services/chatSlice";
import { RequestTelemetry, ResponseTelemetry } from "@types";

const Home = () => {
  const dispatch = useAppDispatch();
  const customers = useAppSelector((state) => state.customers);
  const chat = useAppSelector((state) => state.chat);

  // State
  const { data: session, status } = useSession();
  const documentService = new DocumentService();

  const [sourcesOpen, setSourcesOpen] = useState(true);
  const [basePrompt, setBasePrompt] = useState(
    `<Instructions>Please answer the question briefly, succinctly and in a personable manner using nice markdown as the Assistant. End your answer with a lot of fun emojis.
<Context>Use this context in the response: customer name: {name}, customer age: {age}, customer timezone: {location}.
<Documentation>{documentation}
<Conversation>{conversation}
{name}: {message}
Assistant:`
  );

  const [prompt, setPrompt] = useState("");
  const [product, setProduct] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(0);

  // tracking
  const appInsights = useAppInsightsContext();
  const [reqTelemetry, setReqTelemetry] = useState<RequestTelemetry | null>(
    null
  );
  const trackRequest = useTrackEvent(
    appInsights,
    "Request",
    reqTelemetry,
    true
  );
  useEffect(() => {
    if (reqTelemetry) {
      trackRequest(reqTelemetry);
    }
  }, [reqTelemetry, trackRequest]);

  const [resTelemetry, setResTelemetry] = useState<ResponseTelemetry | null>(
    null
  );
  const trackResponse = useTrackEvent(
    appInsights,
    "Request",
    resTelemetry,
    true
  );
  useEffect(() => {
    if (resTelemetry) {
      trackResponse(resTelemetry);
    }
  }, [resTelemetry, trackResponse]);
  // methods
  const sendPrompt = async (message: string): Promise<string> => {
    const telem = {
      host: window ? window.location.hostname : "unknown",
      name: (session && session.user?.name) || "",
      email: (session && session.user?.email) || "",
    };

    const document = await documentService.search(message);
    if (document.length > 0) setProduct(document);
    const service = new PromptService(
      basePrompt,
      document.length > 0 ? document : product,
      customers[selectedCustomer]
    );
    const turn = service.createRequest(message, chat);
    setPrompt(turn.prompt);
    setReqTelemetry({
      ...telem,
      message: message,
      type: "request",
      turn: turn,
    });

    const response = await service.prompt(turn);
    const { message: m, ...turnrequest } = response;

    setResTelemetry({
      ...telem,
      message: m,
      type: "response",
      turn: turnrequest,
    });

    dispatch(addResponse(m));
    return m;
  };

  const resetChat = () => {
    clearTurns();
    setPrompt("");
    setProduct("");
  };

  const toggleTabs: MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault();
    setSourcesOpen(e.currentTarget.text === "Sources");
  };

  return (
    <>
      <Head>
        <title>Contoso Market ChatGPT</title>
      </Head>
      <Box className="main">
        <Box className="header">
          <AppHeader
            customers={customers}
            selected={selectedCustomer}
            setSelected={setSelectedCustomer}
            resetChat={resetChat}
          />
        </Box>
        <Box className="chat">
          <Chat
            customer={customers[selectedCustomer]}
            sendPrompt={sendPrompt}
          />
        </Box>
        <Box className="prompt">
          <TabNav aria-label="Main">
            <TabNav.Link href="#" selected={sourcesOpen} onClick={toggleTabs}>
              Sources
            </TabNav.Link>
            <TabNav.Link href="#" selected={!sourcesOpen} onClick={toggleTabs}>
              Prompt
            </TabNav.Link>
          </TabNav>
          <Box
            borderColor="border.default"
            borderWidth={1}
            borderStyle="solid"
            borderTopStyle={"hidden"}
            borderBottomLeftRadius={15}
            borderBottomRightRadius={15}
            boxShadow="shadow.medium"
            className="tabarea"
          >
            {sourcesOpen && (
              <Sources
                customer={customers[selectedCustomer]}
                product={product}
                setProduct={setProduct}
                basePrompt={basePrompt}
                setBasePrompt={setBasePrompt}
              />
            )}
            {!sourcesOpen && <Prompt prompt={prompt} />}
          </Box>
        </Box>
        <Box className="footer" bg="neutral.emphasisPlus">
          <Box color="fg.onEmphasis">
            <Text>&copy;2023 Microsoft</Text>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Home;

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

const Home = () => {
  const { data: session, status } = useSession();
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

  const [sources, setSources] = useState<{ [id: string]: string }>({
    food: "/data/NaturesNourishment.txt",
    clean: "/data/EcoClean.txt",
  });
  const [sourcesOpen, setSourcesOpen] = useState(true);
  const [basePrompt, setBasePrompt] = useState(
    `<Instructions>Please answer the question briefly, succinctly and in a personable manner using nice markdown as the Assistant. End your answer with a lot of fun emojis.
<Context>Use this context in the response: customer name: {name}, customer age: {age}, customer timezone: {location}.
<Documentation>{documentation}
<Conversation>{conversation}
{name}: {message}
Assistant:`
  );
  const [conversation, setConversation] = useState<Turn[]>([]);

  const [prompt, setPrompt] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([
    {
      name: "Seth",
      image: "/images/sethjuarez.jpg",
      age: 40,
      location: "Pacific",
    },
    {
      name: "Cassie",
      image: "/images/cassiebreviu.jpg",
      age: 23,
      location: "Central",
    },
    {
      name: "Vanessa",
      image: "/images/vanessadiaz.jpg",
      age: 23,
      location: "Eastern",
    },
  ]);
  const [selectedCustomer, setSelectedCustomer] = useState(0);
  const [product, setProduct] = useState("");

  const sendPrompt = async (message: string): Promise<Turn> => {
    let p = basePrompt
      .replaceAll("{name}", customers[selectedCustomer].name)
      .replaceAll("{age}", customers[selectedCustomer].age.toString())
      .replaceAll("{location}", customers[selectedCustomer].location)
      .replace("{message}", message);

    const convo = conversation
      .slice(-4)
      .reduce(
        (acc, cur) =>
          ` ${acc}${
            cur.type === "user"
              ? customers[selectedCustomer].name + ": " + cur.message + "\n\n\n"
              : "Assistant: " + cur.message + "\n\n\n"
          }\n`,
        ""
      );

    let doc = "";
    Object.entries(sources).forEach(([key, value]) => {
      if (message.toLowerCase().includes(key.toLowerCase())) doc = value;
    });

    if (doc.length > 0) {
      const documentation = await fetch(doc, {
        method: "GET",
        headers: {
          "Content-Type": "application/text",
        },
      });

      const contents = await documentation.text();
      setProduct(contents);
      p = p.replace("{documentation}", contents);
    }

    p = p.replace("{documentation}", product);

    const request: TurnRequest = {
      prompt: p.replace("{conversation}", convo),
      temperature: 0.8,
      top_p: 1.0,
      max_tokens: 500,
      stream: false,
    };

    setReqTelemetry({
      type: "request",
      name: (session && session.user?.name) || "",
      email: (session && session.user?.email) || "",
      message: message,
      turn: request,
    });

    setPrompt(request.prompt);

    const options = {
      method: "POST",
      body: JSON.stringify(request),
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetch("/api/chat", options);
    const c: TurnResponse = await response.json();
    const reply = c.choices[0].text.split(
      customers[selectedCustomer].name + ": "
    );

    setResTelemetry({
      type: "response",
      name: (session && session.user?.name) || "",
      email: (session && session.user?.email) || "",
      message: reply[0].trim(),
      turn: c,
    });

    return {
      message: reply[0].trim(),
      status: "done",
      type: "bot",
    };
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
            resetChat={() => {
              setConversation([]);
              setPrompt("");
              setProduct("");
            }}
          />
        </Box>
        <Box className="chat">
          <Chat
            customer={customers[selectedCustomer]}
            messages={conversation}
            setMessages={setConversation}
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

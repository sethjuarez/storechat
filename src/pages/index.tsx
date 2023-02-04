import Head from "next/head";
import { PromptService } from "@services";
import { useSession } from "next-auth/react";
import { addResponse } from "@services/chatSlice";
import { Box, Text, TabNav } from "@primer/react";
import { useState } from "react";
import { currentCustomer } from "@services/customerSlice";
import { AppHeader, Chat, Sources, Prompt, Content } from "@components";
import { useAppDispatch, useAppSelector } from "@services/hooks";
import { currentPrompt, setCurrentPrompt } from "@services/promptSlice";
import { currentDocument, fetchDocument } from "@services/documentSlice";
import { useAppInsightsContext } from "@microsoft/applicationinsights-react-js";

const Home = () => {
  const appInsights = useAppInsightsContext();
  const dispatch = useAppDispatch();
  const customer = useAppSelector(currentCustomer);
  const basePrompt = useAppSelector(currentPrompt);
  const chat = useAppSelector((state) => state.chat);
  const document = useAppSelector(currentDocument);

  // State
  const { data } = useSession();
  const user = {
    name: data?.user?.name || "",
    email: data?.user?.email || "",
  };
  const [prompt, setPrompt] = useState("");
  const [currentTab, setCurrentTab] = useState<
    "prompt" | "sources" | "content"
  >("sources");

  // events
  const sendPrompt = async (message: string): Promise<void> => {
    const { contents } = await dispatch(fetchDocument(message)).unwrap();
    const itemDoc = contents.length == 0 ? document : contents;

    const service = new PromptService(
      basePrompt.template,
      itemDoc,
      customer,
      user,
      appInsights.getAppInsights()
    );

    const request = service.createRequest(message, chat);
    setPrompt(request.prompt);
    const response = await service.prompt(request);
    dispatch(addResponse(response));
  };

  return (
    <>
      <Head>
        <title>GreenLife - ChatGPT</title>
      </Head>
      <Box className="main">
        <Box className="header">
          <AppHeader />
        </Box>
        <Box className="chat">
          <Chat customer={customer} sendPrompt={sendPrompt} />
        </Box>
        <Box className="prompt">
          <TabNav aria-label="Main">
            <TabNav.Link
              href="#"
              selected={currentTab === "sources"}
              onClick={(e) => {
                e.preventDefault();
                setCurrentTab("sources");
              }}
            >
              Sources
            </TabNav.Link>
            <TabNav.Link
              href="#"
              selected={currentTab === "prompt"}
              onClick={(e) => {
                e.preventDefault();
                setCurrentTab("prompt");
              }}
            >
              Prompt
            </TabNav.Link>
            {/* 
            <TabNav.Link
              href="#"
              selected={currentTab === "content"}
              onClick={(e) => {
                e.preventDefault();
                setCurrentTab("content");
              }}
            >
              Content
            </TabNav.Link>
            */}
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
            {currentTab === "sources" && <Sources />}
            {currentTab === "prompt" && <Prompt prompt={prompt} />}
            {/*currentTab === "content" && <Content />*/}
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

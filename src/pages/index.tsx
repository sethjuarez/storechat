import Head from "next/head";
import { PromptService } from "@services";
import { useSession } from "next-auth/react";
import { addResponse } from "@services/chatSlice";
import { Box, Text, TabNav } from "@primer/react";
import { MouseEventHandler, useState } from "react";
import { currentCustomer } from "@services/customerSlice";
import { AppHeader, Chat, Sources, Prompt } from "@components";
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
  const [sourcesOpen, setSourcesOpen] = useState(true);
  const [prompt, setPrompt] = useState("");

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
          <AppHeader />
        </Box>
        <Box className="chat">
          <Chat customer={customer} sendPrompt={sendPrompt} />
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
              <Sources />
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

import { Box, Text, TabNav } from "@primer/react";
import { AppHeader, Chat, Sources } from "@components";
import { MouseEventHandler, useState, useEffect } from "react";
import { Customer, Turn, TurnRequest, TurnResponse } from "@types";

const Home = () => {
  //const { data: session, status } = useSession();
  const [sourcesOpen, setSourcesOpen] = useState(true);
  const [messages, setMessages] = useState<Turn[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([
    {
      name: "Seth Juarez",
      image: "/images/sethjuarez.jpg",
      age: 40,
      location: "Pacific",
    },
    {
      name: "Cassie Breviu",
      image: "/images/cassiebreviu.jpg",
      age: 23,
      location: "Central",
    },
    {
      name: "Vanessa Diaz",
      image: "/images/vanessadiaz.jpg",
      age: 23,
      location: "Eastern",
    },
  ]);
  const [selectedCustomer, setSelectedCustomer] = useState(0);
  const [product, setProduct] = useState("");

  const sendPrompt = async (message: string): Promise<Turn> => {
    const request: TurnRequest = {
      prompt: message,
      temperature: 0.0,
      top_p: 1.0,
      max_tokens: 500,
      stream: false,
    };

    const options = {
      method: "POST",
      body: JSON.stringify(request),
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetch("/api/chat", options);
    const c: TurnResponse = await response.json();
    return {
      message: c.choices[0].text,
      status: "done",
      type: "bot",
    };
  };

  const toggleTabs: MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault();
    setSourcesOpen(e.currentTarget.text === "Sources");
  };

  useEffect(() => {
    console.log(product);
  }, [product])

  return (
    <Box className="main">
      <Box className="header">
        <AppHeader
          customers={customers}
          selected={selectedCustomer}
          setSelected={setSelectedCustomer}
        />
      </Box>
      <Box className="chat">
        <Chat
          customer={customers[selectedCustomer]}
          messages={messages}
          setMessages={setMessages}
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
            />
          )}
          {!sourcesOpen && <div>Prompt</div>}
        </Box>
      </Box>
      <Box className="footer" bg="neutral.emphasisPlus">
        <Box color="fg.onEmphasis">
          <Text>&copy;2023 Microsoft</Text>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;

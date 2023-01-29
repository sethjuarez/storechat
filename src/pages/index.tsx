import { Box, Text, TabNav } from "@primer/react";
import { AppHeader, Chat } from "@components";
import { MouseEventHandler, useState } from "react";
import { Customer } from "@types";

const Home = () => {
  //const { data: session, status } = useSession();
  const [sourcesOpen, setSourcesOpen] = useState(true);
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

  const toggleTabs: MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault();
    setSourcesOpen(e.currentTarget.text === "Sources");
  }

  return (
    <Box className="main">
      <Box className="header">
        <AppHeader customers={customers} selected={selectedCustomer} setSelected={setSelectedCustomer} />
      </Box>
      <Box className="chat">
        <Chat />
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
          {sourcesOpen && <div>Sources</div>}
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

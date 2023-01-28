import {
  Box,
  Text,
} from "@primer/react";

import { AppHeader, Chat } from "@components";

export default function Home() {
  return (
    <Box className="main">
      <Box className="header">
        <AppHeader />
      </Box>
      <Box className="chat">
        <Chat />
      </Box>
      <Box className="query">
        <Box
          borderColor="border.default"
          borderWidth={1}
          borderStyle="solid"
          borderRadius={15}
          boxShadow="shadow.medium"
          marginRight={2}
          p={3}
        >
          Items
        </Box>
      </Box>
      <Box className="footer" bg="neutral.emphasisPlus">
        <Box color="fg.onEmphasis">
          <Text>&copy;2023 Microsoft</Text>
        </Box>
      </Box>
    </Box>
  );
}

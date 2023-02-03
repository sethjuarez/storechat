import { Box, TextInput, IconButton, PointerBox } from "@primer/react";
import { ArrowRightIcon } from "@primer/octicons-react";
import { useState, useRef, useEffect } from "react";
import { default as TurnBubble } from "./turn";
import { Turn, TurnResponse, TurnRequest, Customer } from "@types";
import { useAppDispatch, useAppSelector } from "@services/hooks";
import { addRequest } from "@services/chatSlice";
import { RootState } from "@services/store";

type Props = {
  customer: Customer;
  sendPrompt: (prompt: string) => Promise<void>;
};

const Chat = ({ customer, sendPrompt }: Props) => {
  const chat = useAppSelector((state) => state.chat);
  const dispatch = useAppDispatch();

  const [message, setMessage] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const chatDiv = useRef<HTMLDivElement>(null);
  const chatContainer = useRef<HTMLDivElement>(null);
  const chatMessageBox = useRef<HTMLInputElement>(null);
  const musicPlayers = useRef<HTMLAudioElement | undefined>(
    typeof Audio !== "undefined" ? new Audio("/audio/message.mp3") : undefined
  );

  const toggleDisabled = () => {
    if (chatMessageBox.current) {
      if (chatMessageBox.current.disabled) {
        chatMessageBox.current.disabled = false;
        chatMessageBox.current.focus();
      } else {
        chatMessageBox.current.disabled = true;
      }
    }
  };

  const handleMessage = async () => {
    if (message.trim().length > 0) {
      toggleDisabled();
      dispatch(addRequest(message));
      setIsThinking(true);
      await sendPrompt(message);
      musicPlayers.current?.play();
      setIsThinking(false);
      setMessage("");
      toggleDisabled();
    }
  };

  useEffect(() => {
    if (chatDiv.current) {
      chatDiv.current.scrollTop =
        chatDiv.current.scrollHeight - chatDiv.current.clientHeight;
    }
  }, [isThinking]);

  return (
    <Box
      className="chatbox"
      borderColor="border.default"
      borderWidth={1}
      borderStyle="solid"
      borderRadius={15}
      boxShadow="shadow.medium"
      marginLeft={2}
      p={3}
      bg="canvas.subtle"
      ref={chatContainer}
    >
      <Box className="dialog" ref={chatDiv}>
        {chat.map((turn, i) => (
          <TurnBubble customer={customer} key={i} turn={turn} />
        ))}
      </Box>
      <Box className="entry">
        <TextInput
          ref={chatMessageBox}
          aria-label="chat"
          name="chat"
          placeholder="How can we help you?"
          sx={{
            flexGrow: 1,
          }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyUp={(e) => {
            if (e.code === "Enter") handleMessage();
          }}
        />
        <IconButton
          onClick={() => handleMessage()}
          aria-label="Search"
          icon={ArrowRightIcon}
          sx={{ marginLeft: 1 }}
        />
      </Box>
    </Box>
  );
};

export default Chat;

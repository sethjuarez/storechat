import { Box, TextInput, IconButton, PointerBox } from "@primer/react";
import { ArrowRightIcon } from "@primer/octicons-react";
import { useState, useRef, UIEventHandler, useEffect } from "react";
import { default as TurnBubble } from "./turn";
import { Turn } from "@types";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Turn[]>([]);
  const chat = useRef<HTMLDivElement>(null);
  const chatContainer = useRef<HTMLDivElement>(null);
  const chatMessageBox = useRef<HTMLInputElement>(null);
  const audio = new Audio("/audio/message.mp3");

  const getMessage = (message: string): Promise<Turn> => {
    return new Promise<Turn>((resolve, reject) => {
      setTimeout(() => {
        resolve({
          message: "thanks for your question => " + message,
          status: "done",
          type: "bot",
        });
      }, 1000);
    });
  };

  const handleMessage = async () => {
    if (chatMessageBox.current) chatMessageBox.current.disabled = true;
    if (message.trim().length > 0) {
      setMessages([
        ...messages,
        { message: message, status: "done", type: "user" },
        {
          message: "thanks for your question!",
          status: "waiting",
          type: "bot",
        },
      ]);
      const response = await getMessage(message);
      audio.play();
      setMessages([
        ...messages,
        { message: message, status: "done", type: "user" },
        response,
      ]);
    }

    
    setMessage("");
    if (chatMessageBox.current) {
      chatMessageBox.current.disabled = false;
      chatMessageBox.current.focus();
    }
  };

  useEffect(() => {
    if (chat.current) {
      chat.current.scrollTop =
        chat.current.scrollHeight - chat.current.clientHeight;
    }
  }, [messages]);

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
      <Box className="dialog" ref={chat}>
        {messages.map((turn, i) => (
          <TurnBubble key={i} turn={turn} />
        ))}
      </Box>
      <Box className="entry">
        <TextInput
          ref={chatMessageBox}
          aria-label="chat"
          name="chat"
          placeholder="start chatting!"
          autoComplete="postal-code"
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
          onClick={handleMessage}
          aria-label="Search"
          icon={ArrowRightIcon}
        />
      </Box>
    </Box>
  );
};

export default Chat;

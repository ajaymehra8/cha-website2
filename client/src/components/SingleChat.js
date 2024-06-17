import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import Lottie from 'react-lottie';
import io from "socket.io-client";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { getSender, getSenderFull } from "../config/chatLogics";
import ProfileModel from "./ProfileModel";
import UpdateGroup from "./UpdateGroup";
import animationData from '../animations/typing.json';
import "./style.css";

const ENDPOINT = "http://localhost:8000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const { user, selectedChat, setSelctedChat } = ChatState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const toast = useToast();

  const defaultOptions={
    loop:true,
    autoplay:true,
    animationData,
    rendererSettings:{
      preserveAspectRation:"xMidYMid slice",
    }
  }

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => {
      setSocketConnected(true);
    });
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  const fetchMessages = async () => {
    if (!selectedChat) {
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.jwt}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:8000/api/v1/message/${selectedChat._id}`,
        config
      );
      setMessages(data.messages);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (err) {
      console.log(err);
      toast({
        title: "Problem in accessing chat",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    const handleMessageReceived = (newMessageReceived) => {
      console.log("Message received handler called");
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        // Handle notification
        console.log("New message for a different chat:", newMessageReceived);
      } else {
        console.log("New message for the current chat,:", newMessageReceived);
        setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
      }
    };

    socket.on("message received", handleMessageReceived);

    console.log("useEffect called - socket listener added");

    // Cleanup function to remove the event listener
    return () => {
      socket.off("message received", handleMessageReceived);
      console.log("useEffect cleanup - socket listener removed");
    };
  }, [selectedChatCompare]);

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      socket.emit('stop typing',selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.jwt}`,
          },
        };

        const { data } = await axios.post(
          "http://localhost:8000/api/v1/message",
          {
            message: newMessage,
            chatId: selectedChat._id,
          },
          config
        );

        setNewMessage("");
        socket.emit("new message", data.nowMessage);
        setMessages((prevMessages) => [...prevMessages, data.nowMessage]);
      } catch (err) {
        console.log("Error sending message:", err);
        // Handle error (use a toast notification library if available)
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    // Typing indicator logic here
    if (!socketConnected) {
      return;
    }
    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && isTyping) {
        socket.emit("stop typing", selectedChat._id);
        setIsTyping(false);
      }
    }, timerLength);
  };
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w={"100%"}
            fontFamily={"Work sans"}
            display={"flex"}
            justifyContent={{ base: "space-between" }}
            alignItems={"center"}
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<i class="bi bi-arrow-left"></i>}
              onClick={() => {
                setSelctedChat("");
              }}
            />
            {!selectedChat?.isGroupedChat ? (
              <>
                {getSender(user, selectedChat.users).toUpperCase()}
                <ProfileModel user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroup
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"flex-end"}
            p={3}
            bg={"#E8E8E8"}
            w={"100%"}
            h={"100%"}
            borderRadius={"lg"}
            overflowY={"hidden"}
          >
            {/* Messages here */}
            {loading ? (
              <Spinner
                size={"xl"}
                w={20}
                h={20}
                alignSelf={"center"}
                margin={"auto"}
              />
            ) : (
              <div className="message">
                {/* Messages */}
                <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl onKeyDown={sendMessage}>
              {isTyping&&<div><Lottie 
             options={defaultOptions}
              width={70}
              style={{marginBottom:15,marginLeft:0}}
              /></div>}
              <Input
                variant={"filled"}
                value={newMessage}
                bg={"#E0E0E0"}
                placeholder="Enter a message.."
                onChange={(e) => {
                  typingHandler(e);
                }}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          h={"100%"}
        >
          <Text fontSize={"3xl"} pb={3} fontFamily={"Work sans"}>
            Click on a user to start chatting
          </Text>
        </Box>
      )}{" "}
    </>
  );
};

export default SingleChat;

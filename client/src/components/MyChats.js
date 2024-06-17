import { Box, Stack, Text } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import { Button } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import { getSender } from "../config/chatLogics";
import GroupChatModal from "./GroupChatModal";
import { useEffect } from "react";
const MyChats = ({fetchAgain}) => {
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const toast = useToast();

  const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.jwt}`,
        },
      };

      const { data } = await axios.get(
        "http://localhost:8000/api/v1/chat",
        config
      );
      setChats(data.chats);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
useEffect(()=>{
  fetchChats();
},[fetchAgain])
  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDirection={"column"}
      alignItems={"center"}
      p={3}
      bg={"white"}
      w={{ base: "100%", md: "31%" }}
      borderRadius={"lg"}
      borderWidth={"1px"}
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily={"Work sans"}
        display={"flex"}
        width={"100%"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        My Chats
        <GroupChatModal>
          <Button
            display={"flex"}
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<i className="bi bi-plus-lg"></i>}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        display={"flex"}
        flexDirection={"column"}
        p={3}
        bg={"#f8f8f8"}
        w={"100%"}
        h={"100%"}
        borderRadius={"lg"}
        overflowY={"hidden"}
      >
        {chats ? (
          <Stack overflowY={"scroll"}>
            {chats.map((c) => (
              <Box
                onClick={() => {
                  setSelectedChat(c);
                }}
                cursor={"pointer"}
                bg={selectedChat === c ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === c ? "white" : "black"}
                px={3}
                py={2}
                borderRadius={"lg"}
                key={c._id}
              >
                <Text>
                  {!c.isGroupedChat ? getSender(user, c.users, c) : c.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;

import React, { useState } from "react";
import {
  FormControl,
  IconButton,
  Image,
  Input,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Box,
  useToast,
} from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import UserListItem from "./UserListItem";
import axios from "axios";
import UserBadgeItem from "./UserBadgeItem";

const UpdateGroup = ({ fetchAgain, setFetchAgain,fetchMessages }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { selectedChat, setSelectedChat, user,chats,setChats } = ChatState();
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState();
  const [searchResults, setSearchResults] = useState();
  const [loading, setLoading] = useState(false);
  const [renameLoad, setRenameLoad] = useState(false);

  const toast = useToast();
  const handleRename = async () => {
    if (!groupChatName) {
      return;
    }
    try {
      setRenameLoad(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.jwt}`,
        },
      };
      const { data } = await axios.patch(
        "https://cha-website2.vercel.app/api/v1/chat/rename-group",
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );
      setSelectedChat(data.chat);
      setFetchAgain(!fetchAgain);
      setRenameLoad(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to search the user",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setRenameLoad(false);
      setGroupChatName("");
    }
  };
  const handleRemove = async(user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id!==user._id) {
        toast({
          title: "Only group admin can add anyone in group",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
        return;
      }

      try {
        setLoading(true);
        const config = {
          headers: {
            Authorization: `Bearer ${user.jwt}`,
          },
        };
        const { data } = await axios.patch(
          `https://cha-website2.vercel.app/api/v1/chat/remove-someone`,
          { chatId: selectedChat._id, userId: user1._id },
          config
        );
        user1._id===user._id?setSelectedChat():setSelectedChat(data.chat);
        fetchMessages();
        setFetchAgain(!fetchAgain);
        setLoading(false);  
      } catch (error) {
        console.log(error);
        toast({
            description: "Problem in removing user",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
          });
    
          setLoading(false);   
      }
  };
  const handleGroup = async (user1) => {
    if (selectedChat.users.includes(user1._id)) {
      toast({
        title: "User is already in group",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only group admin can add anyone in group",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.jwt}`,
        },
      };
      const { data } = await axios.patch(
        `https://cha-website2.vercel.app/api/v1/chat/add-to-group`,
        { chatId: selectedChat._id, userId: user1._id },
        config
      );
      setSelectedChat(data.chat);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to search the user",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });

      setLoading(false);
    }
  };
  const handleSearch = async (value) => {
    setSearch(value);
    if (!value) {
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
        `https://cha-website2.vercel.app/api/v1/user?search=${search}`,
        config
      );

      setLoading(false);
      setSearchResults(data.users);
    } catch (err) {
      toast({
        title: "Error Occured!",
        description: "Failed to search the user",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  return (
    <>
      <IconButton
        onClick={onOpen}
        display={{ base: "flex" }}
        icon={<i className="bi bi-eye"></i>}
      >
        Open Modal
      </IconButton>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            fontFamily={"Work sans"}
            display={"flex"}
            justifyContent={"center"}
          >
            {selectedChat.chatName.toUpperCase()}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w={"100%"} display={"flex"} flexWrap={"wrap"} pb={3}>
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => {
                    handleRemove(u);
                  }}
                />
              ))}
            </Box>

            <FormControl display={"flex"}>
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => {
                  setGroupChatName(e.target.value);
                }}
              />
              <Button
                variant={"solid"}
                colorScheme="teal"
                ml={1}
                isLoading={renameLoad}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>

            <FormControl>
              <Input
                placeholder="Add Users"
                mb={1}
                onChange={(e) => {
                  handleSearch(e.target.value);
                }}
              />
            </FormControl>
            {loading ? (
              <Spinner size={"lg"} />
            ) : (
              searchResults
                ?.slice(0, 4)
                .map((u) => (
                  <UserListItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleGroup(u)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              onClick={() => {
                handleRemove(user);
              }}
            >
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroup;

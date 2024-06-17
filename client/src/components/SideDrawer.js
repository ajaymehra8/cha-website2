import { Box, Button, Tooltip,Text, Menu, MenuButton, MenuList, Avatar, MenuItem, MenuDivider, Input, Spinner } from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from '../Context/ChatProvider';
import ProfileModel from "./ProfileModel";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  useToast,
  useDisclosure
} from '@chakra-ui/react';
import ChatLoading from "./ChatLoading";
import UserListItem from "./UserListItem";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [laodingChat, setLoadingChat] = useState(false);

const {user,setSelectedChat,chats,setChats}=ChatState();
const navigate=useNavigate();
const toast=useToast();
const accessChat=async(userId)=>{
try{
  setLoadingChat(true);
  const config={
    "Content-type":"application/json",
    headers:{
Authorization:`Bearer ${user.jwt}`
    }
  };
  const {data}=await axios.post("https://cha-website2.vercel.app/api/v1/chat",{userId},config);
if(!chats?.find((c)=>c._id===data.chat._id)){
  setChats([data.chat,...chats])
}

  setSelectedChat(data.chat);
  setLoadingChat(false);
  onClose();

}catch(err){
  console.log(err);
  toast({
    title:"Problem in accessing chat",
    status:"warning",
    duration:5000,
    isClosable:true,
    position:"top-left"
  });
}
}
const handleSearch=async()=>{
if(!search){
toast({
  title:"Please enter something in search",
  status:"warning",
  duration:5000,
  isClosable:true,
  position:"top-left"
});
}
try{
  setLoading(true);
  const config={
    headers:{
Authorization:`Bearer ${user.jwt}`
    }
  };
  const {data}=await axios.get(`https://cha-website2.vercel.app/api/v1/user?search=${search}`,config);

  setLoading(false);
  setSearchResult(data.users);
}catch(err){
  toast({
    title:"Problem in searching",
    status:"warning",
    duration:5000,
    isClosable:true,
    position:"top-left"
  });
  console.log(err);
}
}

const { isOpen, onOpen, onClose } = useDisclosure()

const logoutHandler=()=>{
  localStorage.removeItem("userInfo");
  navigate("/");
}
  return (
    <>
      <Box
      display={'flex'}
      bg={'white'}
      justifyContent={'space-between'}
      alignItems={'center'}
      w={'100%'}
      p={'5px 10px'}
      borderWidth={'5px'}
      >
        <Tooltip label="Search userss to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="bi bi-search"></i>
            <Text display={{base:"none", md:"flex"}} px={'4'}>Search user</Text>
          </Button>
        </Tooltip>

        <Text fontSize={'2xl'} fontFamily={'Work sans'}>
          Talk-E-Tive
        </Text>

        <div>
          <Menu>
            <MenuButton p={1}>
            <i className="bi bi-bell-fill" style={{fontSize:"20px",margin:'1px'}}></i>
            </MenuButton>
            <MenuList>
               
            </MenuList>
            </Menu>
            <Menu>
            <MenuButton as={Button} rightIcon={<i className="bi bi-chevron-down"></i>}>
<Avatar size={'sm'} cursor={'pointer'} name={user.name} src={user.pic}/>
              </MenuButton>
            <MenuList>
              <ProfileModel user={user}>
               <MenuItem>My Profile</MenuItem>
               </ProfileModel>
               <MenuDivider/>
               <MenuItem onClick={logoutHandler}>Logout</MenuItem>

            </MenuList>
            </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay/>
        <DrawerContent>
          <DrawerHeader borderBottomWidth={'1px'}>Search Users</DrawerHeader>

          <DrawerBody>
          <Box display={'flex'} pb={2}>
<Input
placeholder="Search by name or email"
mr={2}
value={search}
onChange={(e)=>{setSearch(e.target.value)}}
/>
<Button onClick={handleSearch}>Go</Button>
          </Box>

          {loading?(
<ChatLoading/>
          ):(
            searchResult.map((user)=>{
           return  <UserListItem
              key={user._id}
              user={user}
              handleFunction={()=>{accessChat(user._id)}}
              />
            })
          )}
          {laodingChat&&<Spinner ml={'auto'} display={'flex'}/>}
        </DrawerBody>
        </DrawerContent>
       
      </Drawer>
    </>
  );
};

export default SideDrawer;

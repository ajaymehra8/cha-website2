import React, { useState } from 'react';
import { FormControl, Input, useDisclosure } from '@chakra-ui/react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Box,
    useToast
  } from '@chakra-ui/react';
import { ChatState } from '../Context/ChatProvider';
import UserListItem from './UserListItem';
import axios from 'axios';
import UserBadgeItem from './UserBadgeItem';
const GroupChatModal = ({children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
const[groupChatName,setGroupChatName]=useState();
const[selectedUsers,setSelectedUsers]=useState([]);
const[search,setSearch]=useState();
const[searchResults,setSearchResults]=useState([]);
const[loading,setLoading]=useState(false);

const toast=useToast();
const {user,chats,setChats}=ChatState();

const handleSearch=async(value)=>{
setSearch(value);
if(!value){
    return;
}
try{
setLoading(true);
const config = {
    headers: {
      Authorization: `Bearer ${user.jwt}`,
    },
  };
  const {data}=await axios.get(`http://localhost:8000/api/v1/user?search=${search}`,config);

setLoading(false);
setSearchResults(data.users);
}catch(err){
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
}

const handleSubmit=async()=>{
if(!groupChatName || !selectedUsers){
    toast({
        description: "Please provide all required info",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
}
try{
    const config = {
        headers: {
          Authorization: `Bearer ${user.jwt}`,
        },
      };
      const {data}=await axios.post("http://localhost:8000/api/v1/chat/group",{
        name:groupChatName,
        users:JSON.stringify(selectedUsers.map(u=>(
            u._id
        )))
      },config);
      setChats([data.chat,...chats]);
      onClose();
      toast({
        description: "New group chat created",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
}catch(err){
    console.log(err);
    toast({
        description: "Problem in creating group",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      return;

}
}
const handleDelete=(user)=>{
setSelectedUsers(selectedUsers.filter(sel=>sel._id!==user._id));
}
const handleGroup=(user)=>{
if(selectedUsers.includes(user)){
    toast({
        title: "User is already in group",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
}
setSelectedUsers([...selectedUsers,user]);
}

    return (
      <div>
        <span onClick={onOpen}>{children}</span>
         <Modal isOpen={isOpen} onClose={onClose} size={'lg'} isCentered>
          <ModalOverlay />
          <ModalContent height={'410px'}>
            <ModalHeader
            fontSize={'35px'}
            fontFamily={'Work sans'}
            display={'flex'}
            justifyContent={'center'}
            >
Create Group Chat
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody
            display={'flex'}
            flexDirection={'column'}
            alignItems={'center'}
            >
  
  
  <FormControl>
    <Input
    placeholder='Chat Name'
    mb={3}
    value={groupChatName}
    onChange={(e)=>{setGroupChatName(e.target.value)}}
    />
  </FormControl>
  
  <FormControl>
    <Input
    placeholder='Add Users'
    mb={1}
    onChange={(e)=>{handleSearch(e.target.value)}}
    />
  </FormControl>  
{/* selected users */}
<Box width={'100%'} display={'flex'} flexWrap={'wrap'}>
{selectedUsers.map(u=>(
    <UserBadgeItem key={u._id} user={u} handleFunction={()=>{handleDelete(u)}}/>
))}
</Box>

{loading?<div>loading...</div>:(
    searchResults?.slice(0,4).map(u=>(
<UserListItem
key={u._id}
user={u}
handleFunction={()=>handleGroup(u)}
/>
    )
)
)}
            </ModalBody>
  
            <ModalFooter>
              <Button colorScheme='blue' onClick={handleSubmit}>
                Create Chat
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    )
}

export default GroupChatModal

import React,{useState} from 'react';
import { ChatState } from '../Context/ChatProvider';
import { Box } from '@chakra-ui/react';
import SideDrawer from '../components/SideDrawer';
import MyChats from '../components/MyChats';
import ChatBox from '../components/ChatBox';

const Chat = () => {
const {user}=ChatState();
const [fetchAgain,setFetchAgain]=useState(false);

  return (
    <div style={{width:"100%"}}>
      {user&&<SideDrawer/>}
      <Box
      display={"flex"}
      justifyContent={"space-between"}
      width="100%"
      height={"95.5vh"}
      p={"10px"}>
        {user&&<MyChats  fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
        {user&&<ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
        </Box>
    </div>
  )
}

export default Chat

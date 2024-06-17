import React from 'react'
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import {
 
  VStack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";

import { loginApi } from '../../Api/auth';
const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [show,setShow]=useState(false);
    const [loading,setLoading]=useState(false);
    const toast=useToast();
    const navigate=useNavigate();
    const submintHandler = async () => {
      setLoading(true);
      if ( !email || !password) {
        toast({
          title: "Please fill all the fields.",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        return;
      }
      
      try{
      const data = await loginApi(email, password);
      toast({
        title: "Logged in successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo",JSON.stringify(data));
      navigate('/chats');
  
    }catch(err){
      toast({
        title: "Unknown problem",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      console.log(err);
    }
    setLoading(false);
    };
  return (
    <VStack spacing={"5px"} color={"black"}>
    <FormControl id="first-name" isRequired>
      <FormLabel>Email</FormLabel>
      <Input
        placeholder="Enter your Email"
        onChange={(e) => setEmail(e.target.value)}
      />
    </FormControl>
   

    <FormControl id="password" isRequired>
      <FormLabel>Password</FormLabel>
      <InputGroup>
      <Input
      type={show?"text":"password"}
        placeholder="Enter your password"
        onChange={(e) => setPassword(e.target.value)}
      />
<InputRightElement width={'4.5rem'}>
<Button h="1.75rem" size={"sm"} onClick={()=>{setShow(!show)}}>
{show?"Hide":"Show"}
</Button>
</InputRightElement>
</InputGroup>
    </FormControl>
    
    <Button 
    colorScheme="blue"
    width={"100%"}
    style={{marginTop:15}}
    onClick={submintHandler}
    >
      Log in
    </Button>
    <Button 
    colorScheme="red"
    width={"100%"}
    style={{marginTop:15}}
    onClick={()=>{
        setEmail("guest@example.com");
        setPassword("123456");
    }}
    >
      Log in as a guest
    </Button>
  </VStack>
  )
}

export default Login

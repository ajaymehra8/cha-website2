import React from 'react';
import { IconButton, Image, useDisclosure } from '@chakra-ui/react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Text
  } from '@chakra-ui/react';

const ProfileModel = ({user,children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <div>
      {children?<span onClick={onOpen}>{children}</span>:(
        <IconButton display={{base:'flex'}} icon={<i class="bi bi-eye"></i>} onClick={onOpen}/>
      )}
       <Modal isOpen={isOpen} onClose={onClose} size={'lg'} isCentered>
        <ModalOverlay />
        <ModalContent height={'410px'}>
          <ModalHeader
          fontSize={'40px'}
          fontFamily={'Work sans'}
          display={'flex'}
          justifyContent={'center'}
          >{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody
          display={'flex'}
          flexDirection={'column'}
          alignItems={'center'}
          justifyContent={'space-between'}
          >
<Image
borderRadius={'full'}
boxSize={'150px'}
src={user.pic}
alt={user.name}
/>
<Text
fontSize={{base:'28px', md:'30px'}}
fontFamily="Work sans"
>
Email:{user.email}
</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default ProfileModel

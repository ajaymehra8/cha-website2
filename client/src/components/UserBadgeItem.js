import { Box, IconButton } from "@chakra-ui/react";
import React from "react";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box
      px={2}
      py={1}
      borderRadius={"lg"}
      m={1}
      mb={2}
      variant={"solid"}
      fontSize={12}
      backgroundColor={"purple"}
      color={"white"}
      cursor={"pointer"}
    >
      {user.name.toUpperCase()}
      <IconButton
        icon={<i class="bi bi-x"></i>}
        background={"purple"}
        color={"white"}
        onClick={handleFunction}
      />
    </Box>
  );
};

export default UserBadgeItem;

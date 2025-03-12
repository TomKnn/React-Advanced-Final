import React from "react";
import { Box, Heading, Text, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <Box textAlign="center" p={10}>
      <Heading size="2xl" mb={4}>
        404
      </Heading>
      <Text fontSize="xl" mb={4}>
        Oops! This page does not exist.
      </Text>
      <Link to="/">
        <Button colorScheme="blue">Go back home</Button>
      </Link>
    </Box>
  );
};

export default NotFoundPage;

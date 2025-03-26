import React from "react";
import { Routes, Route } from "react-router-dom";
import { ChakraProvider, Box, Heading } from "@chakra-ui/react";
import EventsPage from "./pages/EventsPage";
import EventPage from "./pages/EventPage";
import NotFoundPage from "./pages/NotFoundPage";
import UserPage from "./UserPage";

function App() {
  return (
    <ChakraProvider>
      <Box p={4}>
        <Heading mb={4}>Events</Heading>
        <Routes>
          <Route path="/" element={<EventsPage />} />
          <Route path="/event/:eventId" element={<EventPage />} />
          <Route path="/user/:userId" element={<UserPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Box>
    </ChakraProvider>
  );
}

export default App;

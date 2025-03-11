import React from "react";
import { Routes, Route } from "react-router-dom";
import { ChakraProvider, Box, Heading } from "@chakra-ui/react";
import EventsPage from "./pages/EventsPage";
import EventPage from "./pages/EventPage";

function App() {
  return (
    <ChakraProvider>
      <Box p={4}>
        <Heading mb={4}>Events</Heading>
        <Routes>
          <Route path="/" element={<EventsPage />} />
          <Route path="/event/:eventId" element={<EventPage />} />
        </Routes>
      </Box>
    </ChakraProvider>
  );
}

export default App;

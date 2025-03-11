import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Heading, Text, Button, Input } from "@chakra-ui/react";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/events")
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error("Error fetching events:", error));
  }, []);

  const handleAddEvent = () => {
    if (!title || !date || !location) return;

    const newEvent = { id: events.length + 1, title, date, location };
    setEvents([...events, newEvent]);
    setTitle("");
    setDate("");
    setLocation("");
  };

  return (
    <Box>
      <Heading size="lg" mb={4}>
        List of events
      </Heading>
      {events.map((event) => (
        <Box key={event.id} mb={3} p={3} borderWidth="1px" borderRadius="lg">
          <Heading size="md">{event.title}</Heading>
          <Text>
            {event.date} - {event.location}
          </Text>
          <Link to={`/event/${event.id}`}>
            <Button mt={2} colorScheme="blue">
              View Details
            </Button>
          </Link>
        </Box>
      ))}
      <Box mt={4}>
        <Heading size="md">Add Event</Heading>
        <Input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          mb={2}
        />
        <Input
          placeholder="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          mb={2}
        />
        <Input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          mb={2}
        />
        <Button colorScheme="green" onClick={handleAddEvent}>
          Add
        </Button>
      </Box>
    </Box>
  );
};

export default EventsPage;

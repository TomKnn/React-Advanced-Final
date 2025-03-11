import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Heading, Text } from "@chakra-ui/react";

const EventPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/events/${eventId}`)
      .then((response) => response.json())
      .then((data) => setEvent(data))
      .catch((error) => console.error("Error fetching event:", error));
  }, [eventId]);

  if (!event) return <h2>Loading event...</h2>;

  return (
    <Box>
      <Heading>{event.title}</Heading>
      <Text><strong>Date:</strong> {event.date}</Text>
      <Text><strong>Location:</strong> {event.location}</Text>
    </Box>
  );
};

export default EventPage;

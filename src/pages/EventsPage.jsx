import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Heading, Text, Button, Input } from "@chakra-ui/react";

// 🔹 EventsPage = een pagina met:
// - een formulier om een nieuw event toe te voegen (title, date, location)
// - een lijst van events die uit de server wordt opgehaald (via fetch)
// - we slaan de ingevulde gegevens én de opgehaalde lijst op in state
// - alles gebeurt binnen deze component (tussen de { } van EventsPage)

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");

  // 1. Bij laden van de pagina wordt useEffect gestart
  // 2. De lijst met events wordt opgehaald van de server
  useEffect(() => {
    fetch("http://localhost:3000/events")
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error("Error fetching events:", error));
  }, []);

  const handleAddEvent = () => {
    if (!title || !date || !location) return;

    const newEvent = { title, date, location };

    // 4. Als gebruiker op "Add" klikt én de velden zijn ingevuld:
    //    - wordt een nieuw event-object gemaakt
    //    - wordt dit met een POST-verzoek naar de server gestuurd
    //    - wordt het nieuwe event toegevoegd aan de lijst
    fetch("http://localhost:3000/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEvent),
    })
      .then((response) => response.json())
      .then((data) => {
        setEvents([...events, data]);
        setTitle("");
        setDate("");
        setLocation("");
      })
      .catch((error) => console.error("Error adding event:", error));
  };

  // 3. Alle events worden weergegeven in de UI via map()
  // 5. Elk event wordt weergegeven in een Box met unieke key (event.id)
  // 6. De titel, datum en locatie van het event worden getoond
  // 7. Link stuurt naar de detailpagina van het event op basis van event.id
  // 8. De 'View Details'-knop zit binnen de Link en navigeert naar de eventpagina
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

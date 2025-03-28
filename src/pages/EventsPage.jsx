import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Heading, Text, Button, Input, Select } from "@chakra-ui/react";

// 🔹 EventsPage = een pagina met:
// - een formulier om een nieuw event toe te voegen (title, date, location)
// - een lijst van events die uit de server wordt opgehaald (via fetch)
// - een zoekfunctie én filterfunctie op categorie
// - we slaan de ingevulde gegevens én de opgehaalde lijst op in state
// - alles gebeurt binnen deze component (tussen de { } van EventsPage)

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // Zoekveld
  const [selectedCategory, setSelectedCategory] = useState(""); // Filtercategorie

  // stap 1 - vereiste 1: Bij laden van de pagina wordt useEffect gestart
  // stap 2 - vereiste 1: De lijst met events wordt opgehaald van de server
  useEffect(() => {
    fetch("http://localhost:3000/events")
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error("Error fetching events:", error));
  }, []);

  // stap 13 - vereiste 12: Filter de events op zoekterm én geselecteerde categorie
  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "" || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddEvent = () => {
    if (!title || !date || !location) return;

    // stap 12 - vereiste 11: Voeg een event toe met veld 'startTime'
    const newEvent = {
      title,
      startTime: date, // server verwacht 'startTime'
      location,
    };

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

  // stap 3 - vereiste 1: Alle events worden weergegeven in de UI via map()
  // stap 5 - vereiste 1: Elk event wordt weergegeven in een Box met unieke key (event.id)
  // stap 6 - vereiste 1: De titel, datum en locatie van het event worden getoond
  // stap 7 - vereiste 2: Link stuurt naar de detailpagina van het event op basis van event.id
  // stap 8 - vereiste 2: De 'View Details'-knop zit binnen de Link en navigeert naar de eventpagina
  return (
    <Box>
      <Heading size="lg" mb={4}>
        List of events
      </Heading>

      {/* 🔹 Zoekveld op titel */}
      <Input
        placeholder="Search events by title"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        mb={3}
      />

      {/* 🔹 Filter op categorie */}
      <Select
        placeholder="Filter by category"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        mb={5}
      >
        <option value="Meetup">Meetup</option>
        <option value="Workshop">Workshop</option>
      </Select>

      {/* 🔸 Eventlijst (na zoek/filter) */}
      {filteredEvents.map((event) => (
        <Box key={event.id} mb={3} p={3} borderWidth="1px" borderRadius="lg">
          <Heading size="md">{event.title}</Heading>
          <Text>
            {event.startTime || event.date} - {event.location}
          </Text>

          <Link to={`/event/${event.id}`}>
            <Button mt={2} colorScheme="blue">
              View Details
            </Button>
          </Link>
        </Box>
      ))}

      {/* 🔹 Voeg nieuw event toe */}
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

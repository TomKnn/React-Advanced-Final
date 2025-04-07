import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  Button,
  Input,
  Select,
  Textarea,
  useToast,
  Image, // ✅ HIER stond de fout
} from "@chakra-ui/react";

//   EventsPage, bevat:
// - een formulier om een nieuw event toe te voegen (title, date, location)
// - een lijst van events die uit de server wordt opgehaald (fetch)
// - een zoekfunctie / filterfunctie op categorie
// - state slaat de ingevulde gegevens en opgehaalde lijst op

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [endDate, setEndDate] = useState(""); // feedback: should have – einddatum toevoegen
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState(""); // feedback: must have – nieuwe state voor beschrijving
  const [category, setCategory] = useState(""); // feedback: must have – nieuwe state voor categorie
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const toast = useToast(); // feedback: should have – om gebruikersfeedback te tonen

  // vereiste 1: Bij laden van de pagina wordt useEffect gestart
  // vereiste 1: De lijst met events wordt opgehaald van de server
  useEffect(() => {
    fetch("http://localhost:3000/events")
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error("Error fetching events:", error));
  }, []);

  // vereiste 12: Filter de events op zoekterm én geselecteerde categorie
  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "" || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddEvent = () => {
    if (!title || !date || !location || !description || !category) {
      // feedback: should have – waarschuwing bij incomplete invoer
      toast({
        title: "Please fill in all fields.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // vereiste 11: Voeg een event toe met veld 'startTime'
    // feedback: must have – voeg description en category toe
    // feedback: should have – voeg endTime toe
    const newEvent = {
      title,
      startTime: date,
      endTime: endDate,
      location,
      description,
      category,
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
        setEndDate(""); // feedback: should have – reset endDate
        setLocation("");
        setDescription(""); // feedback: must have – reset description
        setCategory(""); // feedback: must have – reset category
      })
      .catch((error) => console.error("Error adding event:", error));
  };

  // vereiste 1: Events worden weergegeven in de UI via map()
  // vereiste 1: Elk event wordt weergegeven in een Box met unieke key (event.id)
  // vereiste 1: De titel, datum en locatie van het event worden getoond
  // vereiste 3: De eventdata wordt correct weergegeven in de browser (UI)
  // vereiste 2: Link stuurt door naar de detailpagina van het event op basis van event.id
  // vereiste 2: De 'View Details'-knop zit binnen de link en navigeert naar de eventpagina
  return (
    <Box>
      <Heading size="lg" mb={4}>
        List of events
      </Heading>

      {/* Zoek op titel */}
      <Input
        placeholder="Search events by title"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        mb={3}
      />

      {/* Filter op categorie */}
      <Select
        placeholder="Filter by category"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        mb={5}
      >
        <option value="Meetup">Meetup</option>
        <option value="Workshop">Workshop</option>
      </Select>

      {/* Eventlijst */}
      {filteredEvents.length > 0 ? (
        filteredEvents.map((event) => (
          <Box key={event.id} mb={3} p={3} borderWidth="1px" borderRadius="lg">
            {/* feedback: should have – toon afbeelding bovenaan eventcard met nette styling */}
            {event.image && (
              <Image
                src={event.image}
                alt={event.title}
                height="180px"
                width="100%"
                objectFit="cover"
                borderRadius="md"
                mb={2}
              />
            )}
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
        ))
      ) : (
        // feedback: nice to have – toon melding als er geen resultaten zijn
        <Text>No events found.</Text>
      )}

      {/* Voeg een nieuwe event toe */}
      <Box mt={4}>
        <Heading size="md">Add Event</Heading>
        <Input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          mb={2}
        />
        <Input
          placeholder="Start Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          mb={2}
        />
        {/* feedback: should have – invoerveld voor endDate */}
        <Input
          placeholder="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          mb={2}
        />
        <Input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          mb={2}
        />
        {/* feedback: must have – invoerveld voor description */}
        <Textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          mb={2}
        />
        {/* feedback: must have – dropdown voor categorie */}
        <Select
          placeholder="Select category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          mb={2}
        >
          <option value="Meetup">Meetup</option>
          <option value="Workshop">Workshop</option>
        </Select>

        <Button colorScheme="green" onClick={handleAddEvent}>
          Add
        </Button>
      </Box>
    </Box>
  );
};

export default EventsPage;

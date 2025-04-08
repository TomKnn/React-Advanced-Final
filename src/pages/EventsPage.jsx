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
  Image,
} from "@chakra-ui/react";

// Helperfunctie voor nette datumweergave
const formatDate = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const toast = useToast();

  useEffect(() => {
    fetch("http://localhost:3000/events")
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error("Error fetching events:", error));
  }, []);

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
      toast({
        title: "Please fill in all fields.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEvent),
    })
      .then((res) => res.json())
      .then((data) => {
        setEvents([...events, data]);
        setTitle("");
        setDate("");
        setEndDate("");
        setLocation("");
        setDescription("");
        setCategory("");
      })
      .catch((error) => console.error("Error adding event:", error));
  };

  return (
    <Box p={4}>
      <Heading size="lg" mb={4}>
        List of events
      </Heading>

      <Input
        placeholder="Search events by title"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        mb={3}
      />

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
          <Box
            key={event.id}
            mb={4}
            p={4}
            borderWidth="1px"
            borderRadius="lg"
            maxW="400px"
            boxShadow="sm"
          >
            {event.image && (
              <Image
                src={event.image}
                alt={event.title}
                objectFit="contain"
                height="120px"
                width="100%"
                borderRadius="md"
                mb={3}
              />
            )}
            <Heading size="md">{event.title}</Heading>
            <Text fontSize="sm" mb={1}>
              {formatDate(event.startTime || event.date)} – {event.location}
            </Text>
            <Link to={`/event/${event.id}`}>
              <Button size="sm" colorScheme="blue">
                View Details
              </Button>
            </Link>
          </Box>
        ))
      ) : (
        <Text>No events found.</Text>
      )}

      {/* Voeg nieuw event toe */}
      <Box mt={10}>
        <Heading size="md" mb={3}>
          Add Event
        </Heading>
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
        <Textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          mb={2}
        />
        <Select
          placeholder="Select category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          mb={3}
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

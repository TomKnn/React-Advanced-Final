import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Input,
  Textarea,
  Image,
  useToast,
} from "@chakra-ui/react";

//   EventPage, laat details zien van 1 event:
// - haalt het juiste event op via het eventId uit de URL (useParams + fetch)
// - toont de titel, datum, locatie en beschrijving
// - bevat een 'Edit' knop die een modal opent met het bewerkformulier
// - bevat een 'Delete' knop met confirm() en DELETE-request
// - gebruikt state voor het event zelf en voor het formulier (formData)

const EventPage = () => {
  // vereiste 4: Haal event-id op uit de URL
  const { eventId } = useParams();

  const navigate = useNavigate();
  const toast = useToast();

  // vereiste 4: Zet eventgegevens en formdata in state
  const [event, setEvent] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
  });

  // vereiste 4: Haal eventdetails op bij laden van de pagina
  useEffect(() => {
    fetch(`http://localhost:3000/events/${eventId}`)
      .then((response) => response.json())
      .then((data) => {
        setEvent(data);
        setFormData({
          title: data.title || "",
          description: data.description || "",
          date: data.startTime?.split("T")[0] || data.date || "",
          location: data.location || "",
        });
      })
      .catch((error) => console.error("Error fetching event:", error));
  }, [eventId]);

  // vereiste 6: Verwerk wijzigingen in formuliervelden
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // vereiste 6: Verstuur PUT-request om event te bewerken
  // vereiste 8: Toon succes of foutmelding als toast
  const handleSubmit = () => {
    const updatedEvent = {
      ...event,
      title: formData.title,
      description: formData.description,
      startTime: formData.date ? `${formData.date}T00:00:00` : undefined,
      location: formData.location,
    };

    fetch(`http://localhost:3000/events/${eventId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedEvent),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Update failed");
        return response.json();
      })
      .then(() => {
        setIsOpen(false);
        toast({
          title: "Event updated",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch(() => {
        toast({
          title: "Failed to update event",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  // vereiste 7: Vraag om bevestiging en delete event
  const handleDelete = () => {
    const confirmDelete = window.confirm(
      "Weet je zeker dat je dit event wilt verwijderen?"
    );
    if (!confirmDelete) return;

    fetch(`http://localhost:3000/events/${eventId}`, {
      method: "DELETE",
    })
      .then(() => navigate("/"))
      .catch((error) => console.error("Error deleting event:", error));
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  if (!event) return <h2>Loading event...</h2>;

  return (
    <Box>
      <Heading>{event.title}</Heading>
      <Text>
        <strong>Date:</strong>{" "}
        {event.startTime?.split("T")[0] || event.date || ""}
      </Text>
      <Text>
        <strong>Location:</strong> {event.location}
      </Text>
      <Text>
        <strong>Description:</strong> {event.description}
      </Text>

      {/* vereiste 10: Toon wie het event heeft aangemaakt */}
      {event.createdBy && (
        <Box mt={4}>
          <Text fontWeight="bold">Created by:</Text>
          <Box display="flex" alignItems="center" gap={2}>
            <Image
              src={event.createdBy.image}
              alt={event.createdBy.name}
              borderRadius="full"
              boxSize="30px"
            />
            <Text>{event.createdBy.name}</Text>
          </Box>
        </Box>
      )}

      {/* vereiste 5: Open modal voor bewerken */}
      <Button mt={4} colorScheme="yellow" onClick={openModal} mr={2}>
        Edit
      </Button>

      {/* vereiste 7: Delete event */}
      <Button mt={4} colorScheme="red" onClick={handleDelete}>
        Delete
      </Button>

      {/* vereiste 6: Modal met formulier om te bewerken */}
      <Modal isOpen={isOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Title"
              mb={2}
            />
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              mb={2}
            />
            <Input
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              mb={2}
            />
            <Input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Location"
              mb={2}
            />
            <Button colorScheme="blue" onClick={handleSubmit}>
              Save Changes
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default EventPage;

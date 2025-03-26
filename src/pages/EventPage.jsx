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
} from "@chakra-ui/react";

const EventPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate(); // nodig voor navigatie na delete
  const [event, setEvent] = useState(null);
  const [isOpen, setIsOpen] = useState(false); // State om de modal te openen/sluiten
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
  });

  useEffect(() => {
    fetch(`http://localhost:3000/events/${eventId}`)
      .then((response) => response.json())
      .then((data) => {
        setEvent(data);
        setFormData({
          title: data.title || "",
          description: data.description || "",
          date: data.startTime?.split("T")[0] || "",
          location: data.location || "",
        });
      })
      .catch((error) => console.error("Error fetching event:", error));
  }, [eventId]);

  // Veranderingen in inputvelden opslaan in state
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Data opslaan en modal sluiten
  const handleSubmit = () => {
    fetch(`http://localhost:3000/events/${eventId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    }).then(() => setIsOpen(false)); // Sluit de modal na het opslaan
  };

  // 11. - vereiste 7: Verwijder dit event en keer terug naar homepage
  const handleDelete = () => {
    fetch(`http://localhost:3000/events/${eventId}`, {
      method: "DELETE",
    })
      .then(() => navigate("/"))
      .catch((error) => console.error("Error deleting event:", error));
  };

  const openModal = () => setIsOpen(true); // Modal openen
  const closeModal = () => setIsOpen(false); // Modal sluiten

  if (!event) return <h2>Loading event...</h2>;

  return (
    <Box>
      <Heading>{event.title}</Heading>
      <Text>
        <strong>Date:</strong> {event.date}
      </Text>
      <Text>
        <strong>Location:</strong> {event.location}
      </Text>
      {/*10. - vereiste 6: Toon de beschrijving van het event op de detailpagina*/}
      <Text>
        <strong>Description:</strong> {event.description}
      </Text>
      {/* 9. - vereiste 5: Edit-knop opent de modal om het event te bewerken */}
      <Button mt={4} colorScheme="yellow" onClick={openModal} mr={2}>
        Edit
      </Button>
      {/* 11. - vereiste 7: Delete-knop verwijdert het event */}
      <Button mt={4} colorScheme="red" onClick={handleDelete}>
        Delete
      </Button>

      {/* 10. - vereiste 5: Modal met formulier om event te bewerken */}
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

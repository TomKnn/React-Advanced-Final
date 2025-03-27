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
} from "@chakra-ui/react";

const EventPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
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
          date: data.startTime?.split("T")[0] || data.date || "",
          location: data.location || "",
        });
      })
      .catch((error) => console.error("Error fetching event:", error));
  }, [eventId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
    }).then(() => setIsOpen(false));
  };

  const handleDelete = () => {
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

      <Button mt={4} colorScheme="yellow" onClick={openModal} mr={2}>
        Edit
      </Button>
      <Button mt={4} colorScheme="red" onClick={handleDelete}>
        Delete
      </Button>

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

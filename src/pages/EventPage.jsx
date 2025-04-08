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
  Select,
} from "@chakra-ui/react";

//   EventPage – toont de details van één event:
// - haalt het juiste event op via het eventId uit de URL (useParams + fetch)
// - toont titel, datum, locatie, categorie en beschrijving van het event
// - toont wie het event heeft aangemaakt (must have)
// - bevat een Edit-knop → opent een modal met formulier (must have)
// - bevat een Delete-knop → bevestiging + verwijdert event (must have)
// - formulier bevat ook einddatum (should have)
// - dropdown om creator aan te passen (should have)
// - fallback placeholder image als er geen afbeelding is (should have)

const EventPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [event, setEvent] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    endDate: "",
    location: "",
    category: "",
    createdById: "",
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
          endDate: data.endTime?.split("T")[0] || "",
          location: data.location || "",
          category: data.category || "",
          createdById: data.createdBy?.id || "",
        });
      })
      .catch((error) => console.error("Error fetching event:", error));
  }, [eventId]);

  useEffect(() => {
    fetch("http://localhost:3000/users")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const updatedEvent = {
      ...event,
      title: formData.title,
      description: formData.description,
      startTime: formData.date ? `${formData.date}T00:00:00` : undefined,
      endTime: formData.endDate ? `${formData.endDate}T00:00:00` : undefined,
      location: formData.location,
      category: formData.category,
      createdBy:
        users.find((user) => user.id === formData.createdById) ||
        event.createdBy,
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

  const handleDelete = () => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

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
    <Box maxW="800px" mt={6} px={4}>
      {" "}
      {/* links uitgelijnd, geen mx="auto" */}
      <Heading size="lg" mb={4}>
        {event.title}
      </Heading>
      <Text>
        <strong>Date:</strong> {event.startTime?.split("T")[0]}
      </Text>
      <Text>
        <strong>End:</strong> {event.endTime?.split("T")[0] || "–"}
      </Text>
      <Text>
        <strong>Location:</strong> {event.location}
      </Text>
      <Text>
        <strong>Category:</strong> {event.category}
      </Text>
      <Text>
        <strong>Description:</strong> {event.description}
      </Text>
      {event.createdBy && (
        <Box mt={4} display="flex" alignItems="center" gap={2}>
          <Image
            src={event.createdBy.image}
            fallbackSrc="/images/placeholder.png"
            alt={event.createdBy.name}
            borderRadius="full"
            boxSize="50px"
          />
          <Text fontWeight="bold">Created by:</Text>
          <Text>{event.createdBy.name}</Text>
        </Box>
      )}
      <Box mt={6}>
        <Button colorScheme="yellow" onClick={openModal} mr={2}>
          Edit
        </Button>
        <Button colorScheme="red" onClick={handleDelete}>
          Delete
        </Button>
      </Box>
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
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              placeholder="End Date"
              mb={2}
            />
            <Input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Location"
              mb={2}
            />
            <Select
              name="category"
              value={formData.category}
              onChange={handleChange}
              mb={2}
              placeholder="Select category"
            >
              <option value="Meetup">Meetup</option>
              <option value="Workshop">Workshop</option>
            </Select>
            <Select
              name="createdById"
              value={formData.createdById}
              onChange={handleChange}
              placeholder="Select creator"
              mb={3}
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </Select>
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

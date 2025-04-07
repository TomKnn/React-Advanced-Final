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

  // Fetch event
  useEffect(() => {
    fetch(`http://localhost:3000/events/${eventId}`)
      .then((res) => res.json())
      .then((data) => {
        setEvent(data);
        setFormData({
          title: data.title || "",
          description: data.description || "",
          date: data.startTime?.split("T")[0] || "",
          endDate: data.endTime?.split("T")[0] || "",
          location: data.location || "",
          category: data.category || "",
          createdById: data.createdBy?.id || "",
        });
      })
      .catch((err) => console.error("Error fetching event:", err));
  }, [eventId]);

  // Fetch users
  useEffect(() => {
    fetch("http://localhost:3000/users")
      .then((res) => res.json())
      .then(setUsers)
      .catch((err) => console.error("Error fetching users:", err));
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
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
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
          title: "Failed to update",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm(
      "Weet je zeker dat je dit event wilt verwijderen?"
    );
    if (!confirmDelete) return;

    fetch(`http://localhost:3000/events/${eventId}`, {
      method: "DELETE",
    })
      .then(() => navigate("/"))
      .catch((err) => console.error("Error deleting event:", err));
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  if (!event) return <Text>Loading...</Text>;

  return (
    <Box maxW="600px" mx="auto" p={4}>
      <Heading mb={3}>{event.title}</Heading>

      <Text>
        <strong>Date:</strong> {event.startTime?.split("T")[0] || "–"}
      </Text>
      <Text>
        <strong>End:</strong> {event.endTime?.split("T")[0] || "–"}
      </Text>
      <Text>
        <strong>Location:</strong> {event.location || "–"}
      </Text>
      <Text>
        <strong>Category:</strong> {event.category || "–"}
      </Text>
      <Text mb={4}>
        <strong>Description:</strong> {event.description || "–"}
      </Text>

      {/* Creator info */}
      {event.createdBy && (
        <Box mb={4}>
          <Text fontWeight="bold">Created by:</Text>
          <Box display="flex" alignItems="center" gap={2} mt={1}>
            <Image
              src={
                event.createdBy.image?.trim()
                  ? event.createdBy.image
                  : "https://via.placeholder.com/50"
              }
              alt={event.createdBy.name}
              borderRadius="full"
              boxSize="30px"
            />
            <Text>{event.createdBy.name}</Text>
          </Box>
        </Box>
      )}

      {/* Edit / Delete buttons */}
      <Box mt={4}>
        <Button colorScheme="yellow" onClick={openModal} mr={3}>
          Edit
        </Button>
        <Button colorScheme="red" onClick={handleDelete}>
          Delete
        </Button>
      </Box>

      {/* Edit modal */}
      <Modal isOpen={isOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
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
              placeholder="Select category"
              mb={2}
            >
              <option value="Meetup">Meetup</option>
              <option value="Workshop">Workshop</option>
            </Select>
            <Select
              name="createdById"
              value={formData.createdById}
              onChange={handleChange}
              placeholder="Select creator"
              mb={4}
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

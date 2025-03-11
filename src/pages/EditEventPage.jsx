import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Heading, Input, Button, Textarea } from "@chakra-ui/react";

const EditEventPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [formData, setFormData] = useState({ title: "", description: "", date: "", location: "" });

  useEffect(() => {
    fetch(`http://localhost:3000/events/${eventId}`)
      .then((res) => res.json())
      .then((data) => {
        setEvent(data);
        setFormData({
          title: data.title || "",
          description: data.description || "",
          date: data.startTime?.split("T")[0] || "",
          location: data.location || "",
        });
      });
  }, [eventId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    fetch(`http://localhost:3000/events/${eventId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then(() => navigate("/"));
  };

  if (!event) return <h2>Loading event...</h2>;

  return (
    <Box>
      <Heading>Edit Event</Heading>
      <Input name="title" value={formData.title} onChange={handleChange} placeholder="Title" mb={2} />
      <Textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" mb={2} />
      <Input name="date" type="date" value={formData.date} onChange={handleChange} mb={2} />
      <Input name="location" value={formData.location} onChange={handleChange} placeholder="Location" mb={2} />
      <Button colorScheme="blue" onClick={handleSubmit}>Save Changes</Button>
    </Box>
  );
};

export default EditEventPage;

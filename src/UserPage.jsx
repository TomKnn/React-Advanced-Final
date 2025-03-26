import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Heading, Text, Image, List, ListItem } from "@chakra-ui/react";

const UserPage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [userComments, setUserComments] = useState([]);

  useEffect(() => {
    // Fetch user info
    fetch(`http://localhost:3000/users/${userId}`)
      .then((res) => res.json())
      .then((data) => setUser(data));

    // Fetch posts from this user
    fetch(`http://localhost:3000/posts?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => setUserPosts(data));

    // Fetch comments from this user (on any post)
    fetch(`http://localhost:3000/comments?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => setUserComments(data));
  }, [userId]);

  if (!user) return <Text>Loading user info...</Text>;

  return (
    <Box>
      <Heading>User: {user.name}</Heading>
      <Image
        src={user.image}
        alt={user.name}
        borderRadius="full"
        boxSize="50px"
        mb={4}
      />

      <Text fontWeight="bold" mt={4}>
        Posts:
      </Text>
      <List spacing={2} mb={4}>
        {userPosts.map((post) => (
          <ListItem key={post.id}>- {post.title}</ListItem>
        ))}
      </List>

      <Text fontWeight="bold">Comments by {user.name}:</Text>
      <List spacing={2}>
        {userComments.map((comment) => (
          <ListItem key={comment.id}>• {comment.text}</ListItem>
        ))}
      </List>
    </Box>
  );
};

export default UserPage;

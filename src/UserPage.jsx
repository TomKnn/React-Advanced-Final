import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Box, Heading, Text, Image, List, ListItem } from "@chakra-ui/react";

const UserPage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [userComments, setUserComments] = useState([]);

  // stap 10 - vereiste 8: Haal gebruiker, zijn posts en comments op via userId
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRes = await fetch(`http://localhost:3000/users/${userId}`);
        const userData = await userRes.json();
        setUser(userData);

        const postsRes = await fetch(
          `http://localhost:3000/posts?userId=${userId}`
        );
        const postsData = await postsRes.json();
        setUserPosts(postsData);

        const commentsRes = await fetch(
          `http://localhost:3000/comments?userId=${userId}`
        );
        const commentsData = await commentsRes.json();
        setUserComments(commentsData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
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
        {/* stap 11 - vereiste 9: Posttitel klikbaar maken zodat je naar event detailpagina gaat */}
        {userPosts.map((post) => (
          <ListItem key={post.id}>
            <Link to={`/event/${post.eventId}`}>- {post.title}</Link>
          </ListItem>
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

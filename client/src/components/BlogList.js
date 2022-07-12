import Toggleable from "./Toggleable";
import BlogForm from "./BlogForm";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Box, List, ListItem, Stack, Typography } from "@mui/material";

const BlogList = () => {
  const blogs = useSelector((state) => state.blogs);
  const blogListStyle = {
    padding: 10,
    spacing: 10,
  };
  return (
    <Box style={blogListStyle}>
      <Stack spacing={3}>
        <Typography variant="h4">Blogs</Typography>
        <Toggleable buttonLabel={"create new blog"}>
          <BlogForm />
        </Toggleable>
        <List elevation={3} data-cy="blogContainer" bgcolor="background.paper">
          {blogs.map((blog) => (
            <ListItem style={blogListStyle} key={blog.id} data-cy="blog">
              <Link to={`/blogs/${blog.id}`}> {blog.title} </Link>
            </ListItem>
          ))}
        </List>
      </Stack>
    </Box>
  );
};

export default BlogList;

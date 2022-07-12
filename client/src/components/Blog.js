import { useDispatch, useSelector } from "react-redux";
import { CommentBlog, LikeBlog, RemoveBlog } from "../reducers/blogReducer";
import { useMatch } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { ThumbUpSharp } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  IconButton,
  List,
  ListItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

const Blog = () => {
  const dispatch = useDispatch();
  const match = useMatch("/blogs/:id");
  const [comment, setComment] = useState("");
  const blog = useSelector((state) =>
    state.blogs.find((b) => b.id === match.params.id)
  );
  if (!blog) {
    return null;
  }
  // red button with white text
  const removeButtonStyle = {
    backgroundColor: "#ff0000",
    color: "#ffffff",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
  };
  const handleLikeBlog = (blog) => {
    dispatch(LikeBlog(blog));
  };

  const handleRemoveBlog = (blog) => {
    dispatch(RemoveBlog(blog));
  };

  const handleComment = (event) => {
    event.preventDefault();
    const comment = event.target.comment.value;
    event.target.comment.value = "";
    dispatch(CommentBlog(blog, comment));
  };

  const containerStyle = {
    padding: "10px",
    margin: "10px",
    borderRadius: "5px",
    backgroundColor: "#ffffff",
    border: "1px solid #cccccc",
  };

  const commentStyle = {
    margin: "5px",
  };
  const buttonStyle = {
    margin: "5px",
    maxWidth: "250px",
    justifySelf: "center",
    alignSelf: "center",
  };

  return (
    <Stack data-cy="blog" spacing={3}>
      <Card spacing={3} style={containerStyle}>
        <Typography variant="h4">
          <a href={blog.url}>{blog.title.toUpperCase()}</a>
        </Typography>
        <Typography variant="subtitle1">{blog.author}</Typography>
        <Box>
          {" "}
          likes: {blog.likes}{" "}
          <IconButton
            onClick={() => handleLikeBlog(blog)}
            variant="contained"
            data-cy="like"
          >
            <ThumbUpSharp />
          </IconButton>
        </Box>
        <div> added by {blog.user.name}</div>
        <Button
          style={removeButtonStyle}
          onClick={() => handleRemoveBlog(blog)}
        >
          remove
        </Button>
      </Card>
      <Card spacing={3} style={containerStyle}>
        <form onSubmit={handleComment}>
          <Stack width="100%">
            <Typography variant="h5">Comments</Typography>

            <TextField
              id="comment"
              name="comment"
              label="Comment"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
            />
            <Button style={buttonStyle} type="submit" variant="contained">
              Add comment
            </Button>
          </Stack>
        </form>
        <List>
          {blog.comments.map((comment, i = 0) => {
            i++;
            return (
              <ListItem style={commentStyle} key={i}>
                {comment}
              </ListItem>
            );
          })}
        </List>
      </Card>
    </Stack>
  );
};

Blog.displayName = "Blog";

export default Blog;

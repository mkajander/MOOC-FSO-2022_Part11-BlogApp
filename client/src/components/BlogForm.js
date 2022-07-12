import { useDispatch } from "react-redux";
import { useState } from "react";
import { CreateBlog } from "../reducers/blogReducer";
import { Button, Card, Stack, TextField } from "@mui/material";

export const BlogForm = () => {
  const dispatch = useDispatch();

  const [newBlog, setNewBlog] = useState({ title: "", author: "", url: "" });

  const handleChange = (event) => {
    setNewBlog({ ...newBlog, [event.target.name]: event.target.value });
  };
  const addBlog = (event) => {
    event.preventDefault();
    console.log(newBlog);
    dispatch(CreateBlog(newBlog));
    setNewBlog({ title: "", author: "", url: "" });
  };

  const formCardStyle = {
    padding: "10px",
    margin: "10px",
    borderRadius: "5px",
    backgroundColor: "#ffffff",
    border: "1px solid #cccccc",
  };
  const formStyle = {
    margin: "10px",
  };

  return (
    <Card className="container" style={formCardStyle}>
      <h2>Create new blog</h2>
      <form data-cy="blogForm" style={formStyle} onSubmit={addBlog}>
        <Stack width="100%" spacing={1}>
          <TextField
            label="Title"
            id="title-input"
            type="text"
            name="title"
            value={newBlog.title}
            onChange={handleChange}
          />
          <TextField
            label="Author"
            id="author-input"
            type="text"
            name="author"
            value={newBlog.author}
            onChange={handleChange}
          />
          <TextField
            label="Url"
            id="url-input"
            type="text"
            name="url"
            value={newBlog.url}
            onChange={handleChange}
          />
          <Button type="submit" variant="contained">
            {" "}
            Create{" "}
          </Button>
        </Stack>
      </form>
    </Card>
  );
};

export default BlogForm;

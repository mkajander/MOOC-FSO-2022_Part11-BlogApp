import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";
import { createNotification } from "./notificationReducer";

const blogSlice = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {
    addBlog: (state, action) => {
      const newBlog = action.payload;
      return [...state, newBlog];
    },
    removeBlog: (state, action) => {
      return state.filter((blog) => blog.id !== action.payload.id);
    },
    likeBlog: (state, action) => {
      const blog = action.payload;
      state.map((b) => {
        if (b.id === blog.id) {
          b.likes = blog.likes;
        }
      });
    },
    updateBlog: (state, action) => {
      const blog = action.payload;
      state.map((b) => {
        if (b.id === blog.id) {
          b.title = blog.title;
          b.author = blog.author;
          b.url = blog.url;
          b.comments = [...blog.comments];
        }
      });
    },
    setBlogs: (state, action) => {
      console.log("setBlogs");
      console.log(action.payload);
      return action.payload;
    },
  },
});

export const GetBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch(setBlogs(blogs.sort((a, b) => b.likes - a.likes)));
  };
};

export const CreateBlog = (blog) => {
  return async (dispatch) => {
    const returnedBlog = await blogService.create(blog);
    dispatch(addBlog(returnedBlog));
    dispatch(
      createNotification({
        message: `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
      })
    );
  };
};

export const RemoveBlog = (blog) => {
  return async (dispatch) => {
    try {
      await blogService.remove(blog.id);
      dispatch(removeBlog(blog));
      dispatch(
        createNotification({
          message: `blog ${blog.title} by ${blog.author} removed`,
        })
      );
    } catch (error) {
      dispatch(
        createNotification({ message: "blog removal failed", type: "error" })
      );
    }
  };
};

export const LikeBlog = (blog) => {
  return async (dispatch) => {
    const likedBlog = {
      ...blog,
      likes: blog.likes + 1,
    };
    const returnedBlog = await blogService.update(likedBlog);
    dispatch(likeBlog(returnedBlog));
  };
};

export const CommentBlog = (blog, comment) => {
  return async (dispatch) => {
    const returnedBlog = await blogService.postComment(blog.id, comment);
    console.log(returnedBlog);
    dispatch(updateBlog(returnedBlog));
    dispatch(createNotification({ message: `a new comment added` }));
  };
};

export const { addBlog, likeBlog, removeBlog, setBlogs, updateBlog } =
  blogSlice.actions;
export default blogSlice.reducer;

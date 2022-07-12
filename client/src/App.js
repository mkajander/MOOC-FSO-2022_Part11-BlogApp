import { useEffect } from "react";
import Notification from "./components/Notification";
import { useDispatch, useSelector } from "react-redux";
import { GetBlogs } from "./reducers/blogReducer";
import LoginForm from "./components/Login";
import { CheckToken, LogoutUser } from "./reducers/currentUserReducer";
import UserList from "./components/UserList";
import { GetUsers } from "./reducers/userReducer";
import { Route, Routes, Link, useNavigate } from "react-router-dom";
import UserDetails from "./components/UserDetails";
import Blog from "./components/Blog";
import BlogList from "./components/BlogList";
import { AppBar, Box, Button, Grid, Toolbar, Typography } from "@mui/material";

const App = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.currentUser);
  const navigate = useNavigate();
  useEffect(() => {
    if (currentUser != null) {
      dispatch(CheckToken());
    }
  }, []);

  useEffect(() => {
    if (currentUser != null) {
      dispatch(GetBlogs());
      dispatch(GetUsers());
    }
    console.log("currentUser: ", currentUser);
  }, [currentUser]);
  const handleLogout = async () => {
    await dispatch(LogoutUser());
    navigate("/");
  };

  if (currentUser == null) {
    return (
      <Grid container justify="center" alignItems="center" direction="column">
        <Grid item xs={3}>
          <Notification />
          <h2>Log in to application</h2>
          <LoginForm />
        </Grid>
      </Grid>
    );
  }

  const padding = {
    paddingLeft: 10,
    paddingRight: 10,
  };
  const linkStyle = {
    textDecoration: "none",
    fontSize: 20,
    paddingRight: 10,
    paddingLeft: 10,
    color: "inherit",
  };
  return (
    <Box spacing={3}>
      {currentUser ? (
        <AppBar position="static">
          <Toolbar>
            <Link style={linkStyle} to="/">
              blogs
            </Link>
            <Link style={linkStyle} to="/users">
              users
            </Link>
            <Typography style={padding} variant="h6" color="inherit">
              {currentUser.name} logged in
            </Typography>
            <Button
              style={padding}
              onClick={handleLogout}
              variant="contained"
              color="secondary"
            >
              {" "}
              logout{" "}
            </Button>
          </Toolbar>
        </AppBar>
      ) : (
        <Link style={linkStyle} to="/login">
          login
        </Link>
      )}
      <Notification />
      <Routes>
        <Route path="/" element={<BlogList />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/users/:id" element={<UserDetails />} />
        <Route path="/blogs/:id" element={<Blog />} />
      </Routes>
    </Box>
  );
};

export default App;

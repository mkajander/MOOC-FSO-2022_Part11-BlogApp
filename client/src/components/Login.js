import { useDispatch } from "react-redux";
import { LoginUser } from "../reducers/currentUserReducer";
import { useState } from "react";
import { Button, Stack, TextField } from "@mui/material";

const LoginForm = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    dispatch(LoginUser({ username, password }));
  };
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  return (
    <form onSubmit={handleLogin} data-cy="loginForm">
      <Stack spacing={2}>
        <TextField
          username
          required
          data-cy="username"
          type="text"
          value={username}
          label="Username"
          onChange={handleUsernameChange}
        ></TextField>
        <TextField
          password
          required
          data-cy="password"
          type="password"
          value={password}
          label="Password"
          onChange={handlePasswordChange}
        ></TextField>
        <Button type="submit" data-cy="loginButton" variant="contained">
          Login
        </Button>
      </Stack>
    </form>
  );
};

export default LoginForm;

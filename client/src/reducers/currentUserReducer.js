import { createSlice } from "@reduxjs/toolkit";
import loginService from "../services/login";
import blogService from "../services/blogs";
import { createNotification } from "./notificationReducer";

const initializeLocalStorageUser = () => {
  const loggedUserJSON = window.localStorage.getItem("loggedUser");
  if (loggedUserJSON) {
    const user = JSON.parse(loggedUserJSON);
    if (user == null) {
      return null;
    }
    return user;
  }
};

const currentUserSlice = createSlice({
  name: "currentUser",
  initialState: initializeLocalStorageUser() || null,
  reducers: {
    setUser: (state, action) => {
      const user = action.payload;
      window.localStorage.setItem("loggedUser", JSON.stringify(user));
      console.log(`setUser: ${user}`);
      if (user) {
        blogService.setToken(user.token);
      } else {
        blogService.setToken(null);
      }
      return action.payload;
    },
  },
});

export const LoginUser = ({ username, password }) => {
  return async (dispatch) => {
    try {
      const user = await loginService.login({ username, password });
      dispatch(setUser(user));
    } catch (error) {
      dispatch(
        createNotification({
          message: "wrong username or password",
          type: "error",
        })
      );
    }
  };
};

export const LogoutUser = () => {
  return (dispatch) => {
    // getting rid of the token is enough in this case
    window.localStorage.removeItem("loggedUser");
    dispatch(setUser(null));
  };
};

// probably better way to do this on refresh - basically just check the localStorage for the token
export const CheckToken = () => {
  return (dispatch) => {
    const user = initializeLocalStorageUser();
    if (user) {
      dispatch(setUser(user));
    }
  };
};

export const { setUser } = currentUserSlice.actions;
export default currentUserSlice.reducer;

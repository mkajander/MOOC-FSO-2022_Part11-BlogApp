import { createSlice } from "@reduxjs/toolkit";
import userService from "../services/user";

const usersSlice = createSlice({
  name: "notification",
  initialState: [],
  reducers: {
    setUsers: (state, action) => {
      return action.payload;
    },
  },
});

export const GetUsers = () => {
  return async (dispatch) => {
    try {
      const users = await userService.getAll();
      dispatch(setUsers(users));
    } catch (error) {
      console.log(error);
    }
  };
};

export const { setUsers } = usersSlice.actions;
export default usersSlice.reducer;

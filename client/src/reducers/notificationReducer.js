import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: null,
  reducers: {
    setNotification: (state, action) => {
      return action.payload;
    },
    clearNotification: () => {
      return null;
    },
  },
});

let latestTimeout = null;

export const createNotification = ({
  message,
  type = "success",
  timeoutInSeconds,
}) => {
  return async (dispatch) => {
    dispatch(setNotification({ message, type }));
    if (latestTimeout) {
      clearTimeout(latestTimeout);
    }
    latestTimeout = setTimeout(() => {
      dispatch(clearNotification());
    }, timeoutInSeconds * 1000 || 5000);
  };
};

export const { setNotification, clearNotification } = notificationSlice.actions;
export default notificationSlice.reducer;

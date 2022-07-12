import axios from "axios";

// https://github.com/mkajander/Full-Stack-Open-2022/tree/master/Part4
const baseUrl = "/api/blogs";

let token = null;

const setToken = (newToken) => {
  if (newToken === null) {
    token = null;
  } else {
    token = `bearer ${newToken}`;
  }
};

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

const update = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  };
  newObject.user = newObject.user ? newObject.user.id : null;
  const response = await axios.put(
    `${baseUrl}/${newObject.id}`,
    newObject,
    config
  );
  return response.data;
};

const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.delete(`${baseUrl}/${id}`, config);
  return response.data;
};

const postComment = async (id, comment) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.post(
    `${baseUrl}/${id}/comments`,
    { comment },
    config
  );
  return response.data;
};

export default { getAll, setToken, create, update, remove, postComment };

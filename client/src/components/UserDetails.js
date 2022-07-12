import { useMatch } from "react-router-dom";
import { useSelector } from "react-redux";

const UserDetails = () => {
  const match = useMatch("/users/:id");
  const user = useSelector((state) =>
    state.users.find((u) => u.id === match.params.id)
  );
  if (!user) {
    return null;
  }
  return (
    <div>
      <h1>{user.name}</h1>
      <h2>added blogs</h2>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserDetails;

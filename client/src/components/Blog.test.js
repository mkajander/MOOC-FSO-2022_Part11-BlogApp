import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import blogComponents from "./Blog";
import userEvent from "@testing-library/user-event";

describe("Blog component", () => {
  const blog = {
    title: "Test blog",
    author: "Test author",
    url: "http://test.com",
    likes: 0,
    user: {
      username: "Test user",
      name: "Test name",
      id: "5e9f8f8f8f8f8f8f8f8f8f8",
    },
  };

  // not sure if this gets clear on each test automatically or not
  const mockHandler = jest.fn();

  let container;

  beforeEach(() => {
    container = render(
      <blogComponents.Blog
        blog={blog}
        removeBlog={mockHandler}
        likeBlog={mockHandler}
      />
    ).container;
  });

  test("renders blog", () => {
    expect(screen.getByText(/Test blog/i)).toBeDefined();
    expect(screen.getByText(/Test author/i)).toBeDefined();
    expect(screen.getByText("http://test.com")).toBeDefined();
  });

  test("at start cancel button is not shown", () => {
    const button = container.querySelector(".toggleableContent");
    expect(button).not.toBeVisible();
  });

  test("show button shows details", async () => {
    const user = userEvent.setup();
    const button = screen.getByText("view");
    await user.click(button);
    const div = container.querySelector(".toggleableContent");
    expect(div).toBeVisible();
  });

  test("clicking the like button twice calls the event handler twice", async () => {
    const user = userEvent.setup();
    const button = screen.getByText("like");
    await user.click(button);
    await user.click(button);
    expect(mockHandler.mock.calls).toHaveLength(2);
  });
});

describe("BlogForm component", () => {
  const createBlog = jest.fn();

  beforeEach(() => {
    render(<blogComponents.BlogForm createBlog={createBlog} />);
  });

  test("calls createBlog handler with correct data when form is submitted", async () => {
    const user = userEvent.setup();
    const titleInput = screen.getByLabelText("Title:");
    const authorInput = screen.getByLabelText("Author:");
    const urlInput = screen.getByLabelText("Url:");
    await user.type(titleInput, "Test blog");
    await user.type(authorInput, "Test author");
    await user.type(urlInput, "http://test.com");

    const button = screen.getByText("create");
    await user.click(button);
    // expect to call the createBlog handler with the correct blog object
    expect(createBlog.mock.calls).toHaveLength(1);
    expect(createBlog.mock.calls[0][0]).toEqual({
      author: "Test author",
      title: "Test blog",
      url: "http://test.com",
    });
  });
});

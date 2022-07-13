import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import Blog from "./Blog";
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
  const mockRemoveHandler = jest.fn();
  const mockLikeHandler = jest.fn();
  const mockCommentHandler = jest.fn();

  // eslint-disable-next-line no-unused-vars
  let container;

  beforeEach(() => {
    container = render(
      <Blog
        blog={blog}
        handleRemoveBlog={mockRemoveHandler}
        handleLikeBlog={mockLikeHandler}
        handleComment={mockCommentHandler}
      />
    ).container;
  });

  test("renders blog", () => {
    expect(screen.getByText(/Test blog/i)).toBeDefined();
    expect(screen.getByText(/Test author/i)).toBeDefined();
  });

  test("clicking the like button twice calls the event handler twice", async () => {
    const user = userEvent.setup();
    const button = screen.getByTestId("like");
    await user.click(button);
    await user.click(button);
    expect(mockLikeHandler.mock.calls).toHaveLength(2);
  });
});

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import { useRouter } from "next/router";
import AddPostForm from "./AddPostForm";

jest.mock("axios");
jest.mock("next/router", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    refresh: jest.fn(),
  })),
}));

describe("AddPostForm", () => {
  const mockPush = jest.fn();
  const mockRefresh = jest.fn();

  beforeEach(() => {
    useRouter.mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders the form correctly", () => {
    render(<AddPostForm post={null} />);
    expect(screen.getByText("Create your Post!")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Post Title")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Post content")).toBeInTheDocument();
    expect(screen.getByText("Create Post")).toBeInTheDocument();
  });

  test("updates the form values correctly", () => {
    const mockPost = {
      id: "1",
      title: "Test Post",
      content: "This is a test post",
      postedAt: new Date(),
      postedBy: "Test User",
      postTags: ["directive", "average"],
    };
    render(<AddPostForm post={mockPost} />);
    expect(screen.getByPlaceholderText("Post Title")).toHaveValue("Test Post");
    expect(screen.getByPlaceholderText("Post content")).toHaveValue(
      "This is a test post"
    );
  });

  test("submits the form correctly for a new post", async () => {
    axios.post.mockResolvedValueOnce({ data: { id: "1" } });
    render(<AddPostForm post={null} />);

    const titleInput = screen.getByPlaceholderText("Post Title");
    const contentTextarea = screen.getByPlaceholderText("Post content");
    const submitButton = screen.getByText("Create Post");

    fireEvent.change(titleInput, { target: { value: "New Post" } });
    fireEvent.change(contentTextarea, {
      target: { value: "New post content" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith("/api/posts", {
        title: "New Post",
        content: "New post content",
        postTags: [],
      });
      expect(mockPush).toHaveBeenCalledWith("/post/1");
    });
  });

  test("submits the form correctly for an existing post", async () => {
    const mockPost = {
      id: "1",
      title: "Test Post",
      content: "This is a test post",
      postedAt: new Date(),
      postedBy: "Test User",
      postTags: ["directive", "average"],
    };
    axios.put.mockResolvedValueOnce({ data: mockPost });
    render(<AddPostForm post={mockPost} />);

    const titleInput = screen.getByPlaceholderText("Post Title");
    const contentTextarea = screen.getByPlaceholderText("Post content");
    const submitButton = screen.getByText("Update Post");

    fireEvent.change(titleInput, { target: { value: "Updated Post" } });
    fireEvent.change(contentTextarea, {
      target: { value: "Updated post content" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(`/api/posts/${mockPost.id}`, {
        title: "Updated Post",
        content: "Updated post content",
        postTags: [{ tagId: 31 }, { tagId: 32 }],
      });
      expect(mockPush).toHaveBeenCalledWith(`/post/${mockPost.id}`);
    });
  });

  test("deletes the post correctly", async () => {
    const mockPost = {
      id: "1",
      title: "Test Post",
      content: "This is a test post",
      postedAt: new Date(),
      postedBy: "Test User",
      postTags: ["directive", "average"],
    };
    axios.delete.mockResolvedValueOnce({ data: { message: "Post deleted" } });
    render(<AddPostForm post={mockPost} />);

    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(`/api/posts/${mockPost.id}`);
      expect(mockPush).toHaveBeenCalledWith("/my-posts");
      expect(mockRefresh).toHaveBeenCalled();
    });
  });
});

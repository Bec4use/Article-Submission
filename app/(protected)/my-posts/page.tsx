import { getPostsByUser } from "@/actions/posts/getPostsByUser";
import PostList from "@/components/posts/PostList";
import React from "react";

const MyPosts = async () => {
  const posts = await getPostsByUser();

  if (!posts) {
    return (
      <div className="flex items-center justify-center h-screen text-2xl font-semibold text-red-500">
        There are no posts found!
      </div>
    );
  }
  return (
    <div className="p-6 rounded-lg shadow-md">
      <h2 className="mb-4 text-2xl font-bold text-blue-400">
        Here are your posts
      </h2>
      <PostList posts={posts} />
    </div>
  );
};

export default MyPosts;

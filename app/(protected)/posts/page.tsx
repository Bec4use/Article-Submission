"use client";

import * as React from "react";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { PaginatedPosts } from "@/app/api/posts/route";
import { useRouter } from "next/navigation";
import PostCard from "@/components/posts/PostCard";
import CustomPagination from "@/components/posts/Pagination";
import LayoutSelector from "@/components/posts/LayoutSelector";

import { Progress } from "@/components/ui/progress";

interface Post {
  id: string;
  title: string;
  content: string;
  postedBy: string;
  postTags: PostTag[];
}

interface PostTag {
  tag: {
    name: string;
  };
}
interface PostWithTags {
  id: string;
  title: string;
  content: string;
  postedBy: string;
  postTags: PostTag[];
}

interface PostCardProps {
  post: PostWithTags;
  layout: "grid" | "list" | "cards";
}

const PostsPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paginatedPosts, setPaginatedPosts] = useState<
    PaginatedPosts | { error: string } | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(30);

  const [layout, setLayout] = useState<"grid" | "list" | "cards">("cards");

  const handleLayoutChange = (newLayout: "grid" | "list" | "cards") => {
    setLayout(newLayout);
    console.log("Layout :", layout);
  };

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const response = await fetch(
      `/api/posts?title=${searchParams.get("title") || ""}&tags=${searchParams.get("tags") || ""}&postedBy=${searchParams.get("postedBy") || ""}&page=${searchParams.get("page") || "1"}`
    );
    const data = await response.json();
    setPaginatedPosts(data);
    setLoading(false);
    setProgress(75);
  }, [searchParams]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts, searchParams]);

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!paginatedPosts) {
    return (
      <div>
        {loading && ( // Display the Progress component if loading is true
          <div className="flex justify-center my-8">
            <Progress value={progress} className="w-[60%]" />
          </div>
        )}
        {!loading && <div>Loading...</div>}
      </div>
    );
  }

  if ("error" in paginatedPosts) {
    return <div>Error: {paginatedPosts.error}</div>;
  }

  const { posts, totalPosts, totalPages, currentPage } = paginatedPosts;

  if (posts.length === 0) {
    return <div>There are no posts available</div>;
  }

  const handlePageChange = (page: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", page.toString());
    router.push(`/posts?${newSearchParams.toString()}`);
  };

  return (
    <div>
      <p>
        Showing {currentPage * 10 - 9} -{" "}
        {Math.min(currentPage * 10, totalPosts)} of {totalPosts} results
      </p>
      <div className="hidden md:block">
        <LayoutSelector layout={layout} onLayoutChange={handleLayoutChange} />
      </div>

      <div
        className={`grid grid-cols-1 md:grid-cols-${layout === "grid" ? 3 : layout === "list" ? 2 : 1} gap-4`}
      >
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      <div className="flex justify-center mt-4">
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default PostsPage;

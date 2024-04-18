// pages/posts/index.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { PaginatedPosts } from "@/app/api/posts/route";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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

export default function PostsPage() {
  const searchParams = useSearchParams();
  const [paginatedPosts, setPaginatedPosts] = useState<
    PaginatedPosts | { error: string } | null
  >(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(
        `/api/posts?title=${searchParams.get("title") || ""}&tags=${searchParams.get("tags") || ""}&postedBy=${searchParams.get("postedBy") || ""}&page=${searchParams.get("page") || "1"}`
      );
      const data = await response.json();
      setPaginatedPosts(data);
    };
    fetchPosts();
  }, [searchParams]);

  if (!paginatedPosts) {
    return <div>Loading...</div>;
  }

  if ("error" in paginatedPosts) {
    return <div>Error: {paginatedPosts.error}</div>;
  }

  const { posts, totalPages, currentPage } = paginatedPosts;

  if (posts.length === 0) {
    return <div>There are no posts available</div>;
  }

  return (
    <div>
      {posts.map((post: Post) => (
        <div key={post.id} className="border m-4 p-4">
          <h2>Title : {post.title}</h2>
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
          <p>Posted by: {post.postedBy}</p>
          <p>
            Tags: {post.postTags.map((postTag) => postTag.tag.name).join(", ")}
          </p>
        </div>
      ))}
      <div className="flex justify-center mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={`/posts?page=${currentPage - 1}&title=${
                  searchParams.get("title") || ""
                }&tags=${searchParams.get("tags") || ""}&postedBy=${
                  searchParams.get("postedBy") || ""
                }`}
              />
            </PaginationItem>

            {currentPage > 2 && (
              <PaginationItem>
                <PaginationLink
                  href={`/posts?page=1&title=${searchParams.get("title") || ""}&tags=${
                    searchParams.get("tags") || ""
                  }&postedBy=${searchParams.get("postedBy") || ""}`}
                >
                  1
                </PaginationLink>
              </PaginationItem>
            )}

            {currentPage > 3 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {Array.from({ length: 3 }, (_, i) => currentPage - 1 + i)
              .filter(
                (pageNumber) => pageNumber > 0 && pageNumber <= totalPages
              )
              .map((pageNumber) => (
                <PaginationItem key={pageNumber}>
                  <PaginationLink
                    href={`/posts?page=${pageNumber}&title=${
                      searchParams.get("title") || ""
                    }&tags=${searchParams.get("tags") || ""}&postedBy=${
                      searchParams.get("postedBy") || ""
                    }`}
                    isActive={pageNumber === currentPage}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              ))}

            {currentPage < totalPages - 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {currentPage < totalPages - 1 && (
              <PaginationItem>
                <PaginationLink
                  href={`/posts?page=${totalPages}&title=${
                    searchParams.get("title") || ""
                  }&tags=${searchParams.get("tags") || ""}&postedBy=${
                    searchParams.get("postedBy") || ""
                  }`}
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationNext
                href={`/posts?page=${currentPage + 1}&title=${
                  searchParams.get("title") || ""
                }&tags=${searchParams.get("tags") || ""}&postedBy=${
                  searchParams.get("postedBy") || ""
                }`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

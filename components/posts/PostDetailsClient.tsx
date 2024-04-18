"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FaEdit } from "react-icons/fa";
import { FaChromecast } from "react-icons/fa";

interface PostTag {
  tag: {
    name: string;
  };
}

interface Post {
  id: string;
  title: string;
  content: string;
  postedBy: string;
  postedAt: Date;
  postTags: PostTag[];
}

interface PostDetailsProps {
  post: Post;
}

const PostDetailsClient: React.FC<PostDetailsProps> = ({ post }) => {
  const [showArticle, setShowArticle] = useState(false);
  const postedAt = new Date(post.postedAt);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  const router = useRouter();

  const handleViewArticle = () => {
    console.log(post.id);
    router.push(`/post-details/${post.id}`);
  };

  const handleEditArticle = () => {
    console.log(post.id);
    router.push(`/post/${post.id}`);
  };

  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle className="text-xl">{post.title}</CardTitle>
        <CardDescription>
          Posted by: {post.postedBy} <br />
          <div className="text-xs">
            {postedAt.toLocaleString(undefined, options)}
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          dangerouslySetInnerHTML={{ __html: post.content }}
          style={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: showArticle ? "unset" : 2,
            overflow: "hidden",
          }}
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <div>
          <div>
            Tags: {post.postTags.map((postTag) => postTag.tag.name).join(", ")}
          </div>
          <div className="mt-4">
            <Button
              className="mx-2"
              onClick={handleViewArticle}
              variant="outline"
            >
              <FaChromecast className="mr-2 h-4 w-4" />
              View
            </Button>
            <Button onClick={handleEditArticle} variant="secondary">
              <FaEdit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PostDetailsClient;

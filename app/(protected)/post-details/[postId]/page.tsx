import { getPostById } from "@/actions/posts/getPostById";
import { currentUser } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";

interface PostTag {
  tag: {
    id: number;
    name: string;
  };
}

interface Post {
  id: string;
  title: string;
  content: string;
  postedAt: Date;
  postedBy: string;
  postTags: PostTag[];
}

const options: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
};

interface PostDetailsProps {
  params: {
    postId: string;
  };
}

const PostDetails: React.FC<PostDetailsProps> = async ({ params }) => {
  const post: Post | null = await getPostById(params.postId); // Updated line
  const user = await currentUser();

  if (!user?.id) return <div>Not authenticated...</div>;

  if (!post) return <div>Post not found...</div>;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="container mx-auto my-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{post.title}</CardTitle>
            <CardDescription>
              Posted by: {post.postedBy} <br />
              <div className="text-sm">
                {post.postedAt.toLocaleString(undefined, options)}
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </CardContent>

          <CardFooter className="flex justify-between">
            <div>
              Tags:{" "}
              {post.postTags.map((postTag) => postTag.tag.name).join(", ")}
            </div>
            <Button variant="secondary">
              <a href={`/posts`}>Back to Posts</a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Suspense>
  );
};

export default PostDetails;

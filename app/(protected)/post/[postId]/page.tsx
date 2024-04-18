import { getPostById } from "@/actions/posts/getPostById";
import AddPostForm from "@/components/posts/AddPostForm";
import { currentUser } from "@/lib/auth";

interface PostPageProps {
  params: {
    postId: string;
  };
}

const Post = async ({ params }: PostPageProps) => {
  const user = await currentUser();
  if (!user?.id) return <div>Not authenticated...</div>;

  if (params.postId === "new") {
    return (
      <div>
        <AddPostForm post={null} />
      </div>
    );
  }

  const post = await getPostById(params.postId);
  if (!post) return <div>Post not found</div>;
  if (post.postedBy !== user.name) return <div>Access denied</div>;

  const transformedPost = {
    ...post,
    postTags: post.postTags.map((tagItem) => tagItem.tag.name),
  };

  return (
    <div>
      <AddPostForm post={transformedPost} />
    </div>
  );
};

export default Post;

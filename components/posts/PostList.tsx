import PostDetailsClient from "./PostDetailsClient";

type Post = {
  id: string;
  title: string;
  content: string;
  postedBy: string;
  postedAt: Date;
  postTags: {
    postId: string;
    tagId: number;
    tag: {
      id: number;
      name: string;
    };
  }[];
};

type PostListProps = {
  posts: Post[];
};

const PostList = ({ posts }: PostListProps) => {
  const countPosts = () => {
    return posts.length;
  };

  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-4 mt-4 relative">
        <p className="flex absolute top-[-25px] text-gray-400">
          Total Article : {countPosts()}
        </p>
        {posts.map((post) => (
          <div key={post.id}>
            <PostDetailsClient post={post} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostList;

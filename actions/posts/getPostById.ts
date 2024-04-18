import { db } from "@/lib/db";

export const getPostById = async (postId: string) => {
  try {
    const post = await db.posts.findUnique({
      where: {
        id: postId,
      },
      include: {
        postTags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!post) return null;

    return post;
  } catch (error: any) {
    throw new Error(error);
  }
};

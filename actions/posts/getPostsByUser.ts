import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const getPostsByUser = async () => {
  try {
    const user = await currentUser();

    if (!user || !user.name) {
      throw new Error("Unauthorized");
    }

    const userName = user.name;

    const posts = await db.posts.findMany({
      where: {
        postedBy: userName,
      },
      include: {
        postTags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!posts) return null;

    return posts;
  } catch (error: any) {
    throw new Error(error);
  }
};

import { db } from "@/lib/db";
import fs from "fs";
import path from "path";
import { currentUser } from "@/lib/auth";

export async function GET(req: Request): Promise<Response> {
  const data = fs.readFileSync(path.join(__dirname, "posts.json"), "utf-8");
  const posts = JSON.parse(data);

  try {
    const user = await currentUser();
    if (!user) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    for (const post of posts) {
      const newPost = await db.posts.create({
        data: {
          id: post.id,
          title: post.title,
          content: post.content,
          postedAt: new Date(post.postedAt),
          postedBy: post.postedBy,
        },
      });

      for (const tagName of post.tags) {
        let tag = await db.tags.findUnique({
          where: { name: tagName },
        });
        if (!tag) {
          tag = await db.tags.create({
            data: {
              name: tagName,
            },
          });
        }

        await db.postTags.create({
          data: {
            postId: newPost.id,
            tagId: tag.id,
          },
        });
      }
    }

    return new Response(JSON.stringify(posts), { status: 200 });
  } catch (error) {
    console.log("Error at GET /api/posts", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

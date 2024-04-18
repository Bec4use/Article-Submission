import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

interface PostWithTags {
  id: string;
  title: string;
  content: string;
  postedAt: Date;
  postedBy: string;
  postTags: {
    tag: {
      id: number;
      name: string;
    };
  }[];
}

export async function PUT(
  req: Request,
  { params }: { params: { postId: string } }
): Promise<Response> {
  try {
    const body = await req.json();
    const user = await currentUser();

    if (!params.postId) {
      return new Response(JSON.stringify({ message: "postId is required" }), {
        status: 400,
      });
    }

    if (!user || !user.name) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    // Step 1: Delete all existing postTags for this post
    await db.postTags.deleteMany({
      where: {
        postId: params.postId,
      },
    });

    // Step 2: Update the post with new data
    const post = await db.posts.update({
      where: { id: params.postId },
      data: {
        title: body.title,
        content: body.content,
        postedBy: user.name,
        postedAt: new Date(),
      },
      include: {
        postTags: {
          include: {
            tag: true,
          },
        },
      },
    });

    // Step 3: Create new postTags
    await db.postTags.createMany({
      data: body.postTags
        .filter((tag: { tagId: number }) => tag.tagId !== undefined)
        .map((tag: { tagId: number }) => ({
          postId: post.id,
          tagId: tag.tagId,
        })),
    });

    console.log("PUT /api/posts", post);
    console.log("PUT /api/posts", body.postTags);
    return new Response(JSON.stringify(post), { status: 200 });
  } catch (error) {
    console.log("Error at PUT /api/posts", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { postId: string } }
): Promise<Response> {
  try {
    const user = await currentUser();

    if (!params.postId) {
      return new Response(JSON.stringify({ message: "postId is required" }), {
        status: 400,
      });
    }

    if (!user || !user.name) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    // Step 1: Check if the user is the owner of the post
    const post = await db.posts.findUnique({
      where: { id: params.postId },
      include: { postTags: true },
    });

    if (!post || post.postedBy !== user.name) {
      return new Response(
        JSON.stringify({
          message: "You are not authorized to delete this post",
        }),
        { status: 403 }
      );
    }

    // Step 2: Delete the post and all associated postTags
    await db.postTags.deleteMany({
      where: {
        postId: params.postId,
      },
    });

    await db.posts.delete({
      where: {
        id: params.postId,
      },
    });

    return new Response(
      JSON.stringify({ message: "Post deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.log("Error at DELETE /api/posts", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

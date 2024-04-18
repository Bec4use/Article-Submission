import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

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

export interface PaginatedPosts {
  posts: PostWithTags[];
  totalPosts: number;
  currentPage: number;
  totalPages: number;
}

export async function GET(
  request: NextRequest
): Promise<NextResponse<PaginatedPosts | { error: string }>> {
  try {
    const { searchParams } = request.nextUrl;
    const {
      title,
      tags,
      postedBy,
      page = "1",
    } = Object.fromEntries(searchParams);

    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const totalPosts = await db.posts.count({
      where: {
        title: title ? { contains: title } : undefined,
        postedBy: postedBy ? { contains: postedBy } : undefined,
        postTags: tags
          ? {
              some: {
                tag: {
                  name: { contains: tags },
                },
              },
            }
          : undefined,
      },
    });
    const posts = await db.posts.findMany({
      where: {
        title: title ? { contains: title } : undefined,
        postedBy: postedBy ? { contains: postedBy } : undefined,
        postTags: tags
          ? {
              some: {
                tag: {
                  name: { contains: tags },
                },
              },
            }
          : undefined,
      },
      include: {
        postTags: {
          include: {
            tag: true,
          },
        },
      },
      skip: (Number(page) - 1) * 10,
      take: 10,
    });

    return NextResponse.json({
      posts,
      totalPosts,
      currentPage: Number(page),
      totalPages: Math.ceil(totalPosts / 10),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "An error occurred while fetching posts" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request): Promise<Response> {
  try {
    const body = await req.json();
    const user = await currentUser();
    if (!user || !user.name) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    // Step 1: Create the post without postTags
    const post = await db.posts.create({
      data: {
        title: body.title,
        content: body.content,
        postedBy: user.name,
        postedAt: new Date(),
        postTags: {
          createMany: {
            data: body.postTags.map((tag: { tagId: number }) => ({
              tagId: tag.tagId,
            })),
          },
        },
      },
      include: {
        postTags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return new Response(JSON.stringify(post), { status: 200 });
  } catch (error) {
    console.log("Error at POST /api/post", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

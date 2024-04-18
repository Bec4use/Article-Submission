"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash } from "lucide-react";
import router from "next/router";

export type Post = {
  id: string;
  title: string;
  content: string;
  postedAt: Date;
  postedBy: string;
  postTags: string[];
};

interface AddPostFormProps {
  post: Post | null;
}

const tags = [
  "directive",
  "average",
  "portfolio",
  "manager",
  "network",
  "founder",
  "miter",
  "baggie",
  "congressman",
  "roar",
  "admire",
  "gosling",
  "supply",
  "rack",
  "tew",
  "hound",
  "resolution",
  "kindness",
  "belly",
  "bullet",
  "inversion",
  "lox",
  "airforce",
  "guava",
  "berry",
  "accounting",
  "buck",
  "platinum",
  "valance",
  "ever",
]; // Add this line

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters long",
  }),
  content: z.string().min(10, {
    message: "Content must be at least 10 characters long",
  }),
});

const AddPostForm = ({ post }: AddPostFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [isHotelDeleting, setIsHotelDeleting] = useState(false);

  const [selectedTags, setSelectedTags] = useState<string[]>(
    post ? post.postTags : []
  );
  const tagMap = Object.fromEntries(
    tags.map((tag, index) => [tag, index + 31])
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: post || {
      title: "",
      content: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const data = {
        ...values,
        postTags: selectedTags.map((tag) => ({
          tagId: tagMap[tag],
        })),
      };

      if (post) {
        // Update existing post
        const res = await axios.put(`/api/posts/${post.id}`, data);
        if (res.data) {
          toast({
            variant: "success",
            description: "Post updated successfully",
          });
          router.push(`/post/${res.data.id}`);
        }
      } else {
        // Create new post
        const res = await axios.post("/api/posts", data);
        if (res.data) {
          toast({
            variant: "success",
            description: "Post created successfully",
          });
          router.push(`/post/${res.data.id}`);
        }
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: `ERROR! ${error.message}`,
      });
    } finally {
      setIsLoading(false);
      router.replace("/my-posts");
      router.refresh();
    }
  };

  const handleDeletePost = async (postToDelete: Post) => {
    try {
      setIsHotelDeleting(true);
      const res = await axios.delete(`/api/posts/${postToDelete.id}`);
      if (res.data) {
        toast({
          variant: "success",
          description: "Post deleted successfully",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: `ERROR! ${error.message}`,
      });
    } finally {
      setIsHotelDeleting(false);
      router.replace("/my-posts");
      router.refresh();
    }
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 max-w-xl mx-auto border p-8 rounded-lg shadow-lg "
        >
          <h3 className="text-lg font-semibold">
            {post ? "Update your Post!" : "Create your Post!"}
          </h3>
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Post Title</FormLabel>
                  <FormDescription>
                    Provide a title for your post
                  </FormDescription>
                  <FormControl>
                    <Input placeholder="Post Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Post Content</FormLabel>
                  <FormDescription>
                    Write the content of your post
                  </FormDescription>
                  <FormControl>
                    <Textarea placeholder="Post content" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel className="text-xl">Tags</FormLabel>
              <FormDescription>
                Select the tags that best describe your post
              </FormDescription>

              <div className="grid grid-cols-3 gap-4 mt-2">
                {tags.map((tag) => (
                  <FormItem
                    key={tag}
                    className="flex flex-row items-center space-x-3 rounded-md p-2 border"
                  >
                    <Checkbox
                      checked={selectedTags.includes(tag)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedTags([...selectedTags, tag]);
                        } else {
                          setSelectedTags(
                            selectedTags.filter((t) => t !== tag)
                          );
                        }
                      }}
                    />
                    <div className="flex items-center flex-row">
                      <FormLabel className="flex flex-row">
                        <div className="flex justify-center items-center pb-2">
                          {tag}
                        </div>
                      </FormLabel>
                    </div>
                  </FormItem>
                ))}
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit">
                {post ? "Update Post" : "Create Post"}
              </Button>
            </div>
            {post && (
              <Button
                onClick={() => handleDeletePost(post)}
                variant="ghost"
                type="button"
                className="max-w-[150px]"
                disabled={isHotelDeleting || isLoading}
              >
                {isHotelDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4" />
                    Deleting
                  </>
                ) : (
                  <>
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddPostForm;

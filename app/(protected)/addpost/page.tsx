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
} from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Button } from "../../../components/ui/button";
import axios from "axios";
import { useToast } from "../../../components/ui/use-toast";

interface AddPostFormProps {
  post: Post | null;
}

export type Post = {
  id: string;
  title: string;
  content: string;
  postedAt: Date;
  postedBy: string;
  postTags: string[];
};

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters long",
  }),
  content: z.string().min(10, {
    message: "Content must be at least 10 characters long",
  }),
  postedBy: z.string().min(1, {
    message: "Please provide a poster",
  }),
});

const AddPostForm = ({ post }: AddPostFormProps) => {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: post || {
      title: "",
      content: "",
      postedBy: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (post) {
      axios
        .put(`/api/posts/${post.id}`, values)
        .then((res) => {
          if (res.data) {
            toast({
              variant: "success",
              description: "Post updated successfully",
            });
          }
        })
        .catch((error) => {
          toast({
            variant: "destructive",
            description: `ERROR! ${error.message}`,
          });
        });
    } else {
      axios
        .post("/api/posts", values)
        .then((res) => {
          if (res.data) {
            toast({
              variant: "success",
              description: "Post created successfully",
            });
          }
        })
        .catch((error) => {
          toast({
            variant: "destructive",
            description: `ERROR! ${error.message}`,
          });
        });
    }
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <h3 className="text-lg font-semibold">
            {post ? "Update your Post!" : "Create your Post!"}
          </h3>
          <div className="flex flex-col gap-6">
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
            <FormField
              control={form.control}
              name="postedBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Posted By</FormLabel>
                  <FormDescription>Who is posting this?</FormDescription>
                  <FormControl>
                    <Input placeholder="Poster's name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">
              {post ? "Update Post" : "Create Post"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddPostForm;

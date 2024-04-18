"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BookOpenCheck, CircleEllipsis, Hotel, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export function NavMenuToggle() {
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <CircleEllipsis size={20} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => router.push("/post/new")}
          className="cursor-pointer"
        >
          <Plus size={15} /> <span className="ml-1">Add Article</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push("/my-posts")}
          className="cursor-pointer"
        >
          <Hotel size={15} /> <span className="ml-1"> My Article</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

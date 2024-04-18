"use client";
import qs from "query-string";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDeboundValue } from "@/hook/useDebounceValue";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
];
interface SelectProps {
  value: string[];
  onValueChange: (value: string[]) => void; // Change this to accept an array of strings
}
interface TagSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const TagSelect: React.FC<TagSelectProps> = ({ value, onChange }) => {
  const handleValueChange = (value: string) => {
    onChange(value.split(","));
  };

  return (
    <Select
      value={Array.isArray(value) ? value.join(",") : value}
      onValueChange={handleValueChange}
    >
      <SelectTrigger className="w-[300px] justify-between">
        {Array.isArray(value) && value.length > 0
          ? value.join(", ")
          : "Select Tags..."}
      </SelectTrigger>
      <SelectContent>
        {tags.map((tag) => (
          <SelectItem key={tag} value={tag}>
            {tag}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

const SearchInput = () => {
  const searchParams = useSearchParams();
  const title = searchParams.get("title");
  const postedBy = searchParams.get("postedBy");
  const tagsParam = searchParams.get("tags");
  const [titleValue, setTitleValue] = useState(title || "");
  const [postedByValue, setPostedByValue] = useState(postedBy || "");
  const [selectedTags, setSelectedTags] = useState(
    tagsParam ? tagsParam.split(",") : []
  );
  const [searchType, setSearchType] = useState("title");
  const router = useRouter();
  const debouncedTitleValue = useDeboundValue(titleValue);
  const debouncedPostedByValue = useDeboundValue(postedByValue);
  const pathname = usePathname();

  useEffect(() => {
    const query = {
      title: debouncedTitleValue,
      postedBy: debouncedPostedByValue,
      tags: selectedTags.join(","),
    };
    const url = qs.stringifyUrl(
      { url: window.location.href, query },
      { skipNull: true, skipEmptyString: true }
    );
    router.push(url);
  }, [debouncedTitleValue, debouncedPostedByValue, selectedTags, router]);

  const onChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitleValue(e.target.value);
  };

  const onChangePostedBy = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPostedByValue(e.target.value);
  };
  const onChangeTags = (value: string[]) => {
    setSelectedTags(value);
  };
  const onChangeSearchType = (value: string) => {
    setSearchType(value);
  };

  if (pathname !== "/posts") return null;
  return (
    <div className="sm:flex hidden">
      <div>
        <Select onValueChange={onChangeSearchType} defaultValue="title">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Search Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="postedBy">Posted By</SelectItem>
            <SelectItem value="tags">Tags</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="relative ml-2">
        {searchType === "title" && (
          <Input
            value={titleValue}
            onChange={onChangeTitle}
            placeholder="Search Title"
            className="pl-10 bg-primary/10"
          />
        )}
        {searchType === "postedBy" && (
          <Input
            value={postedByValue}
            onChange={onChangePostedBy}
            placeholder="Search Posted By"
            className="pl-10 bg-primary/10"
          />
        )}
        {searchType === "tags" && (
          <TagSelect value={selectedTags} onChange={onChangeTags} />
        )}
      </div>
    </div>
  );
};

export default SearchInput;

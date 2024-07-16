/* eslint-disable react-refresh/only-export-components */
import {
  Dispatch,
  SetStateAction,
} from "react";

export interface BlogPost {
  blog_id?: string;
  _id?: string;
  title: string;
  banner: string;
  content: string;
  tags: Array<string>;
  des: string;
  author: object;
  draft: boolean;
}

export interface BlogState {
  blog: BlogPost;
  setBlog: Dispatch<SetStateAction<BlogPost>>;
  loadDraftClicked: boolean;
  setLoadDraftClicked: Dispatch<SetStateAction<boolean>>;
  tags: string[];
  setTags: Dispatch<SetStateAction<string[]>>;
}


export const initialBlog: BlogPost = {
  blog_id: "",
  _id: "",
  title: "",
  banner: "",
  content: "",
  tags: [],
  des: "",
  author: {},
  draft: true,
};



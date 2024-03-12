import { Request, Response } from "express";
import Blog from "../Schema/Blog";
import User from "../Schema/User";
import { nanoid } from "nanoid";
import Ajv from "ajv";
import { formatUserData } from "../utils/formatUserData";
import { auth } from "firebase-admin";

const ajv = new Ajv()

export interface BlogPost {
  _id: string;
  blog_id: string;
  title: string;
  banner: string;
  content: string;
  tags: Array<string>;
  des: string;
  author: {
    user_id: string,
    profile_img: string,
    fullname: string,
    email: string,
    username: string
  };
  draft: boolean;
}

const BlogSchema = ajv.compile({
  type: "object",
  properties: {
    _id: { type: "string" },
    blog_id: { type: "string" },
    title: { type: "string" },
    banner: { type: "string" },
    content: { type: "string" },
    tags: { type: "array" },
    des: { type: "string" },
    author: {
      type: "object",
      properties: {
        user_id: { type: "string" },
        profile_img: { type: "string" },
        fullname: { type: "string" },
        email: { type: "string" },
        username: { type: "string" }
      }
    },
    draft: { type: "boolean" }
  },
  required: ['author', 'title'],
  additionalProperties: false
})

export const saveDraft = async (req: Request, res: Response) => {
  const valid = BlogSchema(req.body)
  if (!valid) {
    return res.status(400).json({ msg: "The payload is invalid" })
  }
  const { title, banner, content, tags, des, author, draft } = req.body as BlogPost
  const drafts = await Blog.find({ author: req.user, draft: true }).select('blog_id title banner content tags des draft').exec()
  if (drafts.length >= 4) {
    return res.status(400).json("Draft limit reached, maximum is 4.")
  }
  let blog_id = title.replace(/[^a-zA-Z0-9]/g, ' ').replace(/\s+/g, '-') + nanoid(5)
  const newBlog = new Blog({
    title, banner, content, tags, des, author: req.user?._id, blog_id, draft: Boolean(draft)
  })
  await newBlog.save()
  res.status(200).json(newBlog._id)
}

export const getDrafts = async (req: Request, res: Response) => {
  const drafts = await Blog.find({ author: req.user, draft: true }).select('blog_id title banner content tags des draft').exec()
  if (!drafts) {
    return res.status(200).json({ draft: 0 })
  }
  const author = formatUserData(req.user!)
  const draftsWithAuthor = drafts.map((draft) => {
    return { ...draft.toObject(), author }
  })
  res.status(200).json(draftsWithAuthor)
}

export const updateDraft = async (req: Request, res: Response) => {
  const { _id, blog_id, title, banner, content, tags, des, author, draft } = req.body as BlogPost
  if (req.user?._id.toString() !== author.user_id) {
    console.log("user and author are not the same person")
    return res.status(400).json("You are not authorized to update this blog post")
  }
  const updatedBlog = await Blog.updateOne({ blog_id }, { title, banner, content, tags, des })
  console.log(updatedBlog)
  res.status(200).json("Success")
}

const DeleteDraftSchema = ajv.compile({
  type: "object",
  properties: {
    blog_id: { type: "string" },
    author: {
      type: "object",
      properties: {
        user_id: { type: "string" },
        profile_img: { type: "string" },
        fullname: { type: "string" },
        email: { type: "string" },
        username: { type: "string" }
      }
    },
    draft: { type: "boolean" }
  },
  required: ['author', 'blog_id'],
  additionalProperties: false
})

export const deleteDraft = async (req: Request, res: Response) => {
  const valid = DeleteDraftSchema(req.body)
  if (!valid) {
    return res.status(400).json("Invalid payload")
  }
  const author = req.body.author
  if (req.user?._id.toString() !== author.user_id) {
    console.log("user and author are not the same person")
    return res.status(400).json("You are not authorized for this action")
  }
  const deletedBlog = await Blog.deleteOne({ blog_id: req.body.blog_id })
  console.log(deletedBlog)
  res.status(200).json("success")
}

export const publishDraft = async (req: Request, res: Response) => {
  const valid = BlogSchema(req.body)
  if (!valid) {
    return res.status(400).json("payload invalid")
  }
  const { _id, title, banner, content, tags, des, draft } = req.body as BlogPost
  if (!_id) {
    let blog_id = title.replace(/[^a-zA-Z0-9]/g, ' ').replace(/\s+/g, '-') + nanoid(5)
    const newBlog = new Blog({
      title, banner, content, tags, des, author: req.user?._id, blog_id, draft: Boolean(draft)
    })
    await newBlog.save()
    res.status(200).json(newBlog._id)
  }
}
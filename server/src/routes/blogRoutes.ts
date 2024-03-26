import { Router } from "express";
import { getLike, getOneBlog, getRecentBlogs, toggleLikeBlog } from "../controllers/blogController";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const blogsRouter = Router()

blogsRouter.route('/')
  .get(getRecentBlogs)

blogsRouter.route('/id/:blogId')
  .get(getOneBlog)

blogsRouter.route('/like/id/:blogId')
  .get(isAuthenticated, getLike)
  .post(isAuthenticated, toggleLikeBlog)

export default blogsRouter
import AnimationWrapper from "../../common/animation";
import defaultBanner from "../../../images/blog banner.png";
import axios, { AxiosError } from "axios";
import toast, { Toaster } from "react-hot-toast";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { BlogPost, initialBlog } from "../../contexts/editorContext";
import { Tiptap } from "./TipTap";
import AddTag from "./AddTag";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../../contexts/useAppContext";

const BlogEditor = ({ blogData }: { blogData?: BlogPost }) => {
  const params = useParams();
  const blog_id: string | undefined = params.blogId;
  const bannerRef = useRef<HTMLImageElement>(null);
  const [fetched, setFetched] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isLoadQueryParamPresent = queryParams.get("load") === "true";
  const [blog, setBlog] = useState(initialBlog);
  const [tags, setTags] = useState([]);
  const { user } = useAppContext();

  function restrictEnterKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter") return e.preventDefault();
  }

  function handleEditorChange(
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) {
    setBlog({
      ...blog,
      [e.target.name]: e.target.value,
    });
  }

  const uploadBanner = async (img: File) => {
    const apiAddr = import.meta.env.VITE_API_ROUTE;
    const formData = new FormData();
    formData.append("image", img);
    try {
      const res = await axios({
        method: "POST",
        url: `${apiAddr}/upload-image`,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: formData,
        withCredentials: true,
      });
      return res.data.publicUrl;
    } catch (e) {
      toast.error("something went wrong");
      console.log(e);
    }
  };

  const handleBannerUpload: React.ChangeEventHandler<HTMLInputElement> = async (
    e,
  ) => {
    if (!e.target.files) return;
    const img = e.target.files[0];
    if (img) {
      try {
        toast.loading("Uploading...", { id: "loading" });
        const imgUrl = await uploadBanner(img);
        if (bannerRef.current) {
          bannerRef.current.src = imgUrl;
        }
        if (imgUrl) {
          toast.success("Banner uploaded 👌");
          setBlog({ ...blog, banner: imgUrl });
        }
      } catch (e) {
        toast.error("Something went wrong");
      } finally {
        toast.dismiss("loading");
      }
    }
  };

  const handleSaveDraft = async () => {
    try {
      if (!blog.title || blog.title.length < 10) {
        return toast.error("Title length must be at least 10 characters");
      }
      toast.loading("Saving...");
      const method = blog._id === "" ? "POST" : "PUT";
      const res = await axios({
        withCredentials: true,
        data: blog,
        url: `${import.meta.env.VITE_API_ROUTE}/editor`,
        method: method,
      });
      if (res.status == 200) {
        toast.dismiss();
        setBlog((prevBlog) => ({ ...prevBlog, _id: res.data }));
        toast.success("Blog Saved ✅");
      }
    } catch (e) {
      toast.dismiss();
      const axiosError = e as AxiosError;
      const responseData = axiosError.response?.data;
      if (typeof responseData === "string") {
        toast.error(responseData);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  const handlePublish = async () => {
    try {
      if (!blog.title || blog.title.length < 10) {
        return toast.error("Title length must be at least 10 characters");
      }
      toast.loading("Publishing...");
      const method = blog._id === "" ? "POST" : "PUT";
      console.log("setting up the ref,", blog.content);
      // const cleanBlog = {
      //   _id: blog._id,
      //   blog_id: blog.blog_id,
      //   title: blog.title,
      //   banner: blog.banner,
      //   des: blog.des,
      //   content: blog.content,
      //   tags: blog.tags,
      //   draft: blog.draft,
      //   author: blog.author,
      // };
      const res = await axios({
        withCredentials: true,
        data: blog,
        url: `${import.meta.env.VITE_API_ROUTE}/editor/publish`,
        method: method,
      });
      if (res.status == 200) {
        toast.dismiss();
        setBlog((prevBlog) => ({ ...prevBlog, _id: res.data }));
        toast.success("Blog Published ✅");
      }
    } catch (e) {
      toast.dismiss();
      console.log(e);
      const axiosError = e as AxiosError;
      const responseData = axiosError.response?.data;
      if (typeof responseData === "string") {
        toast.error(responseData);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  const deleteBlog = async () => {
    const data = {
      _id: blog._id,
      author: blog.author,
    };
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_API_ROUTE}/editor`,
        {
          data: data,
          withCredentials: true,
        },
      );
      if (res.status === 200) {
        navigate("/dashboard");
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    console.log(blogData)
    if (blogData !== undefined && blog == null) {
      setBlog(blogData);
    }
  }, [blog, blogData]);

  useEffect(() => {
    if (!isLoadQueryParamPresent) {
      setBlog(initialBlog);
      setTags([]);
    }
  }, [isLoadQueryParamPresent, setBlog, setTags]);

  useEffect(() => {
    const getBlogEditorData = async () => {
      if (blog_id !== undefined) {
        const api_route = `${
          import.meta.env.VITE_API_ROUTE
        }/editor/id/${blog_id}`;
        const res = await axios.get(api_route, { withCredentials: true });
        console.log(res);
        if (res.data.blog.author !== user?.user_id) {
          navigate("/");
        }
        setBlog(res.data.blog);
        setTags(res.data.blog.tags);
      } else {
        console.error("Blog ID is undefined");
      }
    };
    setBlog((prevBlog) => ({ ...prevBlog, author: { ...user } }));
    if (blog.banner !== "") {
      if (bannerRef.current) {
        bannerRef.current.src = blog.banner;
      }
    } else if (blog.banner === "") {
      if (bannerRef.current) {
        bannerRef.current.src = defaultBanner;
      }
    }
    if (!fetched) {
      getBlogEditorData();
      setFetched(true);
    }
  }, [
    blog.banner,
    setBlog,
    blog.title,
    blog.content,
    blog.tags,
    blog_id,
    fetched,
    setTags,
    navigate,
  ]);

  return (
    <>
      <nav className="navbar">
        <div className="flex gap-4 mx-auto p-10 max-w-[900px]">
          {blog.draft === true ? (
            <>
              <button
                className="p-2 w-[6rem] bg-gray-900 text-white rounded-md hover:bg-gray-700"
                onClick={handlePublish}
              >
                Publish
              </button>
              <button
                className="p-2 w-[6rem] border border-black rounded-md outline-none hover:bg-gray-100"
                onClick={handleSaveDraft}
              >
                Save Draft
              </button>
              <button
                className="p-2 w-[6rem] border border-black rounded-md outline-none hover:bg-red-200"
                onClick={deleteBlog}
              >
                Delete
              </button>
            </>
          ) : (
            <>
              <button
                className="p-2 w-[6rem] bg-gray-900 text-white rounded-md hover:bg-gray-700"
                onClick={handlePublish}
              >
                Update
              </button>
            </>
          )}
        </div>
      </nav>
      <AnimationWrapper>
        <Toaster />
        <section>
          <div className="mx-auto max-w-[900px] w-full px-10">
            <textarea
              placeholder="Write Your Title Here"
              className="text-4xl w-full outline-none mt-4 font-medium resize-none h-auto"
              onKeyDown={restrictEnterKey}
              onChange={handleEditorChange}
              name="title"
              value={blog.title}
            ></textarea>
            <div className="relative aspect-video bg-white border-grey hover:opacity-80 mb-5">
              <label htmlFor="uploadBanner">
                <img
                  src={defaultBanner}
                  ref={bannerRef}
                  alt=""
                  className="z-20 object-cover w-full h-full"
                />
                <input
                  type="file"
                  id="uploadBanner"
                  accept=".png, .jpg, .jpeg"
                  hidden
                  onChange={handleBannerUpload}
                />
              </label>
            </div>
          </div>
        </section>
        <section
          className="mx-auto max-w-[900px] px-10 flex flex-col justify-center"
          id="textEditorContainer"
        >
          <Tiptap blog={blog} setBlog={setBlog} />
          <AddTag blog={blog} setBlog={setBlog} />
          <textarea
            placeholder="Describe the blog in 1 or 2 sentences"
            className="w-full outline-none h-[80px] mb-[200px]"
            onChange={handleEditorChange}
            name="des"
            value={blog.des}
          ></textarea>
        </section>
      </AnimationWrapper>
    </>
  );
};

export default BlogEditor;

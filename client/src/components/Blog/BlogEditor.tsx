import AnimationWrapper from "../../common/animation";
import defaultBanner from "../../assets/blog banner.png";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import React, { ChangeEvent, useRef } from "react";
import { useUserContext } from "../../contexts/userContext";
import { useEditorContext } from "../../contexts/editorContext";
import { Tiptap } from "./TipTap";

const BlogEditor = () => {
  const bannerRef = useRef<HTMLImageElement>(null);
  const { user } = useUserContext();
  const { blog, setBlog } = useEditorContext();

  function restrictEnterKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter") return e.preventDefault();
  }

  function handleEditorChange(
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
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
          Authorization: `Bearer ${user?.access_token}`,
        },
        data: formData,
      });
      console.log(res);
      return res.data.publicUrl;
    } catch (e) {
      toast.error("something went wrong");
      console.log(e);
    }
  };

  const handleBannerUpload: React.ChangeEventHandler<HTMLInputElement> = async (
    e
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
        }
      } catch (e) {
        toast.error("Something went wrong");
      } finally {
        toast.dismiss("loading");
      }
    }
  };


  return (
    <>
      <nav className="navbar">
        <p className="max-md:hidden text-black line-clamp-1 w-full ">
          New Blog
        </p>
        <div className="flex gap-4 ml-auto">
          <button className="btn-dark py-2">Publish</button>
          <button className="btn-light py-2">Save Draft</button>
        </div>
      </nav>
      <AnimationWrapper>
        <Toaster />
        <section>
          <div className="mx-auto max-w-[900px] w-full p-10">
            <div className="relative aspect-video bg-white border-4 border-grey hover:opacity-80">
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
            <textarea
              placeholder="Title"
              className="text-4xl w-full outline-none mt-4 font-medium resize-none h-auto"
              onKeyDown={restrictEnterKey}
              onChange={handleEditorChange}
              name="title"
            ></textarea>
          </div>
        </section>
        <section className="ml-auto mr-auto w-[80%]">
          <Tiptap value="Let's Write Something Cool"/>
        </section>
      </AnimationWrapper>
    </>
  );
};

export default BlogEditor;
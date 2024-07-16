import axios from "axios";
import Navbar from "../components/Navbar/Navbar";
import { useEffect, useState } from "react";
import { BlogDocument } from "../common/interfaces";
import { Link } from "react-router-dom";

const Home = () => {
  const [blogs, setBlogs] = useState<BlogDocument[]>([]);

  const getRecentBlogs = async () => {
    const api_url = `${import.meta.env.VITE_API_ROUTE}/blogs`;
    console.log(api_url);
    const res = await axios.get(api_url);
    setBlogs(res.data);
    console.log(res.data);
  };
  useEffect(() => {
    getRecentBlogs();
  }, []);
  return (
    <>
      <Navbar />
      <div className="mx-auto p-12 max-w-[1200px]">
        <h3>Recent Blogs</h3>
        <div className="flex flex-col">
          {blogs.map((blog) => {
            return (
              <div
                key={blog.blog_id}
                className="flex flex-row w-full border-solid border-gray-300 border-y py-5 relative max-h-[400px] justify-between"
              >
                <div className="flex flex-col mr-2">
                  <div className="flex flex-row gap-3 mb-2">
                    <p className="font-bold">
                      <img
                        src={blog.author.personal_info.profile_img}
                        alt=""
                        className="w-5 h-5 inline-block mr-2"
                      />
                      {blog.author.personal_info.username}
                    </p>
                  </div>
                  <Link to={`blog/${blog.blog_id}`}><h3 className="font-bold hover:opacity-60">{blog.title}</h3></Link>
                  <p className="mb-7">{blog.des}</p>
                  {blog.tags !== undefined ? (
                    <div className="flex gap-2 mb-3">
                      {blog.tags.map((tag) => {
                        return (
                          <div className="flex items-center bg-gray-200 opacity-70 rounded-full px-3 py-1 text-black" key={tag}>
                              {tag}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <img
                  src={blog.banner!}
                  alt=""
                  className="rounded-none w-[30%]  md:max-w-[200px] aspect-video object-cover"
                />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
export default Home;

import { useEffect, useState } from "react";
import Button from "../Input/Button";
import MenuModal from "./MenuModal";
import { Link } from "react-router-dom";
import { useAppContext } from "../../contexts/useAppContext";

const Navbar = () => {
  const [showModal, setShowModal] = useState(false);
  const { user, theme, toggleTheme } = useAppContext();

  const toggleThemeNavbar = () => {
    toggleTheme();
  };

  useEffect(() => {
    console.log(theme);
  }, [theme]);

  useEffect(() => { }, [user]);

  return (
    <>
      <header className="w-full max-w-[1200px] mx-auto px-12 h-[100px] flex items-center justify-between py-5">
        <div className=""></div>
        <nav className="flex flex-row w-full">
          {user ? (
            <div className="flex w-full items-center">
              <ul className="mr-auto">
                <div className="py-1 cursor-pointer">
                  <Link to="/" className="text-2xl font-semibold py-2">
                    Sharify
                  </Link>
                </div>
              </ul>
              <ul className="ml-auto">
                <li>
                  <img
                    src={user.profile_img}
                    alt=""
                    className="w-12 h-12 rounded-full"
                    onClick={() => {
                      setShowModal((prev) => !prev);
                    }}
                  />
                  {showModal ? (
                    <>
                      <MenuModal />
                      <div
                        className="w-screen h-screen fixed left-0 top-0 -z-0"
                        onClick={() => setShowModal(false)}
                      ></div>
                    </>
                  ) : (
                    ""
                  )}
                </li>
              </ul>
            </div>
          ) : (
            <div className="w-full max-w-[1200px] mx-auto flex items-center">
              <div className="py-1 cursor-pointer">
                <Link to="/" className="text-2xl font-semibold py-2">
                  Sharify
                </Link>
              </div>
              <div className="flex ml-auto w-[300px] justify-end gap-2">
                <button
                  className="rounded-full border-2 border-gray-300 mt-4 w-32"
                  onClick={() => toggleThemeNavbar()}
                >
                  <i
                    className={`fi fi-sr-moon-stars ${theme === "dark" ? "" : "hidden"}`}
                  ></i>
                  <i
                    className={`fi fi-br-brightness ${theme === "dark" ? "hidden" : ""}`}
                  ></i>
                </button>
                <a href="/signin" className="w-full">
                  <Button dark={true} type={undefined}>
                    Sign In
                  </Button>
                </a>
                <a href="/signup" className="w-full">
                  <Button>Sign Up</Button>
                </a>
              </div>
            </div>
          )}
        </nav>
      </header>
    </>
  );
};

export default Navbar;

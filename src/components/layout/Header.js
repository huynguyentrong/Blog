import { Button } from "components/button";
import { useAuth } from "contexts/auth-context";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const menuLinks = [
  {
    url: "/",
    title: "Home",
  },
  {
    url: "/blog",
    title: "Blog",
  },
  {
    url: "/contact",
    title: "Contact",
  },
];

const Header = () => {
  const { userInfo } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="py-5 lg:py-6">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between">
          <NavLink to="/" className="block">
            <img
              srcSet="/logo.png 2x"
              alt="monkey-blogging"
              className="w-8 sm:w-10 lg:w-12 xl:w-[50px] max-w-[50px]"
            />
          </NavLink>

          {/* Desktop Menu */}
          <ul className="items-center hidden gap-5 ml-10 font-medium list-none lg:flex">
            {menuLinks.map((item) => (
              <li key={item.title}>
                <NavLink
                  to={item.url}
                  className="font-medium text-gray-700 transition-colors duration-300 hover:text-blue-600"
                >
                  {item.title}
                </NavLink>
              </li>
            ))}
          </ul>
          {/* Desktop Auth */}
          <div className="hidden lg:block">
            {!userInfo ? (
              <Button
                type="button"
                height="56px"
                className="header-button"
                to="/sign-in"
              >
                Login
              </Button>
            ) : (
              <div className="flex items-center gap-5">
                <Button
                  type="button"
                  height="56px"
                  className="header-button"
                  to="/dashboard"
                >
                  Dashboard
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="z-50 flex flex-col items-center justify-center w-8 h-6 cursor-pointer lg:hidden"
            onClick={toggleMenu}
          >
            <span
              className={`block w-6 h-0.5 bg-gray-800 transition-all duration-300 ${
                isMenuOpen ? "rotate-45 translate-y-1.5" : ""
              }`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-gray-800 my-1 transition-all duration-300 ${
                isMenuOpen ? "opacity-0" : ""
              }`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-gray-800 transition-all duration-300 ${
                isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
              }`}
            ></span>
          </button>

          {/* Mobile Menu Overlay */}
          <div
            className={`lg:hidden fixed inset-0 bg-white/95 backdrop-blur-md z-40 transition-transform duration-300 ${
              isMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex flex-col items-center justify-center h-full gap-8 px-6">
              {/* Mobile Menu Links */}
              {menuLinks.map((item) => (
                <NavLink
                  key={item.title}
                  to={item.url}
                  className="text-xl font-medium text-gray-700 transition-colors duration-300 hover:text-blue-600"
                  onClick={closeMenu}
                >
                  {item.title}
                </NavLink>
              ))}
              {/* Mobile Auth */}
              <div className="mt-4">
                {!userInfo ? (
                  <Button
                    type="button"
                    height="48px"
                    to="/sign-in"
                    onClick={closeMenu}
                  >
                    Login
                  </Button>
                ) : (
                  <Button
                    type="button"
                    height="48px"
                    to="/dashboard"
                    onClick={closeMenu}
                  >
                    Dashboard
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

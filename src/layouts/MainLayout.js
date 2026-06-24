import React, { useEffect, useState } from "react";
import { MdOutlineNightlight } from "react-icons/md";
import { CiLight } from "react-icons/ci";
import { FiMenu, FiSearch } from "react-icons/fi";
import { Outlet, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import Sidebar from "./Sidebar";
import { isValidBlock } from "../utils";

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("dark", theme);
    window.dispatchEvent(new CustomEvent("themechange", { detail: theme }));
  }, [theme]);

  const handleAddressClick = () => {
    const cleanedSearch = search.trim().toLowerCase();

    if (!cleanedSearch) {
      return;
    }

    if (ethers.isAddress(cleanedSearch)) {
      navigate(`/address/${cleanedSearch}`);
      return;
    }

    if (ethers.isHexString(cleanedSearch) && cleanedSearch.length === 66) {
      navigate(`/tx/${cleanedSearch}`);
      return;
    }

    if (isValidBlock(cleanedSearch)) {
      navigate(`/block/${cleanedSearch}`);
    }
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === "Enter") {
      handleAddressClick();
    }
  };

  const handleThemeToggle = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  const isDarkTheme = theme === "dark";

  return (
    <div
      className={`flex h-[100dvh] overflow-hidden ${
        isDarkTheme
          ? "bg-[#121212] text-slate-100"
          : "bg-[#F6F8FC] text-[#0F172A]"
      }`}
    >
      {/* <div className="hidden lg:block">
        <Sidebar />
      </div> */}

      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        >
          <div
            className="h-full w-[270px]"
            onClick={(event) => event.stopPropagation()}
          >
            <Sidebar />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* <header
          className={`border-b px-[32px] py-[12px] ${
            isDarkTheme
              ? "border-[#18212E] bg-[#0D0D0D]"
              : "border-[#E2E8F0] bg-white"
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className={`flex h-10 w-10 items-center justify-center rounded-[4px] border transition lg:hidden ${
                isDarkTheme
                  ? "border-[#18212E] bg-[#121212] text-[#C4CFE180] hover:border-[#2f5b9b] hover:text-white"
                  : "border-[#D7DEEA] bg-white text-[#4B5563] hover:border-[#2456A6] hover:text-[#0F172A]"
              }`}
              aria-label="Open menu"
            >
              <FiMenu className="h-5 w-5" />
            </button>
            <div>
              <h1
                className={`${isDarkTheme ? "text-[#C4CFE1]" : "text-[#1E293B]"} text-[24px] font-[700] p-0 m-0`}
              >
                RYT Network Overview
              </h1>
              <p
                className={`${isDarkTheme ? "text-[#64748B]" : "text-[#64748B]"} text-[14px] font-[400] p-0 m-0`}
              >
                Real-time infrastructure monitoring and block explorer.
              </p>
            </div>
           
            <div className="flex items-center gap-4">
              <div
                className={`flex items-center gap-2 border-r pr-[16px] ${
                  isDarkTheme ? "border-[#18212E]" : "border-[#D7DEEA]"
                }`}
              >
                <button
                  type="button"
                  onClick={handleThemeToggle}
                  aria-label={
                    isDarkTheme ? "Switch to light mode" : "Switch to dark mode"
                  }
                  className={`rounded-[4px] p-1 transition-all duration-300 ease-in-out ${
                    isDarkTheme
                      ? "bg-[#1B2432] text-[#FBBF24]"
                      : "bg-[#EEF2FF] text-[#0F172A]"
                  }`}
                >
                  {isDarkTheme ? (
                    <CiLight className="h-6 w-6 -rotate-12 hover:rotate-0 hover:scale-110" />
                  ) : (
                    <MdOutlineNightlight className="h-6 w-6 -rotate-12 hover:rotate-0 hover:scale-110" />
                  )}
                </button>
              </div>
              <span
                className={`ml-[4px] hidden rounded-[4px] border px-[8px] py-[4px] text-xs font-semibold text-[12px] font-[700] md:inline-flex ${
                  isDarkTheme
                    ? "border-[#074626] bg-[#171717] text-[#00B277]"
                    : "border-[#9EE8C8] bg-[#F2FFF8] text-[#058A52]"
                }`}
              >
                Titan Testnet
              </span>
            </div>
          </div>
        </header> */}

        <main className="min-h-0 flex-1 overflow-auto p-[20px]">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

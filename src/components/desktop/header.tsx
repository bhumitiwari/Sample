"use client";

import React from "react";
import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import Image from "next/image";

interface DashboardHeaderProps {
  selectedSubject: "Physics" | "Chemistry" | "Mathematics";
  darkMode: boolean;
  setDarkMode: (mode: boolean) => void;
}

const subjectIcons = {
  Physics: (
    <Image src="/physics-icon.svg" alt="Physics Icon" width={24} height={24} />
  ),
  Chemistry: (
    <Image src="/chem-icon.svg" alt="Chemistry Icon" width={24} height={24} />
  ),
  Mathematics: (
    <Image src="/math-icon.svg" alt="Mathematics Icon" width={24} height={24} />
  ),
};

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  selectedSubject,
  darkMode,
  setDarkMode,
}) => {
  return (
    <header
      className={`fixed top-0 left-70 right-0 z-50 flex items-center justify-center h-16 ${
        darkMode ? "bg-[#222E3F]" : "bg-[#FFFFFF]"
      }`}
    >
      <div
        className={`flex flex-col mt-10 items-center absolute left-1/2 transform -translate-x-1/2 ${
          darkMode ? "text-gray-200" : "text-gray-900"
        }`}
      >
        <div className="flex items-center gap-4">
          {subjectIcons[selectedSubject]}
          <h1
            className={`text-[20px] font-bold ${
              darkMode ? "text-[#FFFFFF]" : "text-[#101319]"
            }`}
          >
            {selectedSubject} PYQs
          </h1>
        </div>
        <p
          className={`text-sm  mt-2 ${
            darkMode ? "text-[#B9BFD0]" : "text-[#505D79]"
          }`}
        >
          Chapter-wise Collection of {selectedSubject} PYQs
        </p>
      </div>

      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`absolute right-10 top-1/2 -translate-y-1/2 p-2 rounded-full transition
          ${
            darkMode
              ? "hover:bg-gray-700 bg-gray-800"
              : "hover:bg-gray-100 bg-gray-50"
          }
        `}
        aria-label="Toggle Dark Mode"
      >
        {darkMode ? (
          <SunIcon className="w-5 h-5 text-yellow-400" />
        ) : (
          <MoonIcon className="w-5 h-5 text-gray-700" />
        )}
      </button>
    </header>
  );
};

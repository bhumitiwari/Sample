"use client";

import React from "react";
import {  CaretRightIcon } from "@phosphor-icons/react";
import Image from "next/image";

interface SidebarProps {
  selectedSubject: string;
  onSelectSubject: (subject: "Physics" | "Chemistry" | "Mathematics") => void;
  darkMode: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  selectedSubject,
  onSelectSubject,
  darkMode,
}) => {
  const subjects = [
    {
      name: "Physics",
      label: "Physics PYQs",
      icon: (
        <Image
          src="/physics-icon.svg"
          alt="Physics Icon"
          width={24}
          height={24}
        />
      ),
    },
    {
      name: "Chemistry",
      label: "Chemistry PYQs",
      icon: (
        <Image
          src="/chem-icon.svg"
          alt="Chemistry Icon"
          width={24}
          height={24}
        />
      ),
    },
    {
      name: "Mathematics",
      label: "Mathematics PYQs",
      icon: (
        <Image
          src="/math-icon.svg"
          alt="Mathematics Icon"
          width={24}
          height={24}
        />
      ),
    },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 w-[280px] h-screen px-4 py-6 border-r
        ${
          darkMode
            ? "bg-[#222E3F] border-[#30435A] text-[#FFFFFF]"
            : "bg-[#FFFFFF] border-[#EAEDF1] text-[#101319]"
        }
      `}
    >
      <div className="flex justify-center">
        <div className="flex items-center space-x-2 mb-2">
          <Image src="exam logo.svg" alt="Exam Logo" width={24} height={24} />
          <span
            className={` font-bold text-[20px] ${
              darkMode ? "text-[#FFFFFF]" : "text-[#101319]"
            }`}
          >
            JEE Main
          </span>
        </div>
      </div>

      <p
        className={` text-sm text-center mb-4 ${
          darkMode ? "text-[#B9BFD0]" : "text-[#505D79]"
        }`}
      >
        2025 - 2009 | 173 Papers | 15825 Qs
      </p>

      <nav className="space-y-3 mt-5">
        {subjects.map(({ name, label, icon }) => {
          const isActive = selectedSubject === name;
          return (
            <button
              key={name}
              onClick={() =>
                onSelectSubject(name as "Physics" | "Chemistry" | "Mathematics")
              }
              className={`w-full flex items-center justify-between pl-4 pr-2 py-3 rounded-[12px] transition text-[16px] font-medium  min-h-[48px]
                ${
                  isActive
                    ? "bg-[#1D2933] text-white"
                    : darkMode
                    ? "hover:bg-gray-800 text-gray-300"
                    : "hover:bg-gray-100 text-gray-800"
                }
              `}
            >
              <div className="flex items-center gap-4">
                {icon}
                <span>{label}</span>
              </div>
              <CaretRightIcon
                className={`w-5 h-5 ${
                  isActive
                    ? "text-[#FFFFFF]"
                    : darkMode
                    ? "text-gray-400"
                    : "text-[#101319]"
                }`}
              />
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

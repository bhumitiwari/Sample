"use client";

import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

import { Card, CardContent } from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { fetchChapters, setFilter } from "@/lib/redux/features/chaptersSlice";
import {
  selectFilteredChapters,
  selectChaptersLoading,
  selectChaptersError,
  selectFilters,
} from "@/lib/redux/selectors";
import { ChapterCard } from "./chapter-card";
import { ChapterCardSkeleton } from "../ui/loading-skeleton";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretDownIcon,
} from "@phosphor-icons/react";
import { Sidebar } from "./sidebar";
import { DashboardHeader } from "./header";
import { Chapter } from "@/types/chapter";

const unitOptions: Record<string, string[]> = {
  Physics: [
    "Mechanics 1",
    "Mechanics 2",
    "Thermodynamics",
    "Electromagnetism",
    "Optics",
    "Modern Physics",
    "Miscellaneous",
  ],
  Chemistry: ["Organic Chemistry", "Inorganic Chemistry", "Physical Chemistry"],

  Mathematics: [
    "Algebra",
    "Calculus",
    "Coordinate Geometry",
    "Trigonometry",
    "Vector",
    "Miscellaneous",
  ],
};

const classOptions = ["11", "12"];

const allowedSubjects = ["Physics", "Chemistry", "Mathematics"] as const;
type AllowedSubject = (typeof allowedSubjects)[number];

export const ChaptersDashboard: React.FC = () => {
  const dispatch = useAppDispatch();

  const filteredChapters = useAppSelector(selectFilteredChapters);
  const loading = useAppSelector(selectChaptersLoading);
  const error = useAppSelector(selectChaptersError);
  const filters = useAppSelector(selectFilters);

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const updateDarkMode = () => {
      const isDark = mediaQuery.matches;
      setDarkMode(isDark);
      document.documentElement.classList.toggle("dark", isDark);
    };
    updateDarkMode();
    mediaQuery.addEventListener("change", updateDarkMode);
    return () => mediaQuery.removeEventListener("change", updateDarkMode);
  }, []);

  useEffect(() => {
    dispatch(fetchChapters());
  }, [dispatch]);

  const handleFilterChange = (
    filterType: keyof typeof filters,
    value: string
  ) => {
    dispatch(setFilter({ filterType, value }));
  };

  const handleSubjectChange = (subject: string) => {
    if (allowedSubjects.includes(subject as AllowedSubject)) {
      dispatch(setFilter({ filterType: "subject", value: subject }));
      dispatch(setFilter({ filterType: "class", value: "all" }));
      dispatch(setFilter({ filterType: "unit", value: "all" }));
      dispatch(setFilter({ filterType: "status", value: "all" }));
      dispatch(setFilter({ filterType: "weak", value: "all" }));
    }
  };

  const selectedClasses =
    filters.class === "all" ? [] : filters.class.split(",");

  const getTotalQuestions = (chapter: Chapter): number => {
    if (
      chapter.yearWiseQuestionCount &&
      typeof chapter.yearWiseQuestionCount === "object"
    ) {
      return Object.values(chapter.yearWiseQuestionCount).reduce(
        (acc, val) => acc + (typeof val === "number" ? val : 0),
        0
      );
    }
    return 0;
  };

  const sortedChapters = [...filteredChapters].sort((a, b) => {
    const totalA = getTotalQuestions(a);
    const totalB = getTotalQuestions(b);
    return sortOrder === "asc" ? totalA - totalB : totalB - totalA;
  });

  const dashboardSubject: AllowedSubject = allowedSubjects.includes(
    filters.subject as AllowedSubject
  )
    ? (filters.subject as AllowedSubject)
    : "Physics";

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">Error: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div
      className={`flex min-h-screen ${
        darkMode ? "bg-[#222E3F] text-gray-200" : "bg-[#FFFFFF] text-gray-900"
      }`}
    >
      <Sidebar
        selectedSubject={dashboardSubject}
        onSelectSubject={handleSubjectChange}
        darkMode={darkMode}
      />

      <main className="flex-1 flex flex-col" style={{ marginLeft: 280 }}>
        <DashboardHeader
          selectedSubject={dashboardSubject}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        <div className="flex-1 overflow-y-auto p-8" style={{ marginTop: 64 }}>
          <div className="flex flex-wrap items-center gap-2 mb-6 ">
            <div className="flex  items-center gap-2 ">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`flex min-w-8 min-h-8 font-medium rounded-xl items-center gap-1 p-1.5 text-[16px] border cursor-pointer ${
                      darkMode
                        ? "border-[#3E5574] text-[#FFFFFF]"
                        : "border-[#D1D8E0] text-[#101319]"
                    }`}
                  >
                    Class
                    <CaretDownIcon size={14} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="bottom"
                  align="start"
                  className={`w-48 rounded-md border text-sm shadow-md ${
                    darkMode
                      ? "bg-[#1E2A38] border-[#3E5574] text-white"
                      : "bg-white border-[#D1D8E0] text-[#101319]"
                  }`}
                  onCloseAutoFocus={(e) => e.preventDefault()}
                >
                  <div className="px-2 py-1">
                    <button
                      onClick={() => handleFilterChange("class", "all")}
                      className={`w-full text-left text-sm ${
                        darkMode ? "text-[#6FBBFC]" : "text-[#0065DE]"
                      } hover:underline`}
                    >
                      Clear All
                    </button>
                  </div>
                  {classOptions.map((cls) => (
                    <DropdownMenuCheckboxItem
                      key={cls}
                      checked={selectedClasses.includes(cls)}
                      onSelect={(e) => e.preventDefault()}
                      onCheckedChange={(checked) => {
                        const updated = checked
                          ? [...selectedClasses, cls]
                          : selectedClasses.filter((c) => c !== cls);
                        handleFilterChange(
                          "class",
                          updated.length ? updated.join(",") : "all"
                        );
                      }}
                    >
                      Class {cls}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`flex min-w-8 min-h-8 font-medium  rounded-xl items-center gap-1 p-1.5 text-[16px] border cursor-pointer ${
                      darkMode
                        ? "border-[#3E5574] text-[#FFFFFF]"
                        : "border-[#D1D8E0] text-[#101319]"
                    }`}
                  >
                    Units
                    <CaretDownIcon size={14} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="bottom"
                  align="start"
                  className={`w-56 rounded-md border text-sm shadow-md ${
                    darkMode
                      ? "bg-[#1E2A38] border-[#3E5574] text-white"
                      : "bg-white border-[#D1D8E0] text-[#101319]"
                  }`}
                  onCloseAutoFocus={(e) => e.preventDefault()}
                >
                  <div className="px-2 py-1">
                    <button
                      onClick={() => handleFilterChange("unit", "all")}
                      className={`w-full text-left text-sm ${
                        darkMode ? "text-[#6FBBFC]" : "text-[#0065DE]"
                      } hover:underline`}
                    >
                      Clear All
                    </button>
                  </div>
                  {unitOptions[dashboardSubject]?.map((unit) => {
                    const selectedUnits =
                      filters.unit === "all" ? [] : filters.unit.split(",");
                    return (
                      <DropdownMenuCheckboxItem
                        key={unit}
                        checked={selectedUnits.includes(unit)}
                        onSelect={(e) => e.preventDefault()}
                        onCheckedChange={(checked) => {
                          const updated = checked
                            ? [...selectedUnits, unit]
                            : selectedUnits.filter((u) => u !== unit);
                          handleFilterChange(
                            "unit",
                            updated.length ? updated.join(",") : "all"
                          );
                        }}
                      >
                        {unit}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
              <div
                className={`h-6 ${
                  darkMode ? "border-[#3E5574]" : "border-[#D1D8E0]"
                } border-r `}
              />
            </div>

            <div
              className={`rounded-xl p-[1.5px] ${
                filters.status === "Not Started"
                  ? darkMode
                    ? "bg-gradient-to-r from-[#3E5574] to-[#FF881F]"
                    : "bg-gradient-to-r from-[#D1D8E0] to-[#FF881F]"
                  : ""
              }`}
            >
              <button
                onClick={() =>
                  handleFilterChange(
                    "status",
                    filters.status === "Not Started" ? "all" : "Not Started"
                  )
                }
                className={`flex min-w-8 min-h-8 rounded-xl font-medium items-center gap-1 px-3 py-1.5 text-[16px] w-full h-full
      ${
        filters.status === "Not Started"
          ? darkMode
            ? "bg-[#1E2A38] text-white"
            : "bg-white text-[#101319]"
          : darkMode
          ? "border border-[#3E5574] text-white"
          : "border border-[#D1D8E0] text-[#101319]"
      }
    `}
              >
                Not Started
              </button>
            </div>

            <div
              className={`rounded-xl p-[1.5px] ${
                filters.weak === "true"
                  ? darkMode
                    ? "bg-gradient-to-r from-[#3E5574] to-[#FF881F]"
                    : "bg-gradient-to-r from-[#D1D8E0] to-[#FF881F]"
                  : ""
              }`}
            >
              <button
                onClick={() =>
                  handleFilterChange(
                    "weak",
                    filters.weak === "true" ? "all" : "true"
                  )
                }
                className={`flex min-w-8 min-h-8 rounded-xl font-medium items-center gap-1 px-3 py-1.5 text-[16px] w-full h-full
      ${
        filters.weak === "true"
          ? darkMode
            ? "bg-[#1E2A38] text-white"
            : "bg-white text-[#101319]"
          : darkMode
          ? "border border-[#3E5574] text-white"
          : "border border-[#D1D8E0] text-[#101319]"
      }
    `}
              >
                Weak Chapters
              </button>
            </div>
          </div>
          <div className="justify-between items-center flex w-full mb-4">
            <div className="text-sm ">
              Showing all chapters ({sortedChapters.length})
            </div>
            <div className="ml-auto flex items-center">
              <button
                onClick={() =>
                  setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
                }
                className={`flex items-center text-sm font-medium ${
                  darkMode ? "text-[#6FBBFC]" : "text-[#0065DE]"
                } hover:text-blue-600 transition-colors`}
              >
                <ArrowDownIcon className="h-4 w-4" />

                <ArrowUpIcon className="h-4 w-4 -ml-2" />
                <span className="ml-1">Sort</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <ChapterCardSkeleton key={i} />
                ))
              : sortedChapters.map((chapter) => (
                  <ChapterCard
                    key={chapter.chapter}
                    chapter={chapter}
                    darkMode={darkMode}
                  />
                ))}
          </div>
        </div>
      </main>
    </div>
  );
};

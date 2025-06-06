"use client";

import React, { useState } from "react";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  BookOpenIcon,
  FlaskIcon,
  GlobeIcon,
  LightningIcon,
  CompassIcon,
  NotePencilIcon,
  CheckIcon,
  XIcon,
} from "@phosphor-icons/react";
import { Card } from "@/components/ui/card";
import { Chapter } from "@/types/chapter";

interface ChapterCardProps {
  chapter: Chapter;
  darkMode?: boolean;
}

const randomIconComponents = [
  BookOpenIcon,
  FlaskIcon,
  GlobeIcon,
  LightningIcon,
  CompassIcon,
];

export const ChapterCard: React.FC<ChapterCardProps> = ({
  chapter,
  darkMode,
}) => {
  const { chapter: title, yearWiseQuestionCount } = chapter;

  const [note, setNote] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [tempNote, setTempNote] = useState<string>("");

  const years = Object.keys(yearWiseQuestionCount ?? {}).sort(
    (a, b) => Number(b) - Number(a)
  );
  const latestYear = years[0] || "";
  const secondLatestYear = years[1] || "";

  const latestCount = latestYear ? yearWiseQuestionCount?.[latestYear] ?? 0 : 0;
  const secondLatestCount = secondLatestYear
    ? yearWiseQuestionCount?.[secondLatestYear] ?? 0
    : 0;
  const trendUp = latestCount > secondLatestCount;

  const ArrowIcon = trendUp ? ArrowUpIcon : ArrowDownIcon;

  const iconIndex =
    Math.abs(title.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)) %
    randomIconComponents.length;
  const Icon = randomIconComponents[iconIndex];

  const cardBg = darkMode
    ? "bg-[#222E3F] text-[#FFFFFF]"
    : "bg-[#FFFFFF] text-[#101319]";
  const borderColor = darkMode ? "border-[#B9BFD0]" : "border-[#505D79]";
  const textMuted = darkMode ? "text-[#B9BFD0]" : "text-[#505D79]";
  const noteButtonColor = darkMode ? "text-[#56ACF3]" : "text-[#1E70C1]";

  const trendColor = trendUp
    ? darkMode
      ? "text-[#56EEB0]"
      : "text-[#007F42]"
    : darkMode
    ? "text-[#FB484D]"
    : "text-[#E02A2F]";

  const totalQuestions = Object.values(yearWiseQuestionCount ?? {}).reduce(
    (acc, val) => acc + val,
    0
  );

  const handleNoteSave = () => {
    setNote(tempNote);
    setIsEditing(false);
  };

  const handleNoteCancel = () => {
    setTempNote(note);
    setIsEditing(false);
  };

  return (
    <Card
      className={`p-4 ${
        darkMode ? "border-[#3E5574]" : "border-[#D1D8E0]"
      } border rounded-xl hover:shadow-sm cursor-pointer transition-colors ${cardBg} flex flex-col gap-2`}
    >
      <div className="flex justify-between items-center w-full h-[60px]">
        <div className="flex items-center gap-4">
          <Icon size={24} className="text-orange-500" />
          <span className="font-medium text-[18px] leading-none">{title}</span>
        </div>
        <div className={`flex items-center gap-4 text-xs ${textMuted}`}>
          <span
            className={`flex items-center gap-1 text-sm border-r pr-3 ${borderColor} leading-none`}
          >
            <span className="font-medium">{latestYear}:</span> {latestCount} Qs
            {latestCount !== secondLatestCount && (
              <ArrowIcon size={16} className={trendColor} />
            )}
          </span>
          <span
            className={`flex items-center gap-1 text-sm border-r pr-3 ${
              darkMode ? "border-[#3E5574]" : "border-[#D1D8E0]"
            } leading-none`}
          >
            <span className="font-medium">{secondLatestYear}:</span>{" "}
            {secondLatestCount} Qs
          </span>
          <span className={`text-sm leading-none ${textMuted}`}>
            {chapter.questionSolved}/{totalQuestions} Qs
          </span>
        </div>
      </div>

      
      <div className="pt-1">
        {isEditing ? (
          <div className="flex flex-col gap-2">
            <textarea
              className={`w-full p-2 rounded-md text-sm border resize-none ${
                darkMode
                  ? "bg-[#1C2433] text-white border-[#505D79]"
                  : "bg-white text-black border-gray-300"
              }`}
              rows={3}
              value={tempNote}
              onChange={(e) => setTempNote(e.target.value)}
              placeholder="Write your note here..."
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleNoteSave}
                className={`flex items-center gap-1 text-sm font-medium ${noteButtonColor}`}
              >
                <CheckIcon size={16} /> Save
              </button>
              <button
                onClick={handleNoteCancel}
                className={`flex items-center gap-1 text-sm font-medium ${textMuted}`}
              >
                <XIcon size={16} /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-start mt-1">
            <p className={`text-sm ${note ? "" : "italic"} ${textMuted}`}>
              {note || "No note added"}
            </p>
            <button
              onClick={() => {
                setTempNote(note);
                setIsEditing(true);
              }}
              className={`flex items-center gap-1 text-sm font-medium ${noteButtonColor}`}
            >
              <NotePencilIcon size={16} />
              {note ? "Edit Note" : "Add Note"}
            </button>
          </div>
        )}
      </div>
    </Card>
  );
};

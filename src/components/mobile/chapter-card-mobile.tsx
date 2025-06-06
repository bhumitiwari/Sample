"use client";

import React from "react";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  BookOpenIcon,
  FlaskIcon,
  GlobeIcon,
  LightningIcon,
  CompassIcon,
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

export const ChapterCardMobile: React.FC<ChapterCardProps> = ({
  chapter,
  darkMode,
}) => {
  const { chapter: title, yearWiseQuestionCount } = chapter;

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
  const textMuted = darkMode ? "text-[#B9BFD0]" : "text-[#505D79]";

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

  return (
    <Card
      className={`p-4 hover:shadow-sm cursor-pointer transition-colors ${cardBg} flex flex-col gap-2 border-none`}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          <Icon size={24} className="text-orange-500" />
          <span className="font-medium text-[16px] leading-[1.2] truncate">
            {title}
          </span>
        </div>
        <span className={`text-[12px]  leading-none ${textMuted}`}>
          {chapter.questionSolved}/{totalQuestions} Qs
        </span>
      </div>

      <div className={`flex items-center gap-4 text-[12px] ${textMuted}`}>
        <span
          className={`flex items-center gap-1 border-r pr-3 ${
            darkMode ? "border-[#505D79]" : "border-[#B9BFD0]"
          }`}
        >
          <span className="font-medium">{latestYear}:</span> {latestCount} Qs
          {latestCount !== secondLatestCount && (
            <ArrowIcon size={14} className={trendColor} />
          )}
        </span>
        <span className={`flex items-center gap-1 ${textMuted}`}>
          <span className="font-medium">{secondLatestYear}:</span>{" "}
          {secondLatestCount} Qs
        </span>
      </div>
    </Card>
  );
};

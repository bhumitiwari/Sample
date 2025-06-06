"use client";

import { Provider } from "react-redux";
import { store } from "@/lib/redux/store";
import { ChaptersDashboard } from "@/components/desktop/chapters-dashboard";
import { ChaptersMobileUI } from "@/components/mobile/chapters-mobile-ui";
import { useMediaQuery } from "usehooks-ts";

export default function Home() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <Provider store={store}>
      {isMobile ? <ChaptersMobileUI /> : <ChaptersDashboard />}
    </Provider>
  );
}

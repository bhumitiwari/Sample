import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Chapter, ChaptersState } from "@/types/chapter";
import { mockChaptersData } from "@/lib/mock-data";

export const fetchChapters = createAsyncThunk(
  "chapters/fetchChapters",
  async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return mockChaptersData;
  }
);

const applyFilters = (
  chapters: Chapter[],
  filters: ChaptersState["filters"]
) => {
  const selectedClasses =
    filters.class === "all" ? [] : filters.class.split(",");
  const selectedUnits = filters.unit === "all" ? [] : filters.unit.split(",");

  return chapters.filter((chapter) => {
    const subjectMatch =
      filters.subject === "all" || chapter.subject === filters.subject;

    const unitMatch =
      selectedUnits.length === 0 || selectedUnits.includes(chapter.unit);

    const statusMatch =
      filters.status === "all" || chapter.status === filters.status;

    const chapterClassNumber = chapter.class.replace("Class ", "");
    const classMatch =
      selectedClasses.length === 0 ||
      selectedClasses.includes(chapterClassNumber);

    const weakMatch =
      filters.weak === "all" ||
      (filters.weak === "true" && chapter.isWeakChapter) ||
      (filters.weak === "false" && !chapter.isWeakChapter);

    return subjectMatch && unitMatch && statusMatch && classMatch && weakMatch;
  });
};

const initialState: ChaptersState = {
  chapters: [],
  filteredChapters: [],
  loading: false,
  error: null,
  filters: {
    subject: "Physics", 
    unit: "all",
    status: "all",
    class: "all",
    weak: "all", 
  },
};

const chaptersSlice = createSlice({
  name: "chapters",
  initialState,
  reducers: {
    setFilter: (
      state,
      action: PayloadAction<{
        filterType: keyof ChaptersState["filters"];
        value: string;
      }>
    ) => {
      state.filters[action.payload.filterType] = action.payload.value;
      state.filteredChapters = applyFilters(state.chapters, state.filters);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChapters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChapters.fulfilled, (state, action) => {
        state.loading = false;
        state.chapters = action.payload;
      
        state.filteredChapters = applyFilters(action.payload, state.filters);
      })
      .addCase(fetchChapters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch chapters";
      });
  },
});

export const { setFilter } = chaptersSlice.actions;
export default chaptersSlice.reducer;

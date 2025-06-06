
import { RootState } from './store'
import { Chapter } from '@/types/chapter'  


export const selectFilteredChapters = (state: RootState): Chapter[] => state.chapters.filteredChapters
export const selectChaptersLoading = (state: RootState): boolean => state.chapters.loading
export const selectChaptersError = (state: RootState): string | null => state.chapters.error
export const selectFilters = (state: RootState) => state.chapters.filters



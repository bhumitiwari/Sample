export interface YearWiseQuestionCount {
  [year: string]: number
}

export interface Chapter {
 
  subject: string
  chapter: string
  class: string
  unit: string
  totalQuestions?: number
  questions2025?: number
  questions2024?: number
  yearWiseQuestionCount?: YearWiseQuestionCount
  questionSolved: number
  status: 'Not Started' | 'In Progress' | 'Completed'
  isWeakChapter?: boolean
}

export interface ChaptersState {
  chapters: Chapter[]
  filteredChapters: Chapter[]
  loading: boolean
  error: string | null
  filters: {
    subject: string
    unit: string
    status: string
    class: string
    weak: string 
  }
}

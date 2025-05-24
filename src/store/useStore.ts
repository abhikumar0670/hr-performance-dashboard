import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Employee = {
  id: number
  firstName: string
  lastName: string
  email: string
  age: number
  department: string
  performance: number
  address: string
  phone: string
  bio: string
  isBookmarked: boolean
}

type Store = {
  employees: Employee[]
  bookmarkedEmployees: Employee[]
  searchQuery: string
  departmentFilter: string[]
  performanceFilter: number[]
  setEmployees: (employees: Employee[]) => void
  toggleBookmark: (employeeId: number) => void
  setSearchQuery: (query: string) => void
  setDepartmentFilter: (departments: string[]) => void
  setPerformanceFilter: (ratings: number[]) => void
  promoteEmployee: (employeeId: number) => void
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      employees: [],
      bookmarkedEmployees: [],
      searchQuery: '',
      departmentFilter: [],
      performanceFilter: [],
      setEmployees: (employees) => set({ employees }),
      toggleBookmark: (employeeId) =>
        set((state) => {
          const updatedEmployees = state.employees.map((emp) =>
            emp.id === employeeId
              ? { ...emp, isBookmarked: !emp.isBookmarked }
              : emp
          )
          const bookmarkedEmployees = updatedEmployees.filter(
            (emp) => emp.isBookmarked
          )
          return { employees: updatedEmployees, bookmarkedEmployees }
        }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setDepartmentFilter: (departments) =>
        set({ departmentFilter: departments }),
      setPerformanceFilter: (ratings) => set({ performanceFilter: ratings }),
      promoteEmployee: (employeeId) =>
        set((state) => ({
          employees: state.employees.map((emp) =>
            emp.id === employeeId
              ? { ...emp, performance: Math.min(5, emp.performance + 0.5) }
              : emp
          ),
        })),
    }),
    {
      name: 'hr-dashboard-storage',
    }
  )
) 
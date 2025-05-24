import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function generatePerformanceHistory() {
  const months = 12
  const history = []
  const today = new Date()

  for (let i = 0; i < months; i++) {
    const date = new Date(today)
    date.setMonth(date.getMonth() - i)
    history.push({
      date: date.toISOString(),
      rating: Number((Math.random() * 2 + 3).toFixed(1)), // Random rating between 3 and 5
    })
  }

  return history.reverse()
}

export const departments = [
  'Engineering',
  'Marketing',
  'Sales',
  'Human Resources',
  'Finance',
  'Operations',
  'Product',
  'Design',
] as const

export function getDepartmentColor(department: string) {
  const colors = {
    Engineering: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    Marketing: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    Sales: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'Human Resources': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
    Finance: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    Operations: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    Product: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    Design: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  }
  return colors[department as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
} 
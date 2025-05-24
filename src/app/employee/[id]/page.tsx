'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useStore } from '@/store/useStore'
import { departments, getDepartmentColor, generatePerformanceHistory } from '@/lib/utils'
import { StarIcon, BookmarkIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

type Tab = 'overview' | 'projects' | 'feedback'

const feedbackReviewers = [
  { name: 'Rajesh Kumar', role: 'Senior Manager' },
  { name: 'Priya Sharma', role: 'Project Lead' },
  { name: 'Amit Gupta', role: 'Technical Director' },
  { name: 'Neha Singh', role: 'HR Manager' },
  { name: 'Vikram Patel', role: 'Department Head' },
  { name: 'Ananya Verma', role: 'Team Lead' },
  { name: 'Deepak Yadav', role: 'Senior Developer' },
  { name: 'Meera Joshi', role: 'Product Manager' },
  { name: 'Ravi Chauhan', role: 'Quality Assurance Lead' },
  { name: 'Divya Mishra', role: 'Scrum Master' },
]

export default function EmployeePage() {
  const params = useParams()
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const { employees, toggleBookmark, promoteEmployee } = useStore()
  const employee = employees.find((emp) => emp.id === Number(params.id))

  if (!employee) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Employee not found
          </h2>
          <Link href="/" className="btn btn-primary mt-4">
            Return to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const performanceHistory = generatePerformanceHistory()

  const chartData = {
    labels: performanceHistory.map((item) =>
      new Date(item.date).toLocaleDateString('en-US', { month: 'short' })
    ),
    datasets: [
      {
        label: 'Performance Rating',
        data: performanceHistory.map((item) => item.rating),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Performance History',
      },
    },
    scales: {
      y: {
        min: 1,
        max: 5,
        ticks: {
          stepSize: 1,
        },
      },
    },
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'projects', label: 'Projects' },
    { id: 'feedback', label: 'Feedback' },
  ]

  const feedbackData = [
    {
      date: '2024-01-15',
      reviewer: feedbackReviewers[(employee?.id || 0) % feedbackReviewers.length].name,
      role: feedbackReviewers[(employee?.id || 0) % feedbackReviewers.length].role,
      rating: 4.5,
      comment:
        'Excellent work on the website redesign project. Strong technical skills and great communication.',
    },
    {
      date: '2023-12-01',
      reviewer: feedbackReviewers[((employee?.id || 0) + 2) % feedbackReviewers.length].name,
      role: feedbackReviewers[((employee?.id || 0) + 2) % feedbackReviewers.length].role,
      rating: 4.0,
      comment:
        'Good progress on the mobile app development. Keep up the good work!',
    },
    {
      date: '2023-10-15',
      reviewer: feedbackReviewers[((employee?.id || 0) + 4) % feedbackReviewers.length].name,
      role: feedbackReviewers[((employee?.id || 0) + 4) % feedbackReviewers.length].role,
      rating: 4.2,
      comment:
        'Successfully completed the database migration ahead of schedule. Well done!',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/" className="text-primary-600 hover:text-primary-700">
            ← Back to Dashboard
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
            {employee.firstName} {employee.lastName}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => toggleBookmark(employee.id)}
          >
            <BookmarkIcon
              className={`mr-2 h-5 w-5 ${
                employee.isBookmarked
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-400'
              }`}
            />
            {employee.isBookmarked ? 'Bookmarked' : 'Bookmark'}
          </Button>
          <Button onClick={() => promoteEmployee(employee.id)}>Promote</Button>
        </div>
      </div>

      <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`border-b-2 px-4 py-2 text-sm font-medium ${
              activeTab === tab.id
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Employee Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Email
                    </span>
                    <span className="text-sm font-medium">{employee.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Department
                    </span>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${getDepartmentColor(
                        employee.department
                      )}`}
                    >
                      {employee.department}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Age
                    </span>
                    <span className="text-sm font-medium">
                      {employee.age} years
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Phone
                    </span>
                    <span className="text-sm font-medium">{employee.phone}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Address
                    </span>
                    <span className="text-sm font-medium text-right">
                      {employee.address}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Current Rating
                    </span>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star}>
                          {star <= Math.floor(employee.performance) ? (
                            <StarIcon className="h-5 w-5 text-yellow-400" />
                          ) : (
                            <StarOutlineIcon className="h-5 w-5 text-gray-300" />
                          )}
                        </span>
                      ))}
                      <span className="ml-2 text-sm font-medium">
                        {employee.performance.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <div className="h-64">
                    <Line data={chartData} options={chartOptions} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'projects' && (
          <Card>
            <CardHeader>
              <CardTitle>Current Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    name: 'Website Redesign',
                    status: 'In Progress',
                    progress: 75,
                  },
                  {
                    name: 'Mobile App Development',
                    status: 'Planning',
                    progress: 20,
                  },
                  {
                    name: 'Database Migration',
                    status: 'Completed',
                    progress: 100,
                  },
                ].map((project, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{project.name}</h3>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          project.status === 'Completed'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : project.status === 'In Progress'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>
                    <div className="mt-2">
                      <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          className="h-2 rounded-full bg-primary-500"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="mt-1 block text-right text-sm text-gray-500 dark:text-gray-400">
                        {project.progress}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'feedback' && (
          <Card>
            <CardHeader>
              <CardTitle>Performance Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {feedbackData.map((feedback, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{feedback.reviewer}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {feedback.role}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(feedback.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star}>
                            {star <= Math.floor(feedback.rating) ? (
                              <StarIcon className="h-5 w-5 text-yellow-400" />
                            ) : (
                              <StarOutlineIcon className="h-5 w-5 text-gray-300" />
                            )}
                          </span>
                        ))}
                        <span className="ml-2 text-sm font-medium">
                          {feedback.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                      {feedback.comment}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { useStore } from '@/store/useStore'
import { departments, getDepartmentColor } from '@/lib/utils'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

export default function AnalyticsPage() {
  const { employees } = useStore()
  const [departmentStats, setDepartmentStats] = useState<{
    [key: string]: { count: number; avgPerformance: number }
  }>({})
  const [ageDistribution, setAgeDistribution] = useState<{
    labels: string[]
    data: number[]
  }>({ labels: [], data: [] })

  useEffect(() => {
    // Calculate department statistics
    const stats = departments.reduce((acc, dept) => {
      const deptEmployees = employees.filter((emp) => emp.department === dept)
      acc[dept] = {
        count: deptEmployees.length,
        avgPerformance:
          deptEmployees.reduce((sum, emp) => sum + emp.performance, 0) /
          (deptEmployees.length || 1),
      }
      return acc
    }, {} as { [key: string]: { count: number; avgPerformance: number } })
    setDepartmentStats(stats)

    // Calculate age distribution
    const ageRanges = ['18-25', '26-35', '36-45', '46-55', '56+']
    const distribution = ageRanges.map((range) => {
      const [min, max] = range.split('-').map(Number)
      return employees.filter((emp) => {
        if (range === '56+') return emp.age >= 56
        return emp.age >= min && emp.age <= max
      }).length
    })
    setAgeDistribution({ labels: ageRanges, data: distribution })
  }, [employees])

  const departmentData = {
    labels: departments,
    datasets: [
      {
        label: 'Number of Employees',
        data: departments.map((dept) => departmentStats[dept]?.count || 0),
        backgroundColor: departments.map(
          (dept) => `hsl(${getDepartmentColor(dept).split(' ')[0].split('-')[1]}, 70%, 50%)`
        ),
      },
    ],
  }

  const performanceData = {
    labels: departments,
    datasets: [
      {
        label: 'Average Performance Rating',
        data: departments.map((dept) => departmentStats[dept]?.avgPerformance || 0),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
    ],
  }

  const ageData = {
    labels: ageDistribution.labels,
    datasets: [
      {
        label: 'Number of Employees',
        data: ageDistribution.data,
        backgroundColor: [
          'rgba(59, 130, 246, 0.5)',
          'rgba(16, 185, 129, 0.5)',
          'rgba(245, 158, 11, 0.5)',
          'rgba(239, 68, 68, 0.5)',
          'rgba(139, 92, 246, 0.5)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
          'rgb(139, 92, 246)',
        ],
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  }

  const performanceOptions = {
    ...chartOptions,
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          HR Analytics Dashboard
        </h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary-600">
              {employees.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary-600">
              {(
                employees.reduce((sum, emp) => sum + emp.performance, 0) /
                employees.length
              ).toFixed(1)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary-600">
              {departments.length}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Department Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Doughnut data={departmentData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Age Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Bar data={ageData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Department Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Line data={performanceData} options={performanceOptions} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Department Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-4 py-2 text-left">Department</th>
                  <th className="px-4 py-2 text-left">Employees</th>
                  <th className="px-4 py-2 text-left">Avg. Performance</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((dept) => (
                  <tr
                    key={dept}
                    className="border-b border-gray-200 dark:border-gray-700"
                  >
                    <td className="px-4 py-2">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${getDepartmentColor(
                          dept
                        )}`}
                      >
                        {dept}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      {departmentStats[dept]?.count || 0}
                    </td>
                    <td className="px-4 py-2">
                      {departmentStats[dept]?.avgPerformance.toFixed(1) || '0.0'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
'use client'

import { useEffect, useState } from 'react'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { AnimatedCard } from '@/components/ui/AnimatedCard'
import { Button } from '@/components/ui/Button'
import { useStore } from '@/store/useStore'
import { departments, getDepartmentColor } from '@/lib/utils'
import { StarIcon, BookmarkIcon, PlusIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { CreateUserModal } from '@/components/modals/CreateUserModal'
import { AnimatePresence, motion } from 'framer-motion'

const indianNames = {
  male: [
    { firstName: 'Rahul', lastName: 'Sharma' },
    { firstName: 'Arjun', lastName: 'Patel' },
    { firstName: 'Vikram', lastName: 'Singh' },
    { firstName: 'Rajesh', lastName: 'Kumar' },
    { firstName: 'Amit', lastName: 'Gupta' },
    { firstName: 'Suresh', lastName: 'Verma' },
    { firstName: 'Deepak', lastName: 'Yadav' },
    { firstName: 'Karan', lastName: 'Mishra' },
    { firstName: 'Ravi', lastName: 'Chauhan' },
    { firstName: 'Nitin', lastName: 'Joshi' },
  ],
  female: [
    { firstName: 'Priya', lastName: 'Sharma' },
    { firstName: 'Ananya', lastName: 'Patel' },
    { firstName: 'Neha', lastName: 'Singh' },
    { firstName: 'Pooja', lastName: 'Kumar' },
    { firstName: 'Meera', lastName: 'Gupta' },
    { firstName: 'Divya', lastName: 'Verma' },
    { firstName: 'Riya', lastName: 'Yadav' },
    { firstName: 'Sneha', lastName: 'Mishra' },
    { firstName: 'Kavita', lastName: 'Chauhan' },
    { firstName: 'Anjali', lastName: 'Joshi' },
  ],
}

const indianCities = [
  { city: 'Mumbai', state: 'Maharashtra' },
  { city: 'Delhi', state: 'Delhi' },
  { city: 'Bangalore', state: 'Karnataka' },
  { city: 'Hyderabad', state: 'Telangana' },
  { city: 'Chennai', state: 'Tamil Nadu' },
  { city: 'Kolkata', state: 'West Bengal' },
  { city: 'Pune', state: 'Maharashtra' },
  { city: 'Ahmedabad', state: 'Gujarat' },
  { city: 'Jaipur', state: 'Rajasthan' },
  { city: 'Lucknow', state: 'Uttar Pradesh' },
]

const indianLocations = [
  'Andheri East',
  'Koramangala',
  'Bandra West',
  'Salt Lake City',
  'T Nagar',
  'Indiranagar',
  'Powai',
  'Sector 62',
  'Malviya Nagar',
  'Gomti Nagar',
]

const ITEMS_PER_PAGE = 6

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const {
    employees,
    setEmployees,
    searchQuery,
    setSearchQuery,
    departmentFilter,
    setDepartmentFilter,
    performanceFilter,
    setPerformanceFilter,
    toggleBookmark,
    promoteEmployee,
  } = useStore()

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('https://dummyjson.com/users?limit=20')
        const data = await response.json()
        
        // Process and transform the data with Indian details
        const processedEmployees = data.users.map((user: any, index: number) => {
          const gender = user.gender.toLowerCase()
          const nameList = indianNames[gender as keyof typeof indianNames]
          const nameIndex = index % nameList.length
          const { firstName, lastName } = nameList[nameIndex]
          
          // Create Indian-style email
          const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.in`

          // Generate Indian phone number
          const phoneNumber = `+91 ${Math.floor(Math.random() * 9000000000 + 1000000000)}`

          // Generate Indian address
          const cityIndex = index % indianCities.length
          const locationIndex = index % indianLocations.length
          const { city, state } = indianCities[cityIndex]
          const address = `${indianLocations[locationIndex]}, ${city}, ${state} - ${Math.floor(Math.random() * 900000 + 100000)}`

          return {
            id: user.id,
            firstName,
            lastName,
            email,
            age: user.age,
            department: departments[Math.floor(Math.random() * departments.length)],
            performance: Number((Math.random() * 2 + 3).toFixed(1)), // Random rating between 3 and 5
            address,
            phone: phoneNumber,
            bio: 'Experienced professional with a strong track record in their field. Demonstrates excellent leadership and technical skills.',
            isBookmarked: false,
          }
        })
        setEmployees(processedEmployees)
      } catch (error) {
        console.error('Error fetching employees:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEmployees()
  }, [setEmployees])

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      searchQuery === '' ||
      employee.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesDepartment =
      departmentFilter.length === 0 ||
      departmentFilter.includes(employee.department)

    const matchesPerformance =
      performanceFilter.length === 0 ||
      performanceFilter.includes(Math.floor(employee.performance))

    return matchesSearch && matchesDepartment && matchesPerformance
  })

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, departmentFilter, performanceFilter])

  const totalPages = Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedEmployees = filteredEmployees.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Employee Dashboard
          </h1>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Add Employee
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input max-w-xs"
          />
          <select
            multiple
            value={departmentFilter}
            onChange={(e) =>
              setDepartmentFilter(
                Array.from(e.target.selectedOptions, (option) => option.value)
              )
            }
            className="input max-w-xs"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          <select
            multiple
            value={performanceFilter.map(String)}
            onChange={(e) =>
              setPerformanceFilter(
                Array.from(e.target.selectedOptions, (option) =>
                  Number(option.value)
                )
              )
            }
            className="input max-w-xs"
          >
            <option value="">All Ratings</option>
            {[1, 2, 3, 4, 5].map((rating) => (
              <option key={rating} value={rating}>
                {rating} Stars
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex h-64 items-center justify-center"
        >
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
        </motion.div>
      ) : (
        <>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {paginatedEmployees.map((employee, index) => (
                <AnimatedCard key={employee.id} index={index}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>
                          {employee.firstName} {employee.lastName}
                        </CardTitle>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          {employee.email}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleBookmark(employee.id)}
                      >
                        <BookmarkIcon
                          className={`h-5 w-5 ${
                            employee.isBookmarked
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-400'
                          }`}
                        />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
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
                          Performance
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
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          href={`/employee/${employee.id}`}
                          className="btn btn-primary flex-1"
                        >
                          View Details
                        </Link>
                        <Button
                          variant="secondary"
                          className="flex-1"
                          onClick={() => promoteEmployee(employee.id)}
                        >
                          Promote
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </AnimatedCard>
              ))}
            </motion.div>
          </AnimatePresence>

          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-2"
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </Button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRightIcon className="h-5 w-5" />
              </Button>
            </motion.div>
          )}

          {filteredEmployees.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex h-64 flex-col items-center justify-center text-center"
            >
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                No employees found
              </p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Try adjusting your search or filters
              </p>
            </motion.div>
          )}
        </>
      )}

      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </motion.div>
  )
} 
'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CalendarIcon, CheckCircle2Icon, XCircleIcon } from "lucide-react"

export function AddFreeDates() {
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('idle')

    // Simulate API call to Google Calendar
    try {
      // In a real application, you would make an API call to Google Calendar here
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Simulating a successful response
      setStatus('success')
    } catch (error) {
      setStatus('error')
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Add Free Calendar Dates</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <div className="relative">
            <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="pl-10 border-none rounded-xl shadow"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startTime">Start Time</Label>
            <Input
              className='border-none rounded-xl shadow'
              id="startTime"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endTime">End Time</Label>
            <Input
            className='border-none rounded-xl shadow'
              id="endTime"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>
        </div>
        <Button type="submit" className="w-full">
          Add Free Time Slot
        </Button>
      </form>
      {status === 'success' && (
        <Alert className="mt-4 bg-green-50 border-green-200">
          <CheckCircle2Icon className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Success</AlertTitle>
          <AlertDescription className="text-green-700">
            The date was successfully added to your calendar.
          </AlertDescription>
        </Alert>
      )}
      {status === 'error' && (
        <Alert className="mt-4 bg-red-50 border-red-200">
          <XCircleIcon className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800">Error</AlertTitle>
          <AlertDescription className="text-red-700">
            There was an error adding the date to your calendar. Please try again.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
export default AddFreeDates;
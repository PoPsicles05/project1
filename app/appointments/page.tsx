'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { toast } from '@/components/ui/use-toast'

interface Appointment {
  id: number
  date: string
  time: string
  doctor: string
  department: string
  status: string
}

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [selectedDoctor, setSelectedDoctor] = useState('')

  useEffect(() => {
    fetchAppointments()
  }, [])

  async function fetchAppointments() {
    setLoading(true)
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
    if (error) {
      console.error('Error fetching appointments:', error)
      toast({
        title: "Error",
        description: "Failed to fetch appointments. Please try again.",
        variant: "destructive",
      })
    } else {
      setAppointments(data as Appointment[])
    }
    setLoading(false)
  }

  const handleReschedule = async (id: number) => {
    // Implement rescheduling logic here
    console.log('Rescheduling appointment', id)
  }

  const handleCancel = async (id: number) => {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id)
    if (error) {
      console.error('Error cancelling appointment:', error)
      toast({
        title: "Error",
        description: "Failed to cancel appointment. Please try again.",
        variant: "destructive",
      })
    } else {
      setAppointments(appointments.filter(app => app.id !== id))
      toast({
        title: "Success",
        description: "Appointment cancelled successfully.",
      })
    }
  }

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedDepartment || !selectedDoctor) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      })
      return
    }

    const newAppointment = {
      date: selectedDate.toISOString().split('T')[0],
      time: '10:00 AM', // You might want to add a time picker in your UI
      doctor: selectedDoctor,
      department: selectedDepartment,
      status: 'Scheduled'
    }

    const { data, error } = await supabase
      .from('appointments')
      .insert([newAppointment])
    
    if (error) {
      console.error('Error booking appointment:', error)
      toast({
        title: "Error",
        description: "Failed to book appointment. Please try again.",
        variant: "destructive",
      })
    } else {
      fetchAppointments()
      toast({
        title: "Success",
        description: "Appointment booked successfully.",
      })
    }
  }

  if (loading) {
    return <div>Loading appointments...</div>
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Your Appointments</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Doctor</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment.id}>
              <TableCell>{appointment.date}</TableCell>
              <TableCell>{appointment.time}</TableCell>
              <TableCell>{appointment.doctor}</TableCell>
              <TableCell>{appointment.department}</TableCell>
              <TableCell>{appointment.status}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" className="mr-2" onClick={() => handleReschedule(appointment.id)}>
                  Reschedule
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleCancel(appointment.id)}>
                  Cancel
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-6">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Book New Appointment</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Book New Appointment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Select onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cardiology">Cardiology</SelectItem>
                  <SelectItem value="neurology">Neurology</SelectItem>
                  <SelectItem value="orthopedics">Orthopedics</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={setSelectedDoctor}>
                <SelectTrigger>
                  <SelectValue placeholder="Select doctor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dr-smith">Dr. Smith</SelectItem>
                  <SelectItem value="dr-johnson">Dr. Johnson</SelectItem>
                  <SelectItem value="dr-williams">Dr. Williams</SelectItem>
                </SelectContent>
              </Select>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
              <Button onClick={handleBookAppointment}>Book Appointment</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from '@/components/ui/use-toast'

interface MedicalRecord {
  id: number
  date: string
  doctor: string
  diagnosis: string
  treatment: string
}

export default function MedicalRecords() {
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMedicalRecords()
  }, [])

  async function fetchMedicalRecords() {
    setLoading(true)
    const { data, error } = await supabase
      .from('medical_records')
      .select('*')
    if (error) {
      console.error('Error fetching medical records:', error)
      toast({
        title: "Error",
        description: "Failed to fetch medical records. Please try again.",
        variant: "destructive",
      })
    } else {
      setRecords(data as MedicalRecord[])
    }
    setLoading(false)
  }

  if (loading) {
    return <div>Loading medical records...</div>
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Medical Records</h1>
      <Card>
        <CardHeader>
          <CardTitle>Your Medical History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Diagnosis</TableHead>
                <TableHead>Treatment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.doctor}</TableCell>
                  <TableCell>{record.diagnosis}</TableCell>
                  <TableCell>{record.treatment}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
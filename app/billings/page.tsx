'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from '@/components/ui/use-toast'

interface Bill {
  id: number
  date: string
  description: string
  amount: number
  status: string
}

export default function Billings() {
  const [bills, setBills] = useState<Bill[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBills()
  }, [])

  async function fetchBills() {
    setLoading(true)
    const { data, error } = await supabase
      .from('billings')
      .select('*')
    if (error) {
      console.error('Error fetching bills:', error)
      toast({
        title: "Error",
        description: "Failed to fetch bills. Please try again.",
        variant: "destructive",
      })
    } else {
      setBills(data as Bill[])
    }
    setLoading(false)
  }

  async function handlePayment(id: number) {
    const { data, error } = await supabase
      .from('billings')
      .update({ status: 'Paid' })
      .eq('id', id)
    
    if (error) {
      console.error('Error processing payment:', error)
      toast({
        title: "Error",
        description: "Failed to process payment. Please try again.",
        variant: "destructive",
      })
    } else {
      fetchBills()
      toast({
        title: "Success",
        description: "Payment processed successfully.",
      })
    }
  }

  if (loading) {
    return <div>Loading bills...</div>
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Billings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Your Billing History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bills.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell>{bill.date}</TableCell>
                  <TableCell>{bill.description}</TableCell>
                  <TableCell>${bill.amount}</TableCell>
                  <TableCell>{bill.status}</TableCell>
                  <TableCell>
                    {bill.status === 'Pending' && (
                      <Button variant="outline" size="sm" onClick={() => handlePayment(bill.id)}>Pay Now</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
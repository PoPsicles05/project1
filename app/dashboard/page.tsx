import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default function Dashboard() {
  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent>
              View and edit your profile information
            </CardContent>
          </Card>
        </Link>
        <Link href="/appointments">
          <Card>
            <CardHeader>
              <CardTitle>Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              Manage your appointments
            </CardContent>
          </Card>
        </Link>
        <Link href="/medical-records">
          <Card>
            <CardHeader>
              <CardTitle>Medical Records</CardTitle>
            </CardHeader>
            <CardContent>
              Access your medical records
            </CardContent>
          </Card>
        </Link>
        <Link href="/prescriptions">
          <Card>
            <CardHeader>
              <CardTitle>Prescriptions</CardTitle>
            </CardHeader>
            <CardContent>
              View your current prescriptions
            </CardContent>
          </Card>
        </Link>
        <Link href="/test-results">
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              Check your recent test results
            </CardContent>
          </Card>
        </Link>
        <Link href="/billings">
          <Card>
            <CardHeader>
              <CardTitle>Billing</CardTitle>
            </CardHeader>
            <CardContent>
              View and pay your medical bills
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
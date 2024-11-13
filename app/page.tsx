import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Welcome to Our Hospital Management System</h1>
      <p className="text-xl text-center mb-12">
        Providing efficient and reliable healthcare management solutions.
      </p>
      <div className="flex justify-center space-x-4">
        <Link href="/login">
          <Button size="lg">Login</Button>
        </Link>
        <Link href="/dashboard">
          <Button size="lg" variant="outline">View Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}
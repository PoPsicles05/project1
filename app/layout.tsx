import './globals.css'
import { Inter } from 'next/font/google'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ToastProvider } from "@/components/ui/toast"

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Hospital Management System',
  description: 'A comprehensive hospital management system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </ToastProvider>
      </body>
    </html>
  )
}

export default function Footer() {
  return (
    <footer className="bg-gray-100">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <p className="text-gray-600">
            © {new Date().getFullYear()} Hospital Management System. All rights reserved.
          </p>
          <div className="space-x-4">
            <a href="#" className="text-gray-600 hover:text-gray-800">Privacy Policy</a>
            <a href="#" className="text-gray-600 hover:text-gray-800">Terms of Service</a>
            <a href="#" className="text-gray-600 hover:text-gray-800">Contact Us</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
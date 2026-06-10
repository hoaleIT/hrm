'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
          <div className="mb-4">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Account Created!
          </h1>
          <p className="text-gray-600 mb-6">
            Please check your email to confirm your account. Click the link in the email to activate your account.
          </p>

          <Link href="/auth/login">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2">
              Back to Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

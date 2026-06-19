'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Mail, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [emailError, setEmailError] = useState('')
  const supabase = createClient()

  const validateEmail = () => {
    setEmailError('')
    if (!email) {
      setEmailError('Email bắt buộc')
      return false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Định dạng email không hợp lệ')
      return false
    }
    return true
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!validateEmail()) return

    setLoading(true)

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (resetError) {
        setError(resetError.message)
        return
      }

      setSuccess('Email đặt lại mật khẩu đã được gửi! Vui lòng kiểm tra hộp thư đến của bạn.')
      setEmail('')
    } catch (err) {
      setError('Đã xảy ra lỗi. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 via-blue-50 to-sky-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg mb-4">
            <Mail className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Đặt Lại Mật Khẩu</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-800 border border-blue-100 dark:border-slate-700 rounded-xl p-8 space-y-6 shadow-xl">
          {/* Error Alert */}
          {error && (
            <div className="flex items-start gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="flex items-start gap-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
            </div>
          )}

          <form onSubmit={handleForgotPassword} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Địa Chỉ Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setEmailError('')
                  }}
                  placeholder="admin@company.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
              {emailError && <p className="text-xs text-red-600 dark:text-red-400 mt-1.5">{emailError}</p>}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 dark:from-cyan-600 dark:to-blue-700 text-white font-semibold py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg"
            >
              {loading ? 'Đang gửi...' : 'Gửi Email Đặt Lại Mật Khẩu'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300 dark:border-slate-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400">Nhớ mật khẩu của bạn?</span>
            </div>
          </div>

          {/* Back to Login */}
          <Link href="/auth/login">
            <Button
              type="button"
              variant="outline"
              className="w-full border-2 border-blue-200 dark:border-slate-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 font-medium flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại Đăng nhập
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

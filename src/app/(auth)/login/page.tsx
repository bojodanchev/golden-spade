"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Spade, ArrowRight, Shield, Users, TrendingUp, Globe } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState<string | null>(null)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError("Invalid email or password")
      setLoading(false)
      return
    }

    router.push("/dashboard")
    router.refresh()
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Panel — Brand Storytelling */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">
        {/* Deep blue gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f2240] via-[#1a365d] to-[#1e3a5f]" />

        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d69e2e' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Gold accent line at top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#d69e2e] to-transparent" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between w-full p-12 xl:p-16">
          {/* Top — Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#d69e2e] shadow-lg shadow-[#d69e2e]/20">
              <Spade className="h-6 w-6 text-[#0f2240]" />
            </div>
            <div>
              <span className="font-heading text-xl font-bold text-white tracking-tight">
                Golden Spades
              </span>
              <span className="block text-[11px] font-medium text-[#d69e2e] tracking-[0.2em] uppercase">
                CRM & Event Management
              </span>
            </div>
          </div>

          {/* Center — Hero messaging */}
          <div className="max-w-lg">
            <p className="text-sm font-semibold text-[#d69e2e] mb-4 tracking-wide uppercase">
              Bulgaria&apos;s Gaming Industry Platform
            </p>
            <h1 className="text-4xl xl:text-5xl font-heading font-extrabold text-white leading-[1.1] tracking-tight">
              Manage Your
              <br />
              Industry
              <span className="text-[#d69e2e]"> Relationships</span>
              <br />
              With Precision
            </h1>
            <p className="mt-6 text-base text-blue-200/80 leading-relaxed max-w-md">
              The all-in-one CRM powering СОХИДБ&apos;s network of 100+ gaming companies,
              Golden Spades magazine, and the annual Нови хоризонти gala.
            </p>

            {/* Stats row */}
            <div className="mt-10 grid grid-cols-3 gap-6">
              <div className="border-l-2 border-[#d69e2e]/40 pl-4">
                <p className="text-3xl font-heading font-bold text-white">100+</p>
                <p className="text-xs text-blue-200/60 mt-1 font-medium">Member Companies</p>
              </div>
              <div className="border-l-2 border-[#d69e2e]/40 pl-4">
                <p className="text-3xl font-heading font-bold text-white">43</p>
                <p className="text-xs text-blue-200/60 mt-1 font-medium">Active Contacts</p>
              </div>
              <div className="border-l-2 border-[#d69e2e]/40 pl-4">
                <p className="text-3xl font-heading font-bold text-white">&euro;171K</p>
                <p className="text-xs text-blue-200/60 mt-1 font-medium">Pipeline Value</p>
              </div>
            </div>
          </div>

          {/* Bottom — Trust signals */}
          <div>
            <div className="flex items-center gap-6 mb-6">
              {[
                { icon: Shield, label: "Enterprise Security" },
                { icon: Globe, label: "Multi-Region CRM" },
                { icon: Users, label: "Team Collaboration" },
                { icon: TrendingUp, label: "Deal Pipeline" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-white/[0.06] flex items-center justify-center">
                    <item.icon className="w-3.5 h-3.5 text-[#d69e2e]" />
                  </div>
                  <span className="text-[11px] font-medium text-blue-200/50">{item.label}</span>
                </div>
              ))}
            </div>
            <div className="h-px bg-gradient-to-r from-white/10 via-white/5 to-transparent" />
            <p className="mt-4 text-[11px] text-blue-200/30">
              Powered by СОХИДБ &mdash; Association of Gaming Industry in Bulgaria
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#d69e2e]/[0.03] blur-3xl" />
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[#d69e2e]/[0.04] blur-2xl" />
        <div className="absolute bottom-20 right-12 w-px h-32 bg-gradient-to-b from-transparent via-[#d69e2e]/20 to-transparent" />
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex w-full lg:w-[45%] items-center justify-center bg-[#f8f9fc] px-6">
        <div className="w-full max-w-[420px]">
          {/* Mobile logo (hidden on desktop) */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1a365d]">
              <Spade className="h-6 w-6 text-[#d69e2e]" />
            </div>
            <span className="font-heading text-2xl font-bold text-[#1a365d]">Golden Spades</span>
          </div>

          {/* Form header */}
          <div className="mb-8">
            <h2 className="text-2xl font-heading font-bold text-[#1a1a2e] tracking-tight">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Sign in to access your CRM dashboard
            </p>
          </div>

          {/* Login form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className={`block text-xs font-semibold mb-2 tracking-wide uppercase transition-colors duration-200 ${
                  focused === "email" ? "text-[#1a365d]" : "text-gray-400"
                }`}
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="admin@goldenspades.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused(null)}
                required
                autoComplete="email"
                className="w-full h-12 px-4 text-sm text-[#1a1a2e] bg-white border-2 border-gray-200 rounded-xl outline-none transition-all duration-200 placeholder:text-gray-300 focus:border-[#1a365d] focus:ring-4 focus:ring-[#1a365d]/5"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className={`block text-xs font-semibold tracking-wide uppercase transition-colors duration-200 ${
                    focused === "password" ? "text-[#1a365d]" : "text-gray-400"
                  }`}
                >
                  Password
                </label>
                <button type="button" className="text-xs font-medium text-[#d69e2e] hover:text-[#b7791f] transition-colors">
                  Forgot?
                </button>
              </div>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused(null)}
                required
                autoComplete="current-password"
                className="w-full h-12 px-4 text-sm text-[#1a1a2e] bg-white border-2 border-gray-200 rounded-xl outline-none transition-all duration-200 placeholder:text-gray-300 focus:border-[#1a365d] focus:ring-4 focus:ring-[#1a365d]/5"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl">
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group w-full h-12 flex items-center justify-center gap-2 text-sm font-semibold text-white bg-[#1a365d] rounded-xl hover:bg-[#0f2240] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-[#1a365d]/20 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-8 p-4 bg-white rounded-xl border border-gray-200">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#d69e2e]/10 flex items-center justify-center shrink-0 mt-0.5">
                <Spade className="w-4 h-4 text-[#d69e2e]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#1a1a2e]">Demo Access</p>
                <p className="text-xs text-gray-400 mt-1 font-mono">
                  admin@goldenspades.com
                </p>
                <p className="text-xs text-gray-400 font-mono">
                  admin123
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-[11px] text-gray-300">
            &copy; 2026 Golden Spades &mdash; СОХИДБ. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}

'use client'
import axios from "axios";
import { CircleDashed, Lock, Mail, User, X } from "lucide-react";
import { set } from "mongoose";
import { AnimatePresence, motion } from "motion/react"
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

type AuthModelProps = {
  isOpen: boolean;
  onClose: () => void;
}

type AuthStep = 'login' | 'register' | 'otp'

const AuthModel = ({ isOpen, onClose }: AuthModelProps) => {
  const [step, setStep] = useState<AuthStep>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [otp, setOtp] = useState(["", "", "", "", "", ""])

  const { data } = useSession()
  console.log(data)

  const handleSignUp = async () => {
    setLoading(true)
    try {
      const { data } = await axios.post('/api/auth/register', {
        name, email, password
      })
      setError('')
      setStep('otp')
      setLoading(false)
    } catch (error: any) {
      setError(error.response.data.message ?? "Something went wrong")
      setLoading(false)
    }
  }

  const handleVerifyEmail = async () => {
    setLoading(true)
    try {
      const { data } = await axios.post('/api/auth/verify-email', {
        email, otp: otp.join('')
      })
      console.log(data)
      setOtp(["", "", "", "", "", ""])
      setError('')
      setStep('login')
      setLoading(false)
    } catch (error: any) {
      setError(error.response.data.message ?? "Something went wrong")
      setLoading(false)
    }
  }

  const handleLogin = async () => {
    setLoading(true)
    const res = await signIn('credentials', {
      email, password, redirect: false
    })
    setLoading(false)
    console.log(res)
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    await signIn('google')
    setLoading(false)
    console.log('Google Login')
  }

  const handleOtpChange = (index: number, value: string) => {
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < otp.length - 1) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }

      if (!value && index > 0) {
        const nextInput = document.getElementById(`otp-${index - 1}`);
        nextInput?.focus();
      }
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-md z-90">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 40 }} transition={{ duration: 0.35, ease: "easeOut" }} className="fixed inset-0 flex items-center justify-center px-4 z-100">
              <div className="relative w-full max-w-md rounded-3xl bg-white border border-black/10 shadow-[0_40px_100px_rgba(0,0,0,0.35)] p-6 sm:p-8 text-black">
                <div className="absolute right-4 top-4 text-gray-500 hover:text-black transition" onClick={onClose}>
                  <X size={20} />
                </div>
                <div className="mb-6 text-center">
                  <h1 className="text-3xl font-extrabold tracking-widest">RYDEX</h1>
                  <p className="mt-1 text-xs text-gray-500">Premium Vehicle Booking</p>
                </div>
                <button className="w-full h-11 py-3 px-4 hover:text-white font-semibold rounded-xl hover:bg-gray-900 transition border border-black/20 flex items-center justify-center gap-3 text-sm" onClick={handleGoogleSignIn}>
                  <Image src={"/google.png"} alt="Google Icon" width={30} height={30}/>
                  Continue with Google
                </button>

                <div className="flex items-center gap-4 my-6">
                  <div className="flex-1 h-px bg-black/10" />
                  <div className="text-xs text-gray-500">OR</div>
                  <div className="flex-1 h-px bg-black/10" />
                </div>
                <div>
                  {step === 'login' && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <h1 className="text-xl font-semibold">Welcome back</h1>
                      <div className="mt-5 space-y-4">
                        <div className="flex items-center gap-3 border border-black/20 rounded-xl px-4 py-3">
                          <Mail size={18} className="text-gray-500" />
                          <input type="email" placeholder="Email" className="w-full bg-transparent outline-none text-sm" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="flex items-center gap-3 border border-black/20 rounded-xl px-4 py-3">
                          <Lock size={18} className="text-gray-500" />
                          <input type="password" placeholder="Password" className="w-full bg-transparent outline-none text-sm" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        {error && <div className="text-red-500 text-sm">*{error}</div>}
                        <button className="w-full h-11 py-3 px-4 bg-black text-white font-semibold rounded-xl hover:bg-gray-900 transition flex items-center justify-center" disabled={loading} onClick={handleLogin}>
                          {loading ? <CircleDashed size={18} color="white" className="animate-spin" /> : 'Login'}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-4">
                        Don't have an account?{" "}
                        <button className="text-black font-semibold hover:underline" onClick={() => setStep('register')}>
                          Sign Up
                        </button>
                      </p>
                    </motion.div>
                  )}
                  {step === 'register' && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <h1 className="text-xl font-semibold">Create an account</h1>
                      <div className="mt-5 space-y-4">

                        <div className="flex items-center gap-3 border border-black/20 rounded-xl px-4 py-3">
                          <User size={18} className="text-gray-500" />
                          <input type="text" placeholder="Name" className="w-full bg-transparent outline-none text-sm" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="flex items-center gap-3 border border-black/20 rounded-xl px-4 py-3">
                          <Mail size={18} className="text-gray-500" />
                          <input type="email" placeholder="Email" className="w-full bg-transparent outline-none text-sm" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="flex items-center gap-3 border border-black/20 rounded-xl px-4 py-3">
                          <Lock size={18} className="text-gray-500" />
                          <input type="password" placeholder="Password" className="w-full bg-transparent outline-none text-sm" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        {error && <div className="text-red-500 text-sm">*{error}</div>}
                        <button className="w-full h-11 py-3 px-4 bg-black text-white font-semibold rounded-xl hover:bg-gray-900 transition flex items-center justify-center" disabled={loading} onClick={handleSignUp}>
                          {loading ? <CircleDashed size={18} color="white" className="animate-spin" /> : 'Send OTP'}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-4">
                        Already have an account?{" "}
                        <button className="text-black font-semibold hover:underline" onClick={() => setStep('login')}>
                          Sign In
                        </button>
                      </p>
                    </motion.div>
                  )}
                  {step === 'otp' && (
                    <motion.div key="otp"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h2 className="font-semibold text-xl">Verify Your Email</h2>
                      <div className="mt-6 flex justify-between gap-2">
                        {otp.map((digit, index) => (
                          <input
                            key={index}
                            type="text"
                            id={`otp-${index}`}
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            className="w-12 h-12 border border-black/20 rounded-xl text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ))}

                      </div>
                      <button className="mt-4 w-full h-11 py-3 px-4 bg-black text-white font-semibold rounded-xl hover:bg-gray-900 transition flex items-center justify-center" disabled={loading} onClick={handleVerifyEmail}>
                        {loading ? <CircleDashed size={18} color="white" className="animate-spin" /> : 'Verify OTP'}
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default AuthModel
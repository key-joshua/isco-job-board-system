"use client"

import Link from "next/link"
import Image from "next/image"
import React, { useState } from "react"
import { useParams } from "next/navigation"

import { Eye, EyeOff } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ButtonLoader } from "@/components/Loader"
import MessageAlert from "@/components/messageAlert"
import { Card, CardContent } from "@/components/ui/card"
import { resetPasswordValidation } from "@/libs/utils/utils"
import { APIsRequest } from "@/libs/requestAPIs/requestAPIs"

export default function ResetPassword() {
  const { session } = useParams()
  const [showPassword, setShowPassword] = useState(false)
  const [buttonLoading, setButtonLoading] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({ password: "",  confirmPassword: "" })
  const [alertDetails, setAlertDetails] = useState<{ status: '' | 'error' | 'success'; message: string; id: any }>({ status: '', message: '', id: 0 })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value, }))
  }
 
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setButtonLoading(true)
    setAlertDetails({ status: '', message: '', id: 0 })
    const validation = resetPasswordValidation(formData)

    if (validation.error) {
      setAlertDetails({ status: 'error', message: validation.message || 'An error occurred', id: Date.now() });
      setButtonLoading(false)
      return
    }
    
    try {
      const response = await APIsRequest.resetPasswordRequest(session, formData);
      const data = await response.json();

      if (!response.ok) {
        setAlertDetails({ status: 'error', message: data.error || 'An error occurred', id: Date.now() });
        setButtonLoading(false)
        return;
      }

      setButtonLoading(false)
      setFormData({ password: "",  confirmPassword: "" })
      setTimeout(() =>  window.location.href = `/login`, 3000);
      localStorage.setItem('user_session', JSON.stringify(data?.data?.session));
      setAlertDetails({ status: 'success', message: data.message || 'Success', id: Date.now() });
    } catch (error: any) {
        setAlertDetails({ status: 'error', message: error?.message || error?.error || 'An error occurred', id: Date.now() });
        setButtonLoading(false)
        return;
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-white-semi-active" >
      <Image src="/login-background.svg" alt="" width={1} height={1} priority className="hidden" />
      <div style={{ backgroundImage: "url('/login-background.svg')" }} className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat" />

      <div className="w-full max-w-4xl m-6">
          <Card className="shadow-2xl rounded-xl border border-borderSubtle bg-white-semi-active">
            <CardContent className="relative p-8 rounded-xl bg-white-semi-active transform origin-top scale-[0.85] md:scale-[0.85] lg:scale-[0.85]" style={{ boxShadow: "-10px -10px 15px rgba(255, 255, 255, 0.693), 10px 10px 30px rgba(0, 0, 0, 0.338)" }} >

              <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-20">
                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <div className="relative w-8 h-8 flex items-center justify-center">
                      <Link href="/"> <Image src="/logo.svg" alt="Logo" fill className="object-contain" priority /> </Link>
                    </div>
                    <Link href="/"> <h1 className="text-2xl font-bold text-primary-active [@media(max-width:550px)]:text-sm"> ISCO Job Board System </h1> </Link>
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 min-h-[600px] relative pt-6">

              <div className="absolute left-1/2 top-[55%] w-1 h-[80%] -translate-x-1/2 -translate-y-1/2 bg-primary-micro-active hidden lg:block" />

              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-[260px]">
                  <div className="relative aspect-square">
                    <Image src="/login-form-background.svg" alt="ISCO Job Board System Illustration" fill className="object-contain" priority />
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center">
                <div className="w-full max-w-xs mx-auto">
                  <div className="mb-4 text-center">
                    <h2 className="text-2xl font-bold text-primary-active [@media(max-width:550px)]:text-sm"> Reset Password </h2>
                    <p className="mt-2 text-gray-600 text-sm max-w-md mx-auto"> Enter your new password below, then re-type it to confirm. This helps ensure your password is accurate and secure. </p>
                  </div>

                  <form className="space-y-5">
                    <div className="space-y-2">
                      <MessageAlert status={alertDetails.status} message={alertDetails.message} id={alertDetails.id} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="sr-only">Password</Label>
                      <div className="relative">
                        <input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="Password" value={formData.password} onChange={handleInputChange} required className="w-full h-12 px-4 rounded-md bg-transparent text-primary-semi-active placeholder:text-primary-semi-active border border-primary-semi-active focus:outline-none focus:border-primary-semi-active focus:ring-1 focus:ring-primary-semi-active/40 transition-all duration-300" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-semi-active hover:text-primary-mini-active transition-colors" aria-label={showPassword ? "Hide password" : "Show password"} > {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />} </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="sr-only">Re-enter Password</Label>
                      <div className="relative">
                        <input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="Re-enter Password" value={formData.confirmPassword} onChange={handleInputChange} required className="w-full h-12 px-4 rounded-md bg-transparent text-primary-semi-active placeholder:text-primary-semi-active border border-primary-semi-active focus:outline-none focus:border-primary-semi-active focus:ring-1 focus:ring-primary-semi-active/40 transition-all duration-300" />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-semi-active hover:text-primary-mini-active transition-colors" aria-label={showConfirmPassword ? "Hide password" : "Show password"} > {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />} </button>
                      </div>
                    </div>

                    <div className="space-y-4 pt-2">
                      <Button onClick={(event) => handleSubmit(event)} type="submit" className="w-full h-12 font-semibold rounded-lg text-white-active bg-secondary-active hover:text-white-active hover:bg-secondary-semi-active transition-colors" >
                        { buttonLoading ? <ButtonLoader /> : "Reset Password" }
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center text-xs text-primary-semi-active">
        <p className="mb-1">Release Notes</p>
        <p className="mb-1">version 20.22.11</p>
        <p>Copyright © 2023–24 HRM and services</p>
      </div>
    </div>
  )
}

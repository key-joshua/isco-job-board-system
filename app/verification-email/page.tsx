"use client"

import Link from "next/link"
import Image from "next/image"
import React, { useState } from "react"
import { usePathname } from "next/navigation"

import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ButtonLoader } from "@/components/Loader"
import MessageAlert from "@/components/messageAlert"
import { Card, CardContent } from "@/components/ui/card"
import { APIsRequest } from "@/libs/requestAPIs/requestAPIs"
import { decrypt, EmailValidation, generateDeviceId } from "@/libs/utils/utils"


export default function VerificationEmail() {
  const pathname = usePathname()
  const [formData, setFormData] = useState({ email: "" })
  const [buttonLoading, setButtonLoading] = useState(false)
  const [alertDetails, setAlertDetails] = useState<{ status: '' | 'error' | 'success'; message: string; id: any }>({ status: '', message: '', id: 0 })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value, }))
  }
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setButtonLoading(true)
    const validation = EmailValidation(formData)
    setAlertDetails({ status: '', message: '', id: 0 })
    const userDevice = localStorage.getItem('user_device');
    const decryptUserDevice = userDevice ? decrypt(userDevice) : generateDeviceId();

    if (validation.error) {
      setAlertDetails({ status: 'error', message: validation.message || 'An error occurred', id: Date.now() });
      setButtonLoading(false)
      return
    }
    
    try {
      const response = await APIsRequest.sendVerificationLinkRequest(decryptUserDevice, 'resetPassword', formData);
      const data = await response.json();

      if (!response.ok) {
        setAlertDetails({ status: 'error', message: data.error || 'An error occurred', id: Date.now() });
        setButtonLoading(false)
        return;
      }

      setButtonLoading(false)
      setFormData({ email: '' })
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
                <div className="flex items-center justify-center gap-6 mt-8 mb-6">
                  <div className="relative">
                    <Link href="/login"> <span className={`pb-1 transition-all duration-300 transform ${ pathname === "/login" ? "text-3xl font-semibold text-primary-semi-active" : "text-lg font-medium text-primary-mini-active hover:text-primary-semi-active transition-colors" }`} > Login </span> </Link>
                    {pathname === "/login" && ( <div className="absolute bottom-0 left-0 right-0 h-1 w-[50%] bg-[#FACC15]" /> )}
                  </div>
                  
                  <div className="h-6 w-[2px] bg-primary-micro-active" />

                  <div className="relative">
                    <Link href="/signup"> <span className={`pb-1 transition-all duration-300 transform ${ pathname === "/signup" ? "text-3xl font-semibold text-primary-semi-active" : "text-lg font-medium text-primary-mini-active hover:text-primary-semi-active transition-colors" }`} > Sign Up </span> </Link>
                    {pathname === "/signup" && ( <div className="absolute bottom-0 left-0 right-0 h-1 w-[70%] bg-[#FACC15]" /> )}
                  </div>
                </div>

                <div className="mb-4 text-center">
                    <h2 className="text-2xl font-bold text-primary-active [@media(max-width:550px)]:text-sm"> Reset Password Email </h2>
                    <p className="mt-2 text-gray-600 text-sm max-w-md mx-auto"> Enter your registration email address below. We&#39;ll send you the instructions to reset your password and regain access to your account. </p>
                </div>

                <form className="space-y-5">
                  <div className="space-y-2">
                    <MessageAlert status={alertDetails.status} message={alertDetails.message} id={alertDetails.id} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="sr-only">Email</Label>
                    <input id="email" name="email" type="email" placeholder="Email" value={formData.email} onChange={handleInputChange} required className="w-full h-12 px-4 rounded-md bg-transparent text-primary-semi-active placeholder:text-primary-semi-active border border-primary-semi-active focus:outline-none focus:border-primary-semi-active focus:ring-1 focus:ring-primary-semi-active/40 transition-all duration-300" />
                  </div>

                  <div className="space-y-4 pt-2">
                    <Button disabled={buttonLoading} onClick={(event) => handleSubmit(event)} type="submit" className="w-full h-12 font-semibold rounded-lg text-white-active bg-secondary-active hover:text-white-active hover:bg-secondary-semi-active transition-colors" >
                      { buttonLoading ? <ButtonLoader /> : "Send Verification Mail" }
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          </CardContent>
        </Card>
      </div>

      <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center text-xs text-primary-semi-active'>
        <p className='mb-1'>Copyright © 2025 </p>
        <p>ISCO JOB BOARD SYSTEM</p>
      </div>
    </div>
  )
}

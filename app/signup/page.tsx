"use client"

import Link from "next/link"
import Image from "next/image"
import React, { useState } from "react"
import { usePathname } from "next/navigation"
import { useGoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

import { Eye, EyeOff } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ButtonLoader } from "@/components/Loader"
import AvatarUpload from "@/components/AvatarUpload"
import MessageAlert from "@/components/messageAlert"
import { Card, CardContent } from "@/components/ui/card"
import { APIsRequest } from "@/libs/requestAPIs/requestAPIs"
import { decrypt, encrypt, generateDeviceId, signupValidation } from "@/libs/utils/utils"

const Signup = () => {
  const pathname = usePathname()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [normalButtonIsLoading, setNormalButtonIsLoading] = useState(false)
  const [googleButtonIsLoading, setGoogleButtonIsLoading] = useState(false)
  const [alertDetails, setAlertDetails] = useState<{ status: '' | 'error' | 'success'; message: string; id: any }>({ status: '', message: '', id: 0 })
  const [formData, setFormData] = useState<{ file: File | null; firstname: string; lastname: string; email: string; password: string; confirmPassword: string; }>({ file: null, firstname: "", lastname: "", email: "", password: "",  confirmPassword: "" })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value, }))
  }

  const handleFileSelect = (file: File) => {
    setFormData(prev => ({ ...prev, file }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setNormalButtonIsLoading(true)
    const validation = signupValidation(formData)
    setAlertDetails({ status: '', message: '', id: 0 })
    const userDevice = localStorage.getItem('user_device');
    const decryptUserDevice = userDevice ? decrypt(userDevice) : generateDeviceId();

    if (validation.error) {
      setAlertDetails({ status: 'error', message: validation.message || 'An error occurred', id: Date.now() });
      setNormalButtonIsLoading(false)
      return
    }
    
    try {
      const response = await APIsRequest.signupRequest(decryptUserDevice, {...formData, username: `${formData?.firstname} ${formData?.lastname}`, is_google: false });
      const data = await response.json();

      if (!response.ok) {
        setAlertDetails({ status: 'error', message: data.error || 'An error occurred', id: Date.now() });
        setNormalButtonIsLoading(false)
        
        return;
      }

      setFormData({ file: null, firstname: "", lastname: "", email: "", password: "", confirmPassword: "" });
      setAlertDetails({ status: 'success', message: data.message || 'Success', id: Date.now() });
      setNormalButtonIsLoading(false)
      
    } catch (error: any) {
        setAlertDetails({ status: 'error', message: error?.message || error?.error || 'An error occurred', id: Date.now() });
        setNormalButtonIsLoading(false)
        return;
    }
  }

  const googleSignup = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        setGoogleButtonIsLoading(true)
        setAlertDetails({ status: '', message: '', id: 0 })
        const userDevice = localStorage.getItem('user_device');
        const decryptUserDevice = userDevice ? decrypt(userDevice) : generateDeviceId();
        const googleResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', { method: 'GET', headers: { Authorization: `Bearer ${response.access_token}` } });
        
        if (!googleResponse.ok) {
            const errorText = await googleResponse.text();
          
            setAlertDetails({ status: 'error', message: `Error: ${errorText}` || 'An error occurred', id: Date.now() });
            
            setGoogleButtonIsLoading(false)
            return;
        }

        const googleData = await googleResponse.json();
        const googleDataBody = { email: googleData?.email, lastname: googleData?.given_name, firstname: googleData?.family_name, is_google: true };

        try {
          const response = await APIsRequest.signupRequest(decryptUserDevice, googleDataBody);
          const data = await response.json();
    
          if (!response.ok) {
            setAlertDetails({ status: 'error', message: data.error || 'An error occurred', id: Date.now() });
            
            setGoogleButtonIsLoading(false)
            return;
          }

          setAlertDetails({ status: 'success', message: data.message || 'Success', id: Date.now() });
          localStorage.setItem('auth_session_data', encrypt(JSON.stringify(data?.data?.session)));
          if (data.data.user.role === 'ADMIN') window.location.href = `/dashboard`;
          if (data.data.user.role === 'APPLICANT') window.location.href = `/jobs`;
        } catch (error: any) {
          setAlertDetails({ status: 'error', message: error?.message || error?.error || 'An error occurred', id: Date.now() });
          setGoogleButtonIsLoading(false)
          return;
        }

      } catch (error: any) {
          setAlertDetails({ status: 'error', message: error?.message || error?.error || 'An error occurred', id: Date.now() });
          setGoogleButtonIsLoading(false)
          return;
      }
    },

    onError: (error: any) => {
      setAlertDetails({ status: 'error', message: error?.message || error?.error || 'An error occurred', id: Date.now() });
      
      setGoogleButtonIsLoading(false)
      return;
    },
  });

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-white-semi-active" >
      <Image src="/login-background.svg" alt="" width={1} height={1} priority className="hidden" />
      <div style={{ backgroundImage: "url('/login-background.svg')" }} className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat" />

      <div className="w-full max-w-4xl mt-6">
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

                <form className="space-y-5">
                  <div className="space-y-2">
                    <MessageAlert status={alertDetails.status} message={alertDetails.message} id={alertDetails.id} />
                  </div>
                  
                  <div className="space-y-2">
                    <AvatarUpload onFileSelect={handleFileSelect} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="firstname" className="sr-only">First Name</Label>
                    <input id="firstname" name="firstname" type="text" placeholder="First Name" value={formData.firstname} onChange={handleInputChange} required className="w-full h-12 px-4 rounded-md bg-transparent text-primary-semi-active placeholder:text-primary-semi-active border border-primary-semi-active focus:outline-none focus:border-primary-semi-active focus:ring-1 focus:ring-primary-semi-active/40 transition-all duration-300" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastname" className="sr-only">Last Name</Label>
                    <input id="lastname" name="lastname" type="text" placeholder="Last Name" value={formData.lastname} onChange={handleInputChange} required className="w-full h-12 px-4 rounded-md bg-transparent text-primary-semi-active placeholder:text-primary-semi-active border border-primary-semi-active focus:outline-none focus:border-primary-semi-active focus:ring-1 focus:ring-primary-semi-active/40 transition-all duration-300" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="sr-only">Email</Label>
                    <input id="email" name="email" type="email" placeholder="Email" value={formData.email} onChange={handleInputChange} required className="w-full h-12 px-4 rounded-md bg-transparent text-primary-semi-active placeholder:text-primary-semi-active border border-primary-semi-active focus:outline-none focus:border-primary-semi-active focus:ring-1 focus:ring-primary-semi-active/40 transition-all duration-300" />
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
                    <Button disabled={normalButtonIsLoading ? true : googleButtonIsLoading ? true : false} onClick={(event) => handleSubmit(event)} type="submit" className="w-full h-12 font-semibold rounded-lg text-white-active bg-secondary-active hover:text-white-active hover:bg-secondary-semi-active transition-colors" >
                      {normalButtonIsLoading ? <ButtonLoader /> : "Signup"}
                    </Button>

                    <Button disabled={googleButtonIsLoading ? true : normalButtonIsLoading ? true : false} onClick={() => { setGoogleButtonIsLoading(true); googleSignup() }} type="button" variant="outline" className="w-full h-12 border-primaryBlue font-semibold rounded-lg text-white-active bg-primary-semi-active hover:text-white-active hover:bg-primary-mini-active transition-colors" >
                      {googleButtonIsLoading ? <ButtonLoader /> : (<><svg className="w-5 h-5 mr-3" viewBox="0 0 24 24"> <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /> <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /> <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /> <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /> </svg> Signup with Google </>)}
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

const SignupPage = () => (
  <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID : ''}>
    <Signup />
  </GoogleOAuthProvider>
);

SignupPage.displayName = "Signup";

export default SignupPage;

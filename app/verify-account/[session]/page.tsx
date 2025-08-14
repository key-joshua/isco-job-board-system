"use client"

import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"
import React, { useEffect, useState } from "react";

import { ButtonLoader } from "@/components/Loader"
import MessageAlert from "@/components/messageAlert"
import { Card, CardContent } from "@/components/ui/card"
import { APIsRequest } from "@/libs/requestAPIs/requestAPIs";

export default function ResetPassword() {
  const { session } = useParams()
  const [buttonLoading, setButtonLoading] = useState(true)
  const [alertDetails, setAlertDetails] = useState<{ status: '' | 'error' | 'success'; message: string; id: any }>({ status: '', message: '', id: 0 })

  useEffect(() => {
    const verifyAccount = async () => {
      try {
        const response = await APIsRequest.verifyAccountRequest(session as string);
        const data = await response.json();
  
        if (!response.ok) {
          setAlertDetails({ status: 'error', message: data.error || 'An error occurred', id: Date.now() });
          setButtonLoading(false)
          return;
        }
  
        setButtonLoading(false)
        setTimeout(() =>  window.location.href = `/login`, 3000);
        setAlertDetails({ status: 'success', message: data.message || 'Success', id: Date.now() });
      } catch (error: any) {
          setAlertDetails({ status: 'error', message: error?.message || error?.error || 'An error occurred', id: Date.now() });
          setButtonLoading(false)
          return;
      }
    }

    verifyAccount();
  }, [session]);

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-white-semi-active" >
        <Image src="/login-background.svg" alt="" width={1} height={1} priority className="hidden" />
        <div style={{ backgroundImage: "url('/login-background.svg')" }} className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat" />

        <div className="w-full max-w-3xl m-6">
            <Card className="shadow-2xl rounded-xl border border-borderSubtle bg-white-semi-active">
                <CardContent className="relative pt-10 pb-5 rounded-xl bg-white-semi-active" style={{ boxShadow: "-10px -10px 15px rgba(255, 255, 255, 0.693), 10px 10px 30px rgba(0, 0, 0, 0.338)", }} >
              
                    <div className="flex flex-col items-center text-center mb-8">
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <div className="relative w-8 h-8 flex items-center justify-center"> <Link href="/"> <Image src="/logo.svg" alt="Logo" fill className="object-contain" priority /> </Link> </div>
                            <Link href="/"> <h1 className="text-2xl font-bold text-primary-active [@media(max-width:550px)]:text-sm"> ISCO Job Board System </h1> </Link>
                        </div>
                    </div>

                     <div className="w-full flex justify-center mb-4">
                        { buttonLoading
                            ? <ButtonLoader color="#4B93E7" />
                            : <div className="space-y-2"> <MessageAlert status={alertDetails.status} message={alertDetails.message} id={alertDetails.id} /> </div>
                        }
                        
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

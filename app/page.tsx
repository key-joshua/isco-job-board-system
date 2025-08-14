import Link from "next/link"
import Image from "next/image"

export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-white-semi-active">
      <Image src="/landing-background.svg" alt="" width={1} height={1} priority className="hidden" />
      <div className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/landing-background.svg')", }} />

      <div className="z-20 relative flex justify-center gap-12 pt-12">
        <Link href="/login" className="px-5 py-2 text-lg border rounded-lg font-medium text-primary-semi-active hover:text-white-active hover:bg-primary-semi-active transition-all duration-300 border-primary-micro-active" > Login </Link>
        <Link href="/signup" className="px-5 py-2 text-lg border rounded-lg font-medium text-primary-semi-active hover:text-white-active hover:bg-primary-semi-active transition-all duration-300 border-primary-micro-active" > Sign Up </Link>
      </div>

      <div className='z-10 absolute inset-0 flex flex-col justify-center px-8 md:px-16 lg:px-24 bg-transparent'>
          <div className='space-y-5'>
            <h1 className='text-4xl md:text-6xl lg:text-7xl font-bold text-primary-semi-active relative block'>
              Find Your Dream Job Online
              <div className='absolute -bottom-2 left-0 w-[22%] h-1 bg-secondary-mini-active rounded-full'/>
            </h1>

            <h2 className='text-3xl md:text-5xl lg:text-6xl font-bold text-secondary-active relative block'>
              ISCO Job Board
              <div className='absolute -bottom-2 left-0 w-[12%] h-1 bg-primary-mini-active rounded-full'/>
            </h2>
          </div>
        </div>

        <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center text-xs text-primary-semi-active'>
          <p className='mb-1'>Copyright © 2025 </p>
          <p>ISCO JOB BOARD SYSTEM</p>
        </div>
    </div>
  )
}

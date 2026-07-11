import SignupForm from '@/components/forms/SignupForm'
import GoogleButton from '@/components/ui/GoogleButton'
import React from 'react'

export default function Signup() {
  return (
    <div className="flex flex-col justify-start items-center gap-5">

      <h1 className="relative text-6xl fancyFont opacity-90 tracking-widest text-shadow-sm text-shadow-stone-500 underline mt-5">
        GyaRchi <span className="absolute text-sm opacity-80 w-full tracking-normal italic fancyFont -bottom-1/3 left-0">where Creativity meets Opportunity</span>
      </h1>

      <p className="text-xl mt-5">Create your artist account</p>

      <SignupForm />

      <p className="text-sm">or continue with</p>

      <GoogleButton />

      <p className="max-w-7/10 text-sm">Already registered? <a href="/signin" className="italic underline">Click here</a> to sign into your Artist account.</p>

      <div className="">
        <p className="text-center text-lg border-b font-bold tracking-widest">GyaRchi</p>
        <a href="/" className="text-sm mx-2">Home</a>
        <a href="/" className="text-sm mx-2">About</a>
      </div>

    </div>
  )
}

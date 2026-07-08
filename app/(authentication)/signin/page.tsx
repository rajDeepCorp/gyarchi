// app/(authentication)/signin/page.tsx

import SigninForm from '@/components/forms/SigninForm'
import Link from 'next/link'

export default function Signin() {  

  return (
    <div className="relative w-svw sm:w-screen h-svh sm:h-screen p-2 z-0">

      <div className='relative w-full h-11/12 shadow-inner shadow-stone-500 rounded-4xl overflow-x-hidden p-2 flex flex-col justify-around items-center'>

        <div className='relative flex justify-center items-center w-full max-w-2xs my-7'>
          <h1 className='relative text-5xl sm:text-6xl text-shadow-sm tracking-widest text-shadow-stone-500 border-b'>TATTOOMI</h1>
          <p className='absolute bottom-0 right-0 text-sm translate-x-1/8 italic font-light text-shadow-sm text-shadow-stone-500 translate-y-full'>Where Creativity Meets Opportunity</p>
        </div>

        <div className='relative flex justify-center items-center'>
          <SigninForm />
        </div>

        <div className='relative w-1/2 max-w-fit text-center'>
          <h2 className='relative tracking-widest font-medium border-b'>Tattoomi</h2>
          <Link href="/" className='text-xs mx-2'>Home</Link>
          <Link href="/about" className='text-xs mx-2'>About</Link>
        </div>

      </div>

    </div>
  )
}
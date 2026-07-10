import SignoutButton from '@/components/ui/SignoutButton'
import Image from 'next/image'
import Link from 'next/link'
import { CiFacebook, CiHeart, CiInstagram, CiSaveDown2, CiShoppingCart } from 'react-icons/ci'
import { PiCakeThin } from 'react-icons/pi'
import { VscVerified } from 'react-icons/vsc'

export default function Profile() {
  const images = [1, 2, 3, 4, 5];
  return (
    <div className='relative w-full flex flex-col justify-start items-center overflow-hidden'>

      <div className='relative rounded-2xl flex flex-col justify-center items-center'>
        <div className='relative w-37.5 h-37.5 rounded-full shadow shadow-stone-500 overflow-hidden '>
          <Image src="/2.jpg" alt="" fill className="object-cover" sizes="150px" />
        </div>
        <p className='relative text-xl tracking-widest text-shadow-stone-500 text-shadow-xs opacity-90 fancyFont'>Peter Parker</p>
        <p className='relative max-w-fit text-center flex justify-start items-center text-md italic tracking-tighter leading-2 text-shadow-stone-500 text-shadow-xs'>
          @vishivish
          <span className="relative -translate-y-1/3">
            <VscVerified />
          </span>
        </p>
        <p className='relative text-xs w-full text-shadow-stone-500 text-shadow-xs flex justify-start items-center gap-1 mt-1'><PiCakeThin /> 17 Dec</p>
        <p className='relative text-sm w-full text-shadow-stone-500 text-shadow-xs'>Lorem, ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet.</p>
        <p className='relative text-sm w-full font-light opacity-90 italic text-shadow-stone-500 text-shadow-xs'>244, Subhash Nagar, Bareilly - 243001</p>
      </div>

      <div className='relative w-full max-w-2xl flex justify-around items-center mt-4'>
        <button className='relative text-xs translate-x-[-25%] rounded-l-2xl px-2 shadow py-1 shadow-stone-500 flex justify-center items-center'>
          Followers
          <span className='absolute right-0 px-1 translate-x-[105%] shadow py-1 shadow-stone-500 text-xs rounded-r-2xl'>
            999
          </span>
        </button>

        <button className='relative text-xs translate-x-[-25%] rounded-l-2xl px-2 shadow py-1 shadow-stone-500 flex justify-center items-center'>
          Following
          <span className='absolute right-0 px-1 translate-x-[105%] shadow py-1 shadow-stone-500 text-xs rounded-r-2xl'>
            999
          </span>
        </button>

        <button className='relative text-xs translate-x-[-25%] rounded-l-2xl px-2 shadow py-1 shadow-stone-500 flex justify-center items-center'>
          Clients
          <span className='absolute right-0 px-1 translate-x-[105%] shadow py-1 shadow-stone-500 text-xs rounded-r-2xl'>
            999
          </span>
        </button>
      </div>

      <div className='relative w-full flex flex-col justify-center items-center mt-4 gap-2'>
        <p className='relative w-full text-center text-lg underline text-shadow-xs text-shadow-stone-500 fancyFont italic py-0.5 shadow shadow-stone-500 rounded-t-2xl'>Links</p>
        <div className='w-full max-w-xs flex justify-start items-center gap-4 flex-wrap'>
          <Link href="/" className='relative text-2xl rounded-full shadow p-2 shadow-stone-500'>
            <CiInstagram />
          </Link>
          <Link href="/" className='relative text-2xl rounded-full shadow p-2 shadow-stone-500'>
            <CiFacebook />
          </Link>
        </div>
      </div>

      <div className='relative w-full flex flex-col justify-center items-center mt-4 gap-2'>
        <p className='relative w-full text-center text-lg underline text-shadow-xs text-shadow-stone-500 fancyFont italic py-0.5 shadow shadow-stone-500 rounded-t-2xl'>Artwork</p>
        <div className="relative columns-2 lg:columns-3 xl:columns-5 2xl:columns-7">
          {images.map((image) => (
            <Link
              key={image}
              href={`/art/${image}`}
            >
              <Image
                width={720}
                height={720}
                src={`/${image}.jpg`}
                alt={`Image ${image}`}
                className="rounded-xl mb-4 shadow shadow-stone-500 hover:opacity-90 transition"
              />
            </Link>
          ))}
        </div>
      </div>

      <div className="relative max-w-full min-w-xs shadow shadow-stone-500 px-4 py-2 m-1 rounded-4xl">
        <span className='relative list-none cursor-pointer font-bold text-center'>
          <SignoutButton />
        </span>
      </div>
    </div>
  )
}

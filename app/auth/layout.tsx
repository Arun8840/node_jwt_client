import type { ReactNode } from 'react';
import Link from 'next/link';

function KeyholeMark({ className = '' }: { className?: string }) {
 return (
  <span aria-hidden='true' className={`relative block ${className}`}>
   <span className='absolute left-1/2 top-[16%] aspect-square w-[32%] -translate-x-1/2 rounded-full bg-current' />
   <span className='absolute left-1/2 top-[39%] h-[44%] w-[15%] -translate-x-1/2 bg-current [clip-path:polygon(28%_0,72%_0,100%_100%,0_100%)]' />
  </span>
 );
}

export default function AuthLayout({ children }: { children: ReactNode }) {
 return (
  <main
   className='min-h-screen w-full grid lg:grid-cols-2'
   style={{ fontFamily: 'var(--font-geist-sans)' }}
  >

   <aside className='relative z-0 hidden min-h-dvh overflow-hidden bg-primary px-12 py-14 text-white lg:flex lg:flex-col xl:px-16 xl:py-16'>
    <div className='relative z-10 max-w-md'>
     <p className='text-balance text-[clamp(2.75rem,4.2vw,4.5rem)] font-semibold leading-[0.98] tracking-[-0.055em]'>
      One account. One secure doorway.
     </p>
     <p className='mt-7 max-w-sm text-base leading-7 text-white/75'>
      Sign in or create an account to continue.
     </p>
    </div>

    <div
     aria-hidden='true'
     className='absolute -bottom-[8rem] -left-[10rem] size-[34rem] rounded-full bg-[#cff65b] text-primary'
    >
     <KeyholeMark className='size-full' />
    </div>
   </aside>

   <section className=' flex flex-col'>
    <header className='w-full p-5'>
     <Link
      href='/'
      className='inline-flex items-center gap-3 rounded-lg text-[17px] font-semibold tracking-[-0.02em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary'
     >
      <span className='relative block size-9 overflow-hidden rounded-xl bg-primary p-2 text-white'>
       <KeyholeMark className='size-full' />
      </span>
      Authentication
     </Link>
    </header>

    <div className='flex flex-1 justify-center items-center py-10 sm:py-14'>
     <div className='w-full max-w-lg'>{children}</div>
    </div>
   </section>


  </main>
 );
}

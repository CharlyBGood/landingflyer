import React from 'react'

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4 fixed w-full flex justify-between px-6 items-center z-50">
      <a
        href="https://sinapsialab.com"
        target='_blank'
        title='SinapsiaLab Web'
      >
        <img src="https://res.cloudinary.com/dr8pwzxzn/image/upload/v1753991068/creativesinapsistesterReal_qbe1zr.png" alt="SinapsiaLab brain" className='w-15 h-auto' />
      </a>
      <a href="https://sinapsialab.com" target='_blank' title='SinapsiaLab web'>
        <img src="https://res.cloudinary.com/dr8pwzxzn/image/upload/v1751256447/SinapsiaLabThinn8_lehxp5.png" alt="SinapsiaLab svg" className='w-35 h-auto' />
      </a>
      <p className='gradient-link select-none'>Landing Flyer</p>
    </nav>
  )
}

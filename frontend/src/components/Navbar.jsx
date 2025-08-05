import React from 'react'

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4 fixed w-full flex justify-between items-center z-50">
      <p className=''>Landing Flyer</p>
      <span > | </span>
      <a
        href="https://sinapsialab.com"
        target='_blank'
        title='SinapsiaLab Web'>SinapsiaLab</a>
    </nav>
  )
}

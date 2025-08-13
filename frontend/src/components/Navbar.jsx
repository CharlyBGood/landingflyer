import React from 'react'
import './Navbar.css'

export default function Navbar() {
  return (
    <nav className="navbar">
      <a
        href="https://sinapsialab.com"
        target='_blank'
        title='SinapsiaLab Web'
        className="navbar-logo"
      >
        <img
          src="https://res.cloudinary.com/dr8pwzxzn/image/upload/v1753991068/creativesinapsistesterReal_qbe1zr.png"
          alt="SinapsiaLab brain"
          className="navbar-brain-icon"
        />
      </a>
      <a
        href="https://sinapsialab.com"
        target='_blank'
        title='SinapsiaLab web'
        className="navbar-brand"
      >
        <img
          src="https://res.cloudinary.com/dr8pwzxzn/image/upload/v1751256447/SinapsiaLabThinn8_lehxp5.png"
          alt="SinapsiaLab svg"
          className="navbar-brand-img"
        />
      </a>
      <p className="gradient-link navbar-title">Landing Flyer</p>
    </nav>
  )
}

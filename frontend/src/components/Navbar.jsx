import '../styles/Navbar.css'

export default function Navbar() {
  return (
    <nav className="navbar fixed top-0 left-0 right-0 w-full z-50 grid grid-cols-3 items-center p-3 sm:p-4 lg:p-6 min-h-14 sm:min-h-16 lg:min-h-18 text-sinapsia-light">
      <p className="gradient-link navbar-title justify-self-start">Landing Flyer</p>
      <a
        href="https://sinapsialab.com"
        target='_blank'
        title='SinapsiaLab web'
        className="flex items-center transition-transform duration-200 hover:scale-102 justify-self-center cursor-pointer"
      >
        <img
          src="https://res.cloudinary.com/dr8pwzxzn/image/upload/v1751256447/SinapsiaLabThinn8_lehxp5.png"
          alt="SinapsiaLab svg"
          className="navbar-brand-img"
        />
      </a>
      <a
        href="https://sinapsialab.com"
        target='_blank'
        title='SinapsiaLab Web'
        className="flex items-center transition-transform duration-200 hover:scale-105 justify-self-end"
      >
        <img
          src="https://res.cloudinary.com/dr8pwzxzn/image/upload/v1753991068/creativesinapsistesterReal_qbe1zr.png"
          alt="SinapsiaLab brain"
          className="navbar-brain-icon"
        />
      </a>
    </nav>
  )
}


export default function Navbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 w-full z-50 flex justify-between items-center p-3 sm:p-4 lg:p-6 min-h-[3.5rem] sm:min-h-[4rem] lg:min-h-[4.5rem] text-sinapsia-light bg-[linear-gradient(135deg,_#0c070f_0%,_#150a1a_50%,_#1a0f20_100%)] animate-[slideDown_0.3s_ease-out]"
    >
      <p
        className="gradient-link select-none m-0 justify-self-start text-[clamp(0.75rem,2.5vw,1.125rem)]"
      >
        Landing Flyer
      </p>
      <a
        href="https://sinapsialab.com"
        target="_blank"
        title="SinapsiaLab web"
        className="flex items-center transition-transform duration-200 hover:scale-105 justify-self-center cursor-pointer"
      >
        {/* <img
          src="https://res.cloudinary.com/dr8pwzxzn/image/upload/v1751256447/SinapsiaLabThinn8_lehxp5.png"
          alt="SinapsiaLab svg"
          className="w-[25vw] max-w-[7.5rem] min-w-[6rem] sm:w-[8.75rem] lg:w-[10rem] h-auto transition duration-200 hover:brightness-105"
        /> */}
        <p className="gradient-link">SinapsiaLab</p>
      </a>
    </nav>
  )
}

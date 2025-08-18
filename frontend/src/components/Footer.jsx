
export default function Footer() {
  return (
  <footer className="fixed flex justify-center gap-2 w-full bottom-0 items-center py-4 bg-gradient-to-r from-[#0c070f] via-[#150a1a] to-[#1a0f20] text-sinapsia-light">
      <p className="text-xs">
        © {new Date().getFullYear()} Creado con ❤️ por
      </p>
      <a
        href="https://www.sinapsialab.com"
        className="gradient-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        SinapsiaLab
      </a>
    </footer>
  )
}

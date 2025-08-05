
export default function Footer() {
  return (
    <footer className="fixed flex justify-center gap-2 w-full bottom-0 items-center bg-gray-800 text-white py-4">
      <p className="text-xs">
        © {new Date().getFullYear()} Creado con ❤️ por
      </p>
      <a
        href="https://www.charlybgood.com"
        className="gradient-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        SinapsiaLab
      </a>
    </footer>
  )
}

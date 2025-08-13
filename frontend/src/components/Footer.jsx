
export default function Footer() {
  return (
    <footer className="fixed flex justify-center gap-2 w-full bottom-0 items-center py-4" style={{ background: 'linear-gradient(135deg, #0c070f 0%, #150a1a 50%, #1a0f20 100%)', color: '#c8b8d8' }}>
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

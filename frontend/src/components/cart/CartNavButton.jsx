export default function CartNavButton({ onClick, children, variant = 'primary', align = 'end', className = '', ...props }) {
  const base =
    'rounded-lg px-6 py-2 font-semibold transition flex items-center justify-center';
  const variants = {
    primary: 'bg-sinapsia-accent text-white hover:bg-sinapsia-gradient',
    secondary: 'bg-sinapsia-base border border-sinapsia-accent text-sinapsia-light hover:bg-sinapsia-accent hover:text-white',
  };
  return (
    <div className={`flex justify-${align} mt-4`}>
      <button
        type="button"
        className={`${base} ${variants[variant]} ${className}`}
        onClick={onClick}
        {...props}
      >
        {children}
      </button>
    </div>
  );
}

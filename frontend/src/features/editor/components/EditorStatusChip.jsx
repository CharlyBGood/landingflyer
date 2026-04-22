import { useEffect, useState } from 'react';

/**
 * Persistent editor status indicator.
 *
 * Props:
 * - editing: boolean        → whether edit mode is active
 * - dirty: boolean          → whether there are unsaved changes
 * - justSaved: number|null  → timestamp of last save; shows "Guardado" for 2.5s
 */
export default function EditorStatusChip({ editing, dirty, justSaved }) {
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    if (!justSaved) return;
    setShowSaved(true);
    const t = setTimeout(() => setShowSaved(false), 2500);
    return () => clearTimeout(t);
  }, [justSaved]);

  const variant = showSaved
    ? 'saved'
    : dirty
      ? 'dirty'
      : editing
        ? 'editing'
        : 'idle';

  const config = {
    idle: {
      label: 'Sin cambios',
      classes: 'bg-portfolio-base/60 text-sinapsia-light/70 border-portfolio-accent/30',
      dot: 'bg-sinapsia-light/40',
      pulse: false,
    },
    editing: {
      label: 'Editando',
      classes: 'bg-amber-500/10 text-amber-300 border-amber-400/40',
      dot: 'bg-amber-400',
      pulse: true,
    },
    dirty: {
      label: 'Cambios sin guardar',
      classes: 'bg-amber-500/15 text-amber-200 border-amber-400/50',
      dot: 'bg-amber-400',
      pulse: true,
    },
    saved: {
      label: 'Guardado',
      classes: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/40',
      dot: 'bg-emerald-400',
      pulse: false,
    },
  }[variant];

  return (
    <div
      role="status"
      aria-live="polite"
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors duration-200 ${config.classes}`}
    >
      <span className="relative flex h-2 w-2">
        {config.pulse && (
          <span
            className={`absolute inline-flex h-full w-full rounded-full opacity-70 animate-ping ${config.dot}`}
          />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${config.dot}`} />
      </span>
      <span>{config.label}</span>
    </div>
  );
}

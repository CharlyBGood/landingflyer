import { PencilIcon, CheckIcon, GlobeIcon, XMarkIcon } from '../../../utilities/Icons.jsx';
import EditorStatusChip from './EditorStatusChip.jsx';

/**
 * Top bar for the editor page — presentation only.
 * Receives all state and handlers as props.
 */
export default function EditorTopBar({
  editing,
  dirty,
  justSaved,
  onToggleEditing,
  onSave,
  onDiscard,
  onReset,
  onPublish,
}) {
  return (
    <header
      className="
        fixed top-0 inset-x-0 z-40
        bg-sinapsia-base/95 backdrop-blur
        border-b border-sinapsia-accent/40
        shadow-[0_1px_3px_rgba(124,58,237,0.08),0_4px_20px_rgba(24,28,36,0.10)]
      "
    >
      <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2.5 sm:py-3">
        {/* Primary actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <ToolbarButton
            onClick={onToggleEditing}
            variant={editing ? 'primary-active' : 'primary'}
            icon={<PencilIcon size={16} />}
            label={editing ? 'Salir' : 'Editar'}
            ariaLabel={editing ? 'Salir de edición' : 'Activar edición'}
          />

          {editing && (
            <>
              <ToolbarButton
                onClick={onSave}
                disabled={!dirty}
                variant="success"
                icon={<CheckIcon size={16} />}
                label="Guardar"
                ariaLabel="Guardar cambios"
                hideLabelOnMobile={false}
              />

              {dirty && (
                <ToolbarButton
                  onClick={onDiscard}
                  variant="ghost"
                  icon={<XMarkIcon size={16} />}
                  label="Descartar"
                  ariaLabel="Descartar cambios"
                  hideLabelOnMobile
                />
              )}
            </>
          )}

          <ToolbarButton
            onClick={onReset}
            variant="ghost"
            label="Reset"
            ariaLabel="Restaurar al estado original"
            hideLabelOnMobile
          />
        </div>

        {/* Center: status */}
        <div className="flex-1 flex justify-center">
          <EditorStatusChip
            editing={editing}
            dirty={dirty}
            justSaved={justSaved}
          />
        </div>

        {/* Publish */}
        <button
          onClick={onPublish}
          aria-label="Publicar página"
          className="
            inline-flex items-center gap-2
            px-3 py-2 sm:px-4 sm:py-2.5
            text-sm font-semibold text-sinapsia-light
            bg-linear-to-r from-purple-500 to-purple-600
            hover:from-purple-600 hover:to-purple-700
            rounded-xl
            transition-all duration-200
            hover:-translate-y-0.5 hover:shadow-lg
            focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-sinapsia-base
          "
        >
          <GlobeIcon size={16} className="shrink-0" />
          <span className="hidden sm:inline">Publicar</span>
        </button>
      </div>
    </header>
  );
}

function ToolbarButton({
  onClick,
  disabled,
  variant = 'primary',
  icon,
  label,
  ariaLabel,
  hideLabelOnMobile = false,
}) {
  const variants = {
    primary:
      'bg-sinapsia-base text-sinapsia-light border border-sinapsia-accent/60 hover:bg-sinapsia-accent/15 hover:border-sinapsia-accent',
    'primary-active':
      'bg-sinapsia-accent text-sinapsia-light border border-sinapsia-accent hover:bg-sinapsia-accent/90',
    success:
      'bg-emerald-500/90 text-white border border-emerald-400 hover:bg-emerald-500 disabled:bg-emerald-500/30 disabled:border-emerald-400/30 disabled:cursor-not-allowed disabled:hover:bg-emerald-500/30',
    ghost:
      'bg-transparent text-sinapsia-light/80 border border-transparent hover:bg-portfolio-base/60 hover:text-sinapsia-light',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel || label}
      className={`
        inline-flex items-center gap-1.5
        px-2.5 py-1.5 sm:px-3 sm:py-2
        text-sm font-medium
        rounded-lg
        transition-colors duration-150
        focus:outline-none focus:ring-2 focus:ring-sinapsia-accent focus:ring-offset-2 focus:ring-offset-sinapsia-base
        ${variants[variant]}
      `}
    >
      {icon}
      <span className={hideLabelOnMobile ? 'hidden sm:inline' : ''}>{label}</span>
    </button>
  );
}

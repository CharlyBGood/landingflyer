import { GlobeIcon, PencilIcon, CheckIcon } from '../../utilities';

export default function PreviewHeader({
  siteName,
  onSiteNameChange,
  editing,
  hasPendingEdits,
  onToggleEditing,
  onSave,
  onDiscard,
  onPublish,
}) {
  return (
    <header className="bg-gray-900 border-b border-gray-700 px-4 py-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-sm text-gray-300 font-semibold">Editor de Preview</span>
        <input
          value={siteName}
          onChange={(event) => onSiteNameChange(event.target.value)}
          placeholder="Nombre del sitio"
          className="hidden md:block min-w-0 w-[18rem] bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-portfolio-accent"
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onToggleEditing}
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${editing ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-100 hover:bg-gray-600'}`}
          aria-label={editing ? 'Salir de edición' : 'Activar edición'}
        >
          <PencilIcon size={16} />
          <span>{editing ? 'Editando' : 'Editar'}</span>
        </button>

        {editing && (
          <>
            <button
              onClick={hasPendingEdits ? onSave : onDiscard}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${hasPendingEdits ? 'bg-green-600 text-white hover:bg-green-500' : 'bg-red-600 text-white hover:bg-red-500'}`}
              aria-label={hasPendingEdits ? 'Guardar cambios' : 'Descartar cambios'}
            >
              <CheckIcon size={16} />
              <span>{hasPendingEdits ? 'Guardar' : 'Descartar'}</span>
            </button>
          </>
        )}

        <button
          onClick={onPublish}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-portfolio-accent text-portfolio-text hover:bg-portfolio-medium transition-colors"
          aria-label="Publicar página"
        >
          <GlobeIcon size={16} />
          <span>Publicar</span>
        </button>
      </div>
    </header>
  );
}

export default function MobileActionBar({
  editing,
  hasPendingEdits,
  onToggleEditing,
  onSave,
  onDiscard,
  onPublish,
}) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 p-3 bg-gray-900/95 border-t border-gray-700">
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleEditing}
          className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold ${editing ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-100'}`}
        >
          {editing ? 'Editando' : 'Editar'}
        </button>

        {editing && (
          <button
            onClick={hasPendingEdits ? onSave : onDiscard}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold ${hasPendingEdits ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}
          >
            {hasPendingEdits ? 'Guardar' : 'Descartar'}
          </button>
        )}

        <button
          onClick={onPublish}
          className="flex-1 px-3 py-2 rounded-lg text-sm font-semibold bg-portfolio-accent text-portfolio-text"
        >
          Publicar
        </button>
      </div>
    </div>
  );
}

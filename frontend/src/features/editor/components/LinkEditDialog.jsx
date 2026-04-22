import { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { LinkIcon, XMarkIcon } from '../../../utilities/Icons.jsx';

function normaliseUrl(raw) {
  const v = (raw || '').trim();
  if (!v) return '';
  if (/^javascript:/i.test(v)) return '';
  if (/^(https?:|mailto:|tel:|\/|#)/i.test(v)) return v;
  return `https://${v}`;
}

/**
 * Modal for creating/editing a link. Controlled by `open`.
 * `initial` is { href, text, target } read from the current anchor (if any)
 * and `defaultText` is the currently selected plain text.
 */
export default function LinkEditDialog({
  open,
  onOpenChange,
  initial,
  defaultText,
  onSubmit,
  onRemove,
}) {
  const [href, setHref] = useState('');
  const [text, setText] = useState('');
  const [newTab, setNewTab] = useState(true);

  useEffect(() => {
    if (!open) return;
    setHref(initial?.href || '');
    setText(initial?.text ?? defaultText ?? '');
    setNewTab(initial?.target === '_blank' || !initial?.href);
  }, [open, initial, defaultText]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const normalised = normaliseUrl(href);
    if (!normalised) return;
    onSubmit({
      href: normalised,
      text: text.trim() || null,
      target: newTab ? '_blank' : null,
    });
  };

  const editing = Boolean(initial?.href);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content
          className="
            fixed z-[61] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
            w-[min(92vw,460px)]
            rounded-2xl
            bg-sinapsia-base border border-sinapsia-accent/50
            shadow-2xl
            p-5
            text-sinapsia-light
            focus:outline-none
          "
        >
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex w-9 h-9 rounded-lg bg-sinapsia-accent/20 text-sinapsia-accent items-center justify-center">
                <LinkIcon size={18} />
              </span>
              <div>
                <Dialog.Title className="text-base font-semibold">
                  {editing ? 'Editar enlace' : 'Crear enlace'}
                </Dialog.Title>
                <Dialog.Description className="text-xs text-sinapsia-light/60 mt-0.5">
                  El texto seleccionado se convertirá en un enlace.
                </Dialog.Description>
              </div>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Cerrar"
                className="text-sinapsia-light/60 hover:text-sinapsia-light p-1 rounded-md hover:bg-sinapsia-accent/20"
              >
                <XMarkIcon size={18} />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <label className="block">
              <span className="block text-xs font-medium mb-1 text-sinapsia-light/80">URL</span>
              <input
                type="text"
                value={href}
                onChange={(e) => setHref(e.target.value)}
                placeholder="https://ejemplo.com"
                autoFocus
                className="
                  w-full px-3 py-2 text-sm rounded-lg
                  bg-portfolio-base/60 border border-sinapsia-accent/40
                  placeholder:text-sinapsia-light/40
                  focus:outline-none focus:ring-2 focus:ring-sinapsia-accent focus:border-sinapsia-accent
                "
              />
            </label>

            <label className="block">
              <span className="block text-xs font-medium mb-1 text-sinapsia-light/80">Texto visible (opcional)</span>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Dejar vacío para conservar el texto seleccionado"
                className="
                  w-full px-3 py-2 text-sm rounded-lg
                  bg-portfolio-base/60 border border-sinapsia-accent/40
                  placeholder:text-sinapsia-light/40
                  focus:outline-none focus:ring-2 focus:ring-sinapsia-accent focus:border-sinapsia-accent
                "
              />
            </label>

            <label className="flex items-center gap-2 text-sm text-sinapsia-light/80 select-none">
              <input
                type="checkbox"
                checked={newTab}
                onChange={(e) => setNewTab(e.target.checked)}
                className="w-4 h-4 accent-sinapsia-accent"
              />
              Abrir en una pestaña nueva
            </label>

            <div className="flex items-center justify-between gap-2 pt-2">
              {editing && onRemove ? (
                <button
                  type="button"
                  onClick={onRemove}
                  className="px-3 py-2 text-sm rounded-lg text-red-300 hover:text-red-200 hover:bg-red-500/15 focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  Quitar enlace
                </button>
              ) : <span />}

              <div className="flex gap-2">
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="px-3 py-2 text-sm rounded-lg text-sinapsia-light/80 hover:bg-sinapsia-accent/20 focus:outline-none focus:ring-2 focus:ring-sinapsia-accent"
                  >
                    Cancelar
                  </button>
                </Dialog.Close>
                <button
                  type="submit"
                  disabled={!href.trim()}
                  className="
                    px-3 py-2 text-sm font-semibold rounded-lg
                    text-white bg-sinapsia-accent hover:bg-sinapsia-accent/90
                    disabled:bg-sinapsia-accent/40 disabled:cursor-not-allowed
                    focus:outline-none focus:ring-2 focus:ring-sinapsia-accent focus:ring-offset-2 focus:ring-offset-sinapsia-base
                  "
                >
                  {editing ? 'Guardar' : 'Crear enlace'}
                </button>
              </div>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

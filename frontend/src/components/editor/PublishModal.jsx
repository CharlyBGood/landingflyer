import React, { useState } from 'react';
import { XMarkIcon } from '../../utilities/Icons.jsx';

const PublishModal = ({ isOpen, onClose, onPublish, isPublishing }) => {
  const [siteName, setSiteName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar nombre del sitio
    const cleanSiteName = siteName.trim().toLowerCase();

    if (!cleanSiteName) {
      setError('Por favor ingresa un nombre para el sitio');
      return;
    }

    if (cleanSiteName.length < 3) {
      setError('El nombre debe tener al menos 3 caracteres');
      return;
    }

    if (!/^[a-z0-9\s-]+$/.test(cleanSiteName)) {
      setError('Solo se permiten letras, números, espacios y guiones');
      return;
    }

    setError('');
    onPublish(cleanSiteName);
  };

  const handleClose = () => {
    if (!isPublishing) {
      setSiteName('');
      setError('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Publicar Landing Page
          </h2>
          {!isPublishing && (
            <button
              onClick={handleClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon size={24} />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de tu empresa o marca
            </label>
            <div className="space-y-2">
              <input
                id="siteName"
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="Ej: Panadería San José, Tech Solutions, Belleza Total"
                disabled={isPublishing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                autoFocus
              />
              <p className="text-xs text-gray-500">
                Se creará una URL corta y fácil de recordar basada en este nombre
              </p>
            </div>
            {error && (
              <p className="text-red-600 text-sm mt-1">{error}</p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isPublishing}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPublishing || !siteName.trim()}
              className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isPublishing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Publicando...
                </>
              ) : (
                'Publicar'
              )}
            </button>
          </div>
        </form>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>💡 URL inteligente:</strong> Crearemos una URL corta y memorable usando el nombre de tu empresa
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Ejemplo: "Panadería San José" → panaderiasr12345.netlify.app
          </p>
        </div>

        {isPublishing && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>🚀 Publicando con ZIP Method...</strong> Deploy atómico directo a Netlify. 
              Completado típicamente en menos de 30 segundos.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublishModal;

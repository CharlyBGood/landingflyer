import { CheckIcon, ExternalLinkIcon, XMarkIcon } from '../../utilities';

const PublishSuccessModal = ({ isOpen, onClose, publishResult }) => {
  if (!isOpen || !publishResult) return null;

  const handleViewSite = () => {
    window.open(publishResult.url, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-sinapsia-base text-sinapsia-light rounded-2xl p-6 w-full max-w-md mx-auto border border-sinapsia-accent">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center">
              <CheckIcon size={20} className="text-green-300" />
            </div>
            <h2 className="text-xl font-bold text-sinapsia-accent">
              ¡Publicado con éxito!
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-sinapsia-accent/20 rounded-lg transition-colors"
          >
            <XMarkIcon size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-sinapsia-base border border-green-700 rounded-lg">
            <p className="text-sm text-green-300 mb-2">
              Tu landing page está ahora disponible en:
            </p>
            <div className="space-y-2">
              <div className="p-2 bg-sinapsia-base border border-green-700 rounded-lg">
                <p className="text-sm font-medium text-sinapsia-accent">Dominio personalizado:</p>
                <code className="text-green-300 text-sm">
                  {publishResult.url}
                </code>
              </div>
              {publishResult.netlifyUrl && (
                <div className="p-2 bg-sinapsia-base border border-sinapsia-accent rounded-lg">
                  <p className="text-sm font-medium text-sinapsia-light">URL alternativa:</p>
                  <code className="text-sinapsia-light text-xs">
                    {publishResult.netlifyUrl}
                  </code>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sinapsia-light bg-sinapsia-base border border-sinapsia-accent hover:bg-sinapsia-accent/20 rounded-lg transition-colors"
            >
              Cerrar
            </button>
            <button
              onClick={handleViewSite}
              className="flex-1 px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              Ver sitio
              <ExternalLinkIcon size={16} />
            </button>
          </div>
        </div>

        <div className="mt-4 p-3 bg-sinapsia-base border border-sinapsia-accent rounded-lg">
          <p className="text-xs text-sinapsia-accent">
            <strong>Nota:</strong> La configuración DNS puede tardar unos minutos en propagarse. 
            Si el dominio personalizado no funciona inmediatamente, usa la URL alternativa.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PublishSuccessModal;

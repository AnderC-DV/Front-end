import React from 'react';
import EmailPreview from './wizards/EmailPreview';

const TemplatePreviewModal = ({ template, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-xl max-w-2xl w-full border border-white/20 flex flex-col max-h-[90vh]">
        <div className="p-8 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Visualizar Plantilla</h2>
        </div>
        
        <div className="p-8 overflow-y-auto">
          <div className="mb-4">
            <strong>Nombre:</strong> {template.name}
          </div>
          <div className="mb-4">
            <strong>Canal:</strong> {template.channel_type}
          </div>
          {template.subject && (
            <div className="mb-4">
              <strong>Asunto:</strong> {template.subject}
            </div>
          )}
          <div className="mb-4">
            <strong>Contenido:</strong>
            {template.channel_type === 'EMAIL' ? (
              <EmailPreview subject={template.subject} htmlContent={template.content} />
            ) : (
              <div className="border p-4 mt-2 rounded bg-gray-50 whitespace-pre-wrap">
                {template.content}
              </div>
            )}
          </div>
          <div className="mb-4">
            <strong>Creado por:</strong> {template.creator.full_name} ({template.creator.email})
          </div>
        </div>

        <div className="p-8 border-t mt-auto">
          <div className="flex justify-end">
            <button onClick={onClose} className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatePreviewModal;

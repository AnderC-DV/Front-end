import React, { useState, useEffect } from 'react';
import { getTemplates, getTemplatePreview } from '../../services/api';
import EmailPreview from './EmailPreview';

const Step3_Template = ({ campaignData, setCampaignData }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar plantillas disponibles
  useEffect(() => {
    const fetchTemplates = async () => {
      if (!campaignData.channel) return;
      try {
        setLoading(true);
        const allTemplates = await getTemplates();
        const approvedAndFiltered = allTemplates.filter(
          t => t.status === 'APPROVED' && t.channel_type === campaignData.channel.toUpperCase()
        );
        setTemplates(approvedAndFiltered);
        setError(null);
      } catch (err) {
        console.error("Error al cargar las plantillas", err);
        setError("No se pudieron cargar las plantillas.");
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, [campaignData.channel]);

  // Obtener vista previa cuando cambia la plantilla seleccionada
  useEffect(() => {
    const fetchPreview = async () => {
      const templateId = campaignData.message_template_id;
      if (templateId) {
        try {
          // Actualizar con datos de carga
          setCampaignData(prev => ({
            ...prev,
            previewContent: 'Cargando vista previa...',
            previewSubject: '',
          }));

          const previewData = await getTemplatePreview(templateId);
          const templateDetails = templates.find(t => t.id === templateId);

          setCampaignData(prev => ({
            ...prev,
            templateName: templateDetails ? templateDetails.name : 'Desconocido',
            previewContent: previewData.preview_content,
            previewSubject: previewData.preview_subject || (templateDetails ? templateDetails.subject : ''),
          }));
        } catch (err) {
          console.error("Error al cargar la vista previa", err);
          setCampaignData(prev => ({
            ...prev,
            previewContent: 'No se pudo cargar la vista previa.',
            previewSubject: 'Error',
          }));
        }
      } else {
        // Limpiar si no hay plantilla seleccionada
        setCampaignData(prev => ({
          ...prev,
          templateName: '',
          previewContent: '',
          previewSubject: '',
        }));
      }
    };

    // Solo ejecutar si las plantillas ya se han cargado
    if (!loading) {
      fetchPreview();
    }
  }, [campaignData.message_template_id, loading, templates, setCampaignData]);

  const handleTemplateChange = (e) => {
    const templateId = e.target.value;
    setCampaignData({ ...campaignData, message_template_id: templateId });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800">Construye tu Mensaje</h2>
      <p className="text-gray-500 mt-1">
        Selecciona una plantilla aprobada para tu campaña de {campaignData.channel}.
      </p>

      <div className="mt-8">
        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          <button className="flex-1 py-2 px-4 rounded-md text-sm font-medium bg-white shadow">
            Seleccionar Plantilla
          </button>
          <button className="flex-1 py-2 px-4 rounded-md text-sm font-medium text-gray-400 cursor-not-allowed" disabled>
            Crear Nueva
          </button>
        </div>

        {loading && <p>Cargando plantillas...</p>}
        {error && <p className="text-red-500">{error}</p>}
        
        {!loading && !error && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Plantillas Existentes</label>
            <select
              value={campaignData.message_template_id || ''}
              onChange={handleTemplateChange}
              className="w-full p-3 border rounded-md bg-white"
            >
              <option value="">Selecciona una plantilla</option>
              {templates.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
        )}

        {campaignData.previewContent && (
          <>
            {campaignData.channel === 'EMAIL' ? (
              <EmailPreview 
                subject={campaignData.previewSubject}
                htmlContent={campaignData.previewContent}
              />
            ) : (
              <div className="mt-8 pt-8 border-t">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Vista Previa del Mensaje</h3>
                <div className="bg-white rounded-xl shadow-md border w-full p-6">
                  <p className="text-gray-700 whitespace-pre-wrap">{campaignData.previewContent}</p>
                </div>
                <p className="text-xs text-gray-400 mt-4 text-center">
                  Las variables se completarán automáticamente con los datos de cada destinatario.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Step3_Template;

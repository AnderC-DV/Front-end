import React, { useState, useEffect } from 'react';
import { getTemplates, getTemplatePreview } from '../../services/api';
import EmailPreview from './EmailPreview'; // Importamos el nuevo componente

const Step3_Template = ({ campaignData, setCampaignData }) => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [selectedTemplateData, setSelectedTemplateData] = useState(null);
  const [previewContent, setPreviewContent] = useState('');
  const [previewSubject, setPreviewSubject] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const allTemplates = await getTemplates();
        const approvedAndFiltered = allTemplates.filter(
          t => t.status === 'APPROVED' && t.channel_type === campaignData.channel.toUpperCase()
        );
        setTemplates(approvedAndFiltered);
      } catch (error) {
        console.error("Error al cargar las plantillas", error);
      } finally {
        setLoading(false);
      }
    };

    if (campaignData.channel) {
      fetchTemplates();
    }
  }, [campaignData.channel]);

  useEffect(() => {
    const fetchPreview = async () => {
      if (selectedTemplateId) {
        try {
          setPreviewContent('Cargando vista previa...');
          setPreviewSubject('');
          const previewData = await getTemplatePreview(selectedTemplateId);
          
          // Asumimos que la API ahora devuelve subject y content
          setPreviewContent(previewData.preview_content);
          setPreviewSubject(previewData.preview_subject);

          const templateData = templates.find(t => t.id === selectedTemplateId);
          setSelectedTemplateData(templateData);
        } catch (error) {
          console.error("Error al cargar la vista previa", error);
          setPreviewContent('No se pudo cargar la vista previa.');
          setPreviewSubject('Error');
          setSelectedTemplateData(null);
        }
      } else {
        setPreviewContent('');
        setPreviewSubject('');
        setSelectedTemplateData(null);
      }
    };

    fetchPreview();
  }, [selectedTemplateId, templates]);

  const handleTemplateChange = (e) => {
    const templateId = e.target.value;
    setSelectedTemplateId(templateId);
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

        {loading ? (
          <p>Cargando plantillas...</p>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Plantillas Existentes</label>
            <select
              value={selectedTemplateId}
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

        {previewContent && selectedTemplateData && (
          <>
            {campaignData.channel === 'EMAIL' ? (
              <EmailPreview 
                subject={previewSubject || selectedTemplateData.subject}
                htmlContent={previewContent}
              />
            ) : (
              <div className="mt-8 pt-8 border-t">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Vista Previa del Mensaje</h3>
                <div className="bg-white rounded-xl shadow-md border w-full p-6">
                  <p className="text-gray-700 whitespace-pre-wrap">{previewContent}</p>
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

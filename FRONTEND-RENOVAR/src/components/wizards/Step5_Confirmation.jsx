import React, { useState, useEffect } from 'react';
import { getSavedFilters, getTemplates, getTemplatePreview, getClientCount, createAndLaunchCampaign } from '../../services/api';
import EmailPreview from './EmailPreview'; // Importamos el componente de vista previa

// --- Iconos para el canal ---
const WhatsAppIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657A8 8 0 018.343 7.343m9.314 9.314a8 8 0 01-9.314-9.314m0 0A8.003 8.003 0 002 8c0 4.418 3.582 8 8 8 1.26 0 2.45-.293 3.536-.813" /></svg>;
const SmsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
const EMAILIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;

const DetailItem = ({ label, children }) => (
  <div>
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <div className="mt-1 text-lg font-semibold text-gray-900">{children}</div>
  </div>
);

// --- Funciones de ayuda para el payload (movidas fuera para mayor claridad) ---
export function buildCreateCampaignPayload(campaignData) {
  const payload = {
    name: campaignData.name,
    channel_type: campaignData.channel ? campaignData.channel.toUpperCase() : undefined,
    message_template_id: campaignData.message_template_id,
    audience_filter_id: campaignData.audience_filter_id,
    target_role: 'DEUDOR',
  };
  if (campaignData.scheduled_at) {
    payload.scheduled_at = campaignData.scheduled_at;
  }
  return payload;
}

export function logCreateCampaignPayload(payload) {
  console.log('[Crear Campaña] Payload enviado:', JSON.stringify(payload, null, 2));
}

const Step5_Confirmation = ({ campaignData }) => {
  const [audienceName, setAudienceName] = useState('Cargando...');
  const [templateName, setTemplateName] = useState('Cargando...');
  const [clientCount, setClientCount] = useState(0);
  const [previewContent, setPreviewContent] = useState('Cargando...');
  const [previewSubject, setPreviewSubject] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (campaignData.audience_filter_id) {
      getSavedFilters().then(filters => {
        const found = filters.find(f => f.id === campaignData.audience_filter_id);
        setAudienceName(found ? found.name : 'Filtro no encontrado');
      });
    } else {
      setAudienceName(`Filtro Nuevo (${campaignData.rules?.length || 0} condiciones)`);
    }

    if (campaignData.rules && campaignData.rules.length > 0) {
      getClientCount(campaignData.rules).then(res => setClientCount(res.match_count));
    }

    if (campaignData.message_template_id) {
      // Usar Promise.all para manejar ambas llamadas de forma más limpia
      Promise.all([
        getTemplates(),
        getTemplatePreview(campaignData.message_template_id)
      ]).then(([templates, previewData]) => {
        const foundTemplate = templates.find(t => t.id === campaignData.message_template_id);
        setTemplateName(foundTemplate ? foundTemplate.name : 'Plantilla no encontrada');
        
        setPreviewContent(previewData.preview_content);
        // Fallback: si no hay preview_subject, usar el subject de la plantilla
        setPreviewSubject(previewData.preview_subject || (foundTemplate ? foundTemplate.subject : ''));
      }).catch(err => {
        console.error("Error cargando datos de la plantilla:", err);
        setTemplateName('Error');
        setPreviewContent('Error');
        setPreviewSubject('Error');
      });
    }
  }, [campaignData]);

  const getChannelIcon = () => {
    switch (campaignData.channel) {
      case 'WhatsApp': return <WhatsAppIcon />;
      case 'SMS': return <SmsIcon />;
      case 'EMAIL': return <EMAILIcon />;
      default: return null;
    }
  };

  const handleCreateCampaign = async () => {
    setError(null);
    setSuccess(false);
    const payload = buildCreateCampaignPayload(campaignData);
    logCreateCampaignPayload(payload);
    try {
      await createAndLaunchCampaign(payload);
      setSuccess(true);
    } catch (e) {
      setError(e.message || 'Ocurrió un error al crear la campaña.');
    }
  };

  const isScheduled = !!campaignData.scheduled_at;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800">Revisa y Confirma tu Campaña</h2>
      <p className="text-gray-500 mt-1">Verifica todos los detalles antes de continuar.</p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <DetailItem label="Nombre">{campaignData.name}</DetailItem>
        <DetailItem label="Plantilla">{templateName}</DetailItem>
        <DetailItem label="Canal">
          <div className="flex items-center">{getChannelIcon()} {campaignData.channel}</div>
        </DetailItem>
        <DetailItem label="Programación">
          {isScheduled ? new Date(campaignData.scheduled_at).toLocaleString() : 'Envío Inmediato'}
        </DetailItem>
        <DetailItem label="Audiencia">{audienceName}</DetailItem>
        <DetailItem label="Clientes Alcanzados">{clientCount.toLocaleString()}</DetailItem>
      </div>

      {campaignData.channel === 'EMAIL' ? (
        <EmailPreview subject={previewSubject} htmlContent={previewContent} />
      ) : (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Vista Previa del Mensaje</h3>
          <div className="p-4 bg-gray-50 rounded-lg border">
            <p className="text-gray-700 whitespace-pre-wrap">{previewContent}</p>
          </div>
        </div>
      )}

      {error && <div className="mt-4 text-red-600 font-semibold text-center">{error}</div>}
      {success && <div className="mt-4 text-green-600 font-semibold text-center">¡Campaña creada exitosamente!</div>}
    </div>
  );
};

export default Step5_Confirmation;

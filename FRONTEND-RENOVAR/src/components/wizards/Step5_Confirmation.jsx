import React, { useState, useEffect } from 'react';
import { getSavedFilters, getClientCount, createAndLaunchCampaign } from '../../services/api';
import EmailPreview from './EmailPreview';
import { 
  WhatsAppIcon, 
  SmsIcon, 
  EMAILIcon, 
  DetailItem, 
  buildCreateCampaignPayload, 
  logCreateCampaignPayload 
} from './wizardUtils';

const Step5_Confirmation = ({ campaignData }) => {
  const [audienceName, setAudienceName] = useState('Cargando...');
  const [clientCount, setClientCount] = useState(0);
  // Los datos de la plantilla ahora vienen directamente de campaignData
  const { templateName, previewContent, previewSubject } = campaignData;

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
      getClientCount({ rules: campaignData.rules }).then(res => setClientCount(res.match_count));
    }
  }, [campaignData.audience_filter_id, campaignData.rules]);

  const getChannelIcon = () => {
    switch (campaignData.channel) {
      case 'WhatsApp': return <WhatsAppIcon />;
      case 'SMS': return <SmsIcon />;
      case 'EMAIL': return <EMAILIcon />;
      default: return null;
    }
  };

  const isScheduled = !!campaignData.scheduled_at;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800">Revisa y Confirma tu Campaña</h2>
      <p className="text-gray-500 mt-1">Verifica todos los detalles antes de continuar.</p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <DetailItem label="Nombre">{campaignData.name}</DetailItem>
        <DetailItem label="Plantilla">{templateName || 'No seleccionada'}</DetailItem>
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
        <EmailPreview 
          subject={previewSubject} 
          htmlContent={previewContent} 
        />
      ) : (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Vista Previa del Mensaje</h3>
          <div className="p-4 bg-gray-50 rounded-lg border">
            <p className="text-gray-700 whitespace-pre-wrap">{previewContent}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step5_Confirmation;

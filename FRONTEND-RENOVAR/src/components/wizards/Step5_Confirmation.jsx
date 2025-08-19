import React, { useState, useEffect } from 'react';
import { getSavedFilters } from '../../services/api';
import EmailPreview from './EmailPreview';
import FilterRulesPreview from './FilterRulesPreview';
import { 
  DetailItem, 
  WhatsAppIcon, 
  SmsIcon, 
  EMAILIcon 
} from './wizardUtils';

const Step5_Confirmation = ({ campaignData }) => {
  const [audienceName, setAudienceName] = useState('Cargando...');
  const [audienceRules, setAudienceRules] = useState([]);
  // Los datos de la plantilla y el conteo ahora vienen directamente de campaignData
  const { templateName, previewContent, previewSubject, client_count = 0 } = campaignData;

  useEffect(() => {
    if (campaignData.audience_filter_id) {
      getSavedFilters().then(filters => {
        const found = filters.find(f => f.id === campaignData.audience_filter_id);
        if (found) {
          setAudienceName(found.name);
          setAudienceRules(found.rules);
        } else {
          setAudienceName('Filtro no encontrado');
          setAudienceRules([]);
        }
      });
    } else {
      setAudienceName(`Filtro Nuevo (${campaignData.rules?.length || 0} condiciones)`);
      setAudienceRules(campaignData.rules || []);
    }

  }, [campaignData.audience_filter_id, campaignData.rules]);

  const getChannelIcon = () => {
    const iconProps = { className: "h-6 w-6 mr-2" };
    switch (campaignData.channel) {
      case 'WhatsApp': return <WhatsAppIcon {...iconProps} />;
      case 'SMS': return <SmsIcon {...iconProps} />;
      case 'EMAIL': return <EMAILIcon {...iconProps} />;
      default: return null;
    }
  };

  const renderScheduleDetails = () => {
    const { schedule_type, scheduled_at, schedule_details } = campaignData;

    if (schedule_type === 'recurrent' && schedule_details) {
      return (
        <div className="text-sm text-gray-900">
          <p className="font-semibold">Campaña Recurrente</p>
          <p>Frecuencia: <span className="font-mono bg-gray-100 px-1 rounded">{schedule_details.cron_expression}</span></p>
          {schedule_details.start_date && <p>Inicia: {new Date(schedule_details.start_date).toLocaleString()}</p>}
          {schedule_details.end_date && <p>Termina: {new Date(schedule_details.end_date).toLocaleString()}</p>}
        </div>
      );
    }

    if (schedule_type === 'scheduled' && scheduled_at) {
      return `Programado para: ${new Date(scheduled_at).toLocaleString()}`;
    }

    return 'Envío Inmediato';
  };

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
          {renderScheduleDetails()}
        </DetailItem>
        <DetailItem label="Audiencia">
          {audienceName}
          <FilterRulesPreview rules={audienceRules} />
        </DetailItem>
        <DetailItem label="Público Dirigido">
          {campaignData.target_role === 'DEUDOR' ? 'Deudor' : campaignData.target_role === 'CODEUDOR' ? 'Codeudor' : 'Ambas'}
        </DetailItem>
        {(campaignData.target_role === 'CODEUDOR' || campaignData.target_role === 'AMBAS') && (
          <DetailItem label="Estrategia Codeudor">
            {campaignData.codebtor_strategy === 'FIRST' ? 'Enviar al primero' : 'Enviar a todos'}
          </DetailItem>
        )}
        <DetailItem label="Clientes Alcanzados">{client_count.toLocaleString()}</DetailItem>
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

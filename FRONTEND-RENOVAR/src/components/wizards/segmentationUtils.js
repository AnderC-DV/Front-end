// --- Constantes para Segmentación ---
export const segmentationOperators = [
  { id: 'GT', name: 'Mayor que >' }, 
  { id: 'LT', name: 'Menor que <' }, 
  { id: 'EQ', name: 'Igual =' },
  { id: 'NEQ', name: 'No es igual !=' }, 
  { id: 'GTE', name: 'Mayor o igual que >=' }, 
  { id: 'LTE', name: 'Menor o igual que <=' },
  { id: 'CONTAINS', name: 'Contiene' }, 
  { id: 'IN', name: 'En' }, 
  { id: 'NOT_IN', name: 'No en' }
];

// --- Funciones de ayuda para el payload ---
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

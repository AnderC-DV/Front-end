const BASE_URL = "https://backend-475190189080.us-central1.run.app/api/v1";

// Función para obtener el token de autenticación
const getAuthToken = () => {
  const tokenData = localStorage.getItem('authToken');
  if (tokenData) {
    const token = JSON.parse(tokenData);
    return token.access_token;
  }
  return null;
};

const apiRequest = async (endpoint, method = 'GET', body = null) => {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getAuthToken()}`,
  };

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Error en la petición a ${endpoint}`);
    }

    return response.json();
  } catch (error) {
    console.error(`API request failed: ${error.message}`);
    throw error;
  }
};

// --- Endpoints de Segmentación ---
export const getAvailableFilterFields = () => apiRequest('/audience/available-filters');
export const getSavedFilters = () => apiRequest('/audience/filters');
export const getClientCount = (rules) => apiRequest('/audience/count', 'POST', rules);

// --- Endpoints de Campañas ---
export const getCampaigns = () => apiRequest('/campaigns/');
export const createAndLaunchCampaign = (campaignData) => apiRequest('/campaigns/', 'POST', campaignData);

// --- Endpoints de Plantillas ---
export const getTemplates = () => apiRequest('/templates/');
export const getTemplatesByStatus = (status) => apiRequest(`/templates/?status=${status}`);
export const createTemplate = (templateData) => apiRequest('/templates/', 'POST', templateData);
export const getTemplatePreview = (templateId) => apiRequest(`/templates/${templateId}/preview`);
export const getTemplateById = (templateId) => apiRequest(`/templates/${templateId}`);
export const getTemplateVariables = () => apiRequest('/templates/variables');
export const getPendingTemplates = () => apiRequest('/templates/pending-review');
export const approveTemplate = (templateId) => apiRequest(`/templates/${templateId}/internal-approve`, 'POST', {});
export const rejectTemplate = (templateId, reason) => apiRequest(`/templates/${templateId}/internal-reject`, 'POST', { reason });
export const reviewTemplate = (templateId, reviewData) => apiRequest(`/templates/${templateId}/review`, 'POST', reviewData);

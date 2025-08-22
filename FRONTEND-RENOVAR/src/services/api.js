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
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

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

// --- Endpoints de Autenticación ---
export const checkUserIdentifier = (identifier) => apiRequest('/auth/login/check-identifier', 'POST', { identifier });
export const loginWithPassword = (username, password) => {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);
  
  return fetch(`${BASE_URL}/auth/login/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData,
  }).then(async response => {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Error en el login');
    }
    return response.json();
  });
};
export const firstTimeLogin = (identifier, password) => apiRequest('/auth/login/first-time', 'POST', { identifier, password });

// --- Endpoints de Usuario ---
export const changePassword = (current_password, new_password) => apiRequest('/users/me/change-password', 'PUT', { current_password, new_password });


// --- Endpoints de Segmentación ---
export const getAvailableFilterFields = () => apiRequest('/audience/available-filters');
export const getDistinctValues = (fieldName) => apiRequest(`/audience/filters/distinct-values/${fieldName}`);
export const getSimpleFilters = () => apiRequest('/audience/filters/simple');
export const getSimpleClientCount = (definition) => apiRequest('/audience/count/simple', 'POST', definition);
export const createSimpleFilter = (filterData) => apiRequest('/audience/filters/simple', 'POST', filterData);

// --- Endpoints de Campañas ---
export const getCampaignStats = () => apiRequest('/campaigns/stats');
export const refreshCampaignStats = () => apiRequest('/campaigns/stats/refresh', 'POST');
export const createAndLaunchCampaign = (campaignData) => apiRequest('/campaigns/', 'POST', campaignData);

// --- Endpoints de Campañas Recurrentes (Schedules) ---
export const createSchedule = (scheduleData) => apiRequest('/schedules/', 'POST', scheduleData);
export const getSchedules = () => apiRequest('/schedules/');
export const updateSchedule = (scheduleId, scheduleData) => apiRequest(`/schedules/${scheduleId}`, 'PATCH', scheduleData);
export const deleteSchedule = (scheduleId) => apiRequest(`/schedules/${scheduleId}`, 'DELETE');
export const getScheduleCampaigns = (scheduleId) => apiRequest(`/schedules/${scheduleId}/campaigns`);

// --- Endpoints de Plantillas ---
export const getTemplates = () => apiRequest('/templates/');
export const getTemplatesByStatus = (status) => apiRequest(`/templates/?status=${status}`);

export const createTemplate = (templateData) => apiRequest('/templates/', 'POST', templateData);

// --- Endpoints de Notificaciones ---
export const getNotifications = () => apiRequest('/notifications/');
export const getUnreadNotificationsCount = () => apiRequest('/notifications/unread-count');
export const markNotificationAsRead = (notificationId) => apiRequest(`/notifications/${notificationId}/read`, 'PATCH');

export const getTemplatePreview = (templateId) => apiRequest(`/templates/${templateId}/preview`);
export const getTemplateById = (templateId) => apiRequest(`/templates/${templateId}`);
export const getTemplateVariables = () => apiRequest('/templates/variables');
export const getPendingTemplates = () => apiRequest('/templates/pending-review');
export const approveTemplate = (templateId) => apiRequest(`/templates/${templateId}/internal-approve`, 'POST', {});
export const rejectTemplate = (templateId, reason) => apiRequest(`/templates/${templateId}/internal-reject`, 'POST', { reason });
export const reviewTemplate = (templateId, reviewData) => apiRequest(`/templates/${templateId}/review`, 'POST', reviewData);

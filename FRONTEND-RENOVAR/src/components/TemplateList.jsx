import React, { useState, useEffect } from 'react';
import TemplateReviewModal from './TemplateReviewModal';
import { approveTemplate, rejectTemplate, getTemplatesByStatus } from '../services/api';

const TemplateList = ({ templates = [], onTemplateUpdated, statusFilter }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Si en el futuro necesitas filtrar por canal también
  // const [channelFilter, setChannelFilter] = useState('ALL');
  
  const getChannelIcon = (channelType) => {
    switch(channelType?.toLowerCase()) {
      case 'whatsapp':
        return '💬';
      case 'sms':
        return '📲';
      case 'email':
        return '📧';
      default:
        return '📄';
    }
  };

  // Esta función mapea los estados del backend a textos y colores en la UI
  const getStatusChip = (status) => {
    switch (status) {
      case 'PENDING_INTERNAL_APPROVAL':
        return { 
          text: 'Pendiente Aprobación', 
          color: 'bg-yellow-100 text-yellow-700'
        };
      case 'APPROVED':
        return { 
          text: 'Aprobada', 
          color: 'bg-green-100 text-green-700'
        };
      case 'REJECTED_INTERNAL':
        return { 
          text: 'Rechazada', 
          color: 'bg-red-100 text-red-700'
        };
      case 'DRAFT':
        return {
          text: 'Borrador',
          color: 'bg-blue-100 text-blue-700'
        };
      // Casos adicionales por si la API los devuelve
      case 'PENDING_META_APPROVAL':
        return { 
          text: 'Pendiente Aprobar por Meta', 
          color: 'bg-orange-100 text-orange-700'
        };
      case 'PENDING_APPROVAL':
        return { 
          text: 'Pendiente Meta', 
          color: 'bg-orange-100 text-orange-700'
        };
      case 'REJECTED':
        return { 
          text: 'Rechazada por Meta', 
          color: 'bg-red-200 text-red-800'
        };
      default:
        return { 
          text: status || 'Desconocido', 
          color: 'bg-gray-100 text-gray-700'
        };
    }
  };


  
  // Función para abrir el modal de revisión
  const openReviewModal = (template) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };
  
  // Función para aprobar o rechazar una plantilla
  const handleTemplateReview = async (templateId, isApproved, rejectionReason = '') => {
    setIsLoading(true);
    try {
      // Usar las funciones de la API para aprobar o rechazar
      if (isApproved) {
        await approveTemplate(templateId);
      } else {
        await rejectTemplate(templateId, rejectionReason);
      }
      
      // Cerrar el modal y notificar al componente padre para actualizar la lista
      setIsModalOpen(false);
      if (onTemplateUpdated) {
        onTemplateUpdated();
      }
    } catch (error) {
      console.error('Error al procesar la plantilla:', error);
      alert(isApproved 
        ? 'Error al aprobar la plantilla. Inténtalo de nuevo.' 
        : 'Error al rechazar la plantilla. Inténtalo de nuevo.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="p-6 bg-white rounded-t-xl">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Plantillas de Mensajería</h2>
            <p className="text-sm text-gray-500 mt-1">Revisa y aprueba o rechaza las plantillas creadas por tu equipo.</p>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto bg-white rounded-b-xl shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre de Plantilla</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              {statusFilter === 'REJECTED_INTERNAL' && (
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Razón Rechazo</th>
              )}
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Creado Por</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Creación</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Acciones</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {templates && templates.length > 0 ? (
              templates.map((template) => {
                const status = getStatusChip(template.status);
                return (
                  <tr key={template.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gray-100">
                          <span className="text-xl">{getChannelIcon(template.channel_type)}</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{template.name}</div>
                          <div className="text-sm text-gray-500">{template.channel_type}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${status.color}`}>{status.text}</span>
                    </td>
                    {statusFilter === 'REJECTED_INTERNAL' && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {template.rejection_reason || 'N/A'}
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{template.creator?.full_name || 'Usuario desconocido'}</div>
                      <div className="text-xs text-gray-500">{template.creator?.email || ''}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {template.created_at ? new Date(template.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-3">
                        {/* Ver detalles icon */}
                        <button className="text-gray-500 hover:text-indigo-600 transition-colors" title="Ver detalles" onClick={() => openReviewModal(template)} disabled={isLoading}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        {template.status === 'PENDING_INTERNAL_APPROVAL' && (
                          <>
                            {/* Aprobar icon */}
                            <button className="text-gray-500 hover:text-green-600 transition-colors" title="Aprobar plantilla" onClick={() => handleTemplateReview(template.id, true)} disabled={isLoading}>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                            {/* Rechazar icon */}
                            <button className="text-gray-500 hover:text-red-600 transition-colors" title="Rechazar plantilla" onClick={() => openReviewModal(template)} disabled={isLoading}>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={statusFilter === 'REJECTED_INTERNAL' ? 6 : 5} className="px-6 py-10 text-center">
                  <div className="flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 16h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-500 text-sm">{'No hay plantillas disponibles'}</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Modal de revisión de plantilla */}
      {isModalOpen && selectedTemplate && (
        <TemplateReviewModal 
          template={selectedTemplate} 
          onClose={() => setIsModalOpen(false)}
          onReview={handleTemplateReview}
        />
      )}
      {/* Overlay de carga mientras se procesan acciones */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-center text-gray-700">Procesando...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateList;

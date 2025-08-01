import React, { useState, useEffect } from 'react';
import { getTemplates } from '../services/api';
import TemplateList from '../components/TemplateList';

const TemplateApprovalPage = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Cargar todas las plantillas siempre
  const fetchAllTemplates = async () => {
    try {
      setLoading(true);
      const allTemplates = await getTemplates();
      setTemplates(allTemplates);
      setError(null);
    } catch (err) {
      // Mostrar el mensaje real del backend si existe
      setError(err?.message || 'Error al cargar las plantillas.');
      console.error('Error al cargar las plantillas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTemplates();
  }, []);

  // Filtrado en frontend por estado
  const filteredTemplates = templates.filter(t => {
    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'PENDING_INTERNAL_APPROVAL') {
      return t.status === 'PENDING_INTERNAL_APPROVAL' || t.status === 'PENDING_META_APPROVAL';
    }
    return t.status === statusFilter;
  });

  const getButtonClasses = (filterName) => {
    const baseClasses = "flex-1 flex items-center justify-center py-2 px-5 rounded-lg text-sm font-medium transition-colors duration-200";
    if (statusFilter === filterName) {
      return `${baseClasses} bg-white text-gray-800 shadow-sm`;
    }
    return `${baseClasses} text-gray-500 hover:bg-gray-200`;
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Plantillas</h1>
        <p className="text-gray-500">Administra, revisa y aprueba las plantillas de comunicación del sistema.</p>
      </div>

      {/* Filtros de estado con nuevo diseño */}
      <div className="my-6 bg-gray-100 p-1 rounded-xl flex gap-1">
        <button onClick={() => setStatusFilter('ALL')} className={getButtonClasses('ALL')}>Todos</button>
        <button onClick={() => setStatusFilter('PENDING_INTERNAL_APPROVAL')} className={getButtonClasses('PENDING_INTERNAL_APPROVAL')}>Pendientes</button>
        <button onClick={() => setStatusFilter('APPROVED')} className={getButtonClasses('APPROVED')}>Aprobadas</button>
        <button onClick={() => setStatusFilter('REJECTED_INTERNAL')} className={getButtonClasses('REJECTED_INTERNAL')}>Rechazadas</button>
        <button onClick={() => setStatusFilter('DRAFT')} className={getButtonClasses('DRAFT')}>Borrador</button>
      </div>

      {loading && <p>Cargando plantillas...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      {!loading && !error && (
        <TemplateList 
          templates={filteredTemplates} 
          onTemplateUpdated={fetchAllTemplates}
          statusFilter={statusFilter}
        />
      )}
    </div>
  );
};

export default TemplateApprovalPage;

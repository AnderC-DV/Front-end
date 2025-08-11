import React, { useState, useEffect } from 'react';
import FilterBuilder from './FilterBuilder';
import SavedFilters from './SavedFilters';
import TargetRoleSwitch from './TargetRoleSwitch';

const Step2_Segmentation = ({ campaignData, setCampaignData }) => {
  const [activeTab, setActiveTab] = useState('saved');
  const [clientCount, setClientCount] = useState(0);
  const [initialConditions, setInitialConditions] = useState(null);
  const [targetRole, setTargetRole] = useState(campaignData.target_role || 'DEUDOR');

  useEffect(() => {
    setCampaignData(prev => ({ ...prev, target_role: targetRole }));
  }, [targetRole, setCampaignData]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setClientCount(0);
    setInitialConditions(null);
    setCampaignData(prev => ({ ...prev, rules: [], audience_filter_id: null }));
  };

  const handleEditFilter = (rules) => {
    setInitialConditions(rules.map(r => ({...r, id: Date.now() + Math.random() })));
    setActiveTab('create');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800">Define tu Público Objetivo</h2>
      <p className="text-gray-500 mt-1">Selecciona los clientes que recibirán la campaña.</p>

      <div className="mt-8">
        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          <button
            onClick={() => handleTabChange('saved')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'saved' ? 'bg-white shadow' : 'hover:bg-gray-200'}`}
          >
            Usar Filtro Guardado
          </button>
          <button
            onClick={() => handleTabChange('create')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'create' ? 'bg-white shadow' : 'hover:bg-gray-200'}`}
          >
            Crear Filtro Nuevo
          </button>
        </div>

        {activeTab === 'create' ? 
            <FilterBuilder 
              setClientCount={setClientCount} 
              setCampaignData={setCampaignData} 
              initialConditions={initialConditions} 
              onSave={() => handleTabChange('saved')} 
            /> : 
            <SavedFilters 
              setClientCount={setClientCount} 
              setCampaignData={setCampaignData} 
              onEdit={handleEditFilter} 
            />
        }

        <TargetRoleSwitch selectedRole={targetRole} onRoleChange={setTargetRole} />

        <div className="mt-6 p-4 bg-blue-50 rounded-lg text-center">
            <p className="text-blue-800">Número de Clientes Coincidentes: <span className="font-bold">{clientCount.toLocaleString()}</span></p>
        </div>
      </div>
    </div>
  );
};

export default Step2_Segmentation;

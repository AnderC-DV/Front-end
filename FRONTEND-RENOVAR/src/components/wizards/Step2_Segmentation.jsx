import React, { useState, useEffect, useCallback } from 'react';
import { getAvailableFilterFields, getSavedFilters, getClientCount } from '../../services/api';
import { debounce } from 'lodash';

const FilterBuilder = ({ setClientCount, setCampaignData }) => {
  const [conditions, setConditions] = useState([{ id: 1, field_name: '', operator: '', value: '' }]);
  const [fields, setFields] = useState([]);
  const [operators, setOperators] = useState([
      { id: 'GT', name: 'Mayor que >' }, { id: 'LT', name: 'Menos que <' }, { id: 'EQ', name: 'Igual =' },
      { id: 'NEQ', name: 'No es igual !=' }, { id: 'GTE', name: 'Mayor o igual que >=' }, { id: 'LTE', name: 'Menor o igual que <=' },
      { id: 'CONTAINS', name: 'Contiene' }, { id: 'IN', name: 'En' }, { id: 'NOT_IN', name: 'No en' }
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const data = await getAvailableFilterFields();
        setFields(data);
      } catch (error) {
        console.error("Error al cargar campos de segmentación", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFields();
  }, []);

  const debouncedGetCount = useCallback(
    debounce(async (currentConditions) => {
      try {
        const response = await getClientCount(currentConditions);
        setClientCount(response.match_count);
      } catch (error) {
        console.error("Error al obtener el conteo de clientes", error);
        setClientCount(0);
      }
    }, 800),
    []
  );

  useEffect(() => {
    const validConditions = conditions.filter(c => c.field_name && c.operator && c.value);
    setCampaignData(prev => ({ ...prev, rules: validConditions }));
    if (validConditions.length > 0) {
      debouncedGetCount(validConditions);
    } else {
      setClientCount(0);
    }
  }, [conditions, debouncedGetCount, setCampaignData]);


  const handleConditionChange = (id, field, value) => {
    setConditions(conditions.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const addCondition = () => {
    setConditions([...conditions, { id: Date.now(), field_name: '', operator: '', value: '' }]);
  };

  const removeCondition = (id) => {
    setConditions(conditions.filter(c => c.id !== id));
  };

  if (loading) return <div>Cargando constructor de filtros...</div>;

  return (
    <div>
      {conditions.map((cond) => (
        <div key={cond.id} className="flex items-center gap-4 mb-4">
          <select value={cond.field_name} onChange={(e) => handleConditionChange(cond.id, 'field_name', e.target.value)} className="flex-1 p-2 border rounded-md bg-white">
            <option value="">Seleccionar Campo</option>
            {fields.map(f => <option key={f.variable_name} value={f.variable_name}>{f.description}</option>)}
          </select>
          <select value={cond.operator} onChange={(e) => handleConditionChange(cond.id, 'operator', e.target.value)} className="flex-1 p-2 border rounded-md bg-white">
            <option value="">Seleccionar Operador</option>
            {operators.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>
          <input type="text" value={cond.value} onChange={(e) => handleConditionChange(cond.id, 'value', e.target.value)} placeholder="Valor" className="flex-1 p-2 border rounded-md" />
          <button onClick={() => removeCondition(cond.id)} className="text-red-500 hover:text-red-700 text-2xl">&times;</button>
        </div>
      ))}
      <button onClick={addCondition} className="flex items-center text-blue-600 font-semibold mt-4">
        <span className="text-xl mr-2">+</span> Añadir Condición
      </button>
    </div>
  );
};

const SavedFilters = ({ setClientCount, setCampaignData }) => {
    const [savedFilters, setSavedFilters] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const data = await getSavedFilters();
                setSavedFilters(data);
            } catch (error) {
                console.error("Error al cargar filtros guardados", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFilters();
    }, []);

    const handleFilterSelect = (e) => {
        const filterId = e.target.value;
        const selectedFilter = savedFilters.find(f => f.id === filterId);
        if (selectedFilter) {
            // Simulamos el conteo, idealmente la API de filtros guardados devolvería el count
            getClientCount(selectedFilter.rules).then(res => setClientCount(res.match_count));
            setCampaignData(prev => ({ ...prev, audience_filter_id: filterId }));
        } else {
            setClientCount(0);
            setCampaignData(prev => ({ ...prev, audience_filter_id: null }));
        }
    };

    if (loading) return <div>Cargando filtros...</div>;

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filtros Guardados</label>
            <select onChange={handleFilterSelect} className="w-full p-2 border rounded-md bg-white">
                <option value="">Selecciona un filtro guardado</option>
                {savedFilters.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                ))}
            </select>
        </div>
    );
};


const Step2_Segmentation = ({ campaignData, setCampaignData }) => {
  const [activeTab, setActiveTab] = useState('create');
  const [clientCount, setClientCount] = useState(0);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setClientCount(0);
    // Limpiar los datos de segmentación al cambiar de pestaña
    setCampaignData(prev => ({ ...prev, rules: [], audience_filter_id: null }));
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
            <FilterBuilder setClientCount={setClientCount} setCampaignData={setCampaignData} /> : 
            <SavedFilters setClientCount={setClientCount} setCampaignData={setCampaignData} />
        }

        <div className="mt-6 p-4 bg-blue-50 rounded-lg text-center">
            <p className="text-blue-800">Número de Clientes Coincidentes: <span className="font-bold">{clientCount.toLocaleString()}</span></p>
        </div>
      </div>
    </div>
  );
};

export default Step2_Segmentation;

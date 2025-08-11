import React, { useState, useEffect, useCallback } from 'react';
import { getAvailableFilterFields, getClientCount, createAudienceFilter } from '../../services/api';
import { debounce } from 'lodash';
import AudienceFilterCreate from '../../schemas/AudienceFilterCreate';
import { segmentationOperators } from './segmentationUtils';

const FilterBuilder = ({ setClientCount, setCampaignData, initialConditions, onSave }) => {
  const [conditions, setConditions] = useState(initialConditions || [{ id: Date.now(), field_name: '', operator: '', value: '' }]);
  const [fields, setFields] = useState([]);
  const [operators] = useState(segmentationOperators);
  const [loading, setLoading] = useState(true);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [newFilterName, setNewFilterName] = useState('');

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

  useEffect(() => {
    setConditions(initialConditions || [{ id: Date.now(), field_name: '', operator: '', value: '' }]);
  }, [initialConditions]);

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
    [setClientCount]
  );

  useEffect(() => {
    const validConditions = conditions.filter(c => c.field_name && c.operator && c.value);
    setCampaignData(prev => ({ ...prev, rules: validConditions, audience_filter_id: null }));
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

  const handleSave = async (e) => {
    e.preventDefault();
    const validConditions = conditions.filter(c => c.field_name && c.operator && c.value).map(({ id, ...rest }) => rest);
    try {
      const payload = new AudienceFilterCreate(newFilterName, validConditions);
      await createAudienceFilter(payload);
      alert('Filtro guardado con éxito');
      setIsSaveModalOpen(false);
      setNewFilterName('');
      onSave();
    } catch (error) {
      alert(`Error al guardar el filtro: ${error.message}`);
    }
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
      <div className="flex justify-between items-center mt-4">
        <button onClick={addCondition} className="flex items-center text-blue-600 font-semibold">
          <span className="text-xl mr-2">+</span> Añadir Condición
        </button>
        <button onClick={() => setIsSaveModalOpen(true)} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700" disabled={conditions.filter(c => c.field_name && c.operator && c.value).length === 0}>
          Guardar Filtro
        </button>
      </div>

      {isSaveModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Guardar Filtro</h2>
            <form onSubmit={handleSave}>
              <label className="block text-sm font-medium text-gray-700">Nombre del Filtro</label>
              <input
                type="text"
                value={newFilterName}
                onChange={(e) => setNewFilterName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
              <div className="mt-6 flex justify-end gap-4">
                <button type="button" onClick={() => setIsSaveModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded-md">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBuilder;

import React, { useState, useEffect, useCallback } from 'react';
import { getSavedFilters, getClientCount } from '../../services/api';
import { segmentationOperators } from './segmentationUtils';

const operatorMap = segmentationOperators.reduce((acc, op) => {
    acc[op.id] = op.name;
    return acc;
}, {});

const SavedFilters = ({ setClientCount, setCampaignData, onEdit }) => {
    const [savedFilters, setSavedFilters] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchFilters = useCallback(async () => {
        try {
            const data = await getSavedFilters();
            setSavedFilters(data);
        } catch (error) {
            console.error("Error al cargar filtros guardados", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFilters();
    }, [fetchFilters]);

    const handleFilterSelect = (e) => {
        const filterId = e.target.value;
        const filter = savedFilters.find(f => f.id === filterId);
        setSelectedFilter(filter);
        if (filter) {
            getClientCount(filter.rules).then(res => setClientCount(res.match_count));
            setCampaignData(prev => ({ ...prev, audience_filter_id: filterId, rules: [] }));
        } else {
            setClientCount(0);
            setCampaignData(prev => ({ ...prev, audience_filter_id: null, rules: [] }));
        }
    };

    if (loading) return <div>Cargando filtros...</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filtros Guardados</label>
                <select onChange={handleFilterSelect} className="w-full p-2 border rounded-md bg-white">
                    <option value="">Selecciona un filtro guardado</option>
                    {savedFilters.map(f => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                </select>
                {selectedFilter && (
                    <div className="mt-4 flex justify-end gap-2">
                        <button onClick={() => onEdit(selectedFilter.rules)} className="text-sm text-blue-600 hover:underline">
                            Editar y Guardar como Nuevo
                        </button>
                    </div>
                )}
            </div>
            <div>
                {selectedFilter && (
                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Reglas del Filtro</h4>
                        <div className="p-4 bg-gray-50 rounded-lg border max-h-48 overflow-y-auto">
                            {selectedFilter.rules.map((rule, index) => (
                                <div key={index} className="text-sm text-gray-600 mb-1">
                                    <span className="font-semibold">{rule.field_name}</span> {operatorMap[rule.operator] || rule.operator} <span className="font-semibold">{rule.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavedFilters;

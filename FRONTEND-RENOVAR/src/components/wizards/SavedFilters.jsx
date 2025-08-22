import React, { useState, useEffect } from 'react';
import { getSimpleFilters, getSimpleClientCount } from '../../services/api';
import SimpleFilterRulesPreview from './SimpleFilterRulesPreview';

const SavedFilters = ({ setClientCount, setCampaignData, onEdit, campaignData }) => {
    const [savedFilters, setSavedFilters] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchFilters = async () => {
        setLoading(true);
        try {
            const data = await getSimpleFilters();
            setSavedFilters(data);
        } catch (error) {
            console.error("Error al cargar filtros guardados", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFilters();
    }, []);

    useEffect(() => {
        if (savedFilters.length > 0 && campaignData.audience_filter_id) {
            const preSelectedFilter = savedFilters.find(f => f.id === campaignData.audience_filter_id);
            setSelectedFilter(preSelectedFilter || null);
        } else {
            setSelectedFilter(null);
        }
    }, [savedFilters, campaignData.audience_filter_id]);

    useEffect(() => {
        if (selectedFilter && selectedFilter.definition) {
            getSimpleClientCount(selectedFilter.definition).then(res => setClientCount(res.match_count));
        } else {
            setClientCount(0);
        }
    }, [selectedFilter, setClientCount]);

    const handleFilterSelect = (e) => {
        const filterId = e.target.value;
        const filter = savedFilters.find(f => f.id === filterId);
        setSelectedFilter(filter);
        if (filter) {
            setCampaignData(prev => ({ ...prev, audience_filter_id: filterId, definition: filter.definition }));
        } else {
            setCampaignData(prev => ({ ...prev, audience_filter_id: null, definition: null }));
        }
    };

    if (loading) return <div>Cargando filtros...</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filtros Guardados</label>
                <select value={selectedFilter ? selectedFilter.id : ''} onChange={handleFilterSelect} className="w-full p-2 border rounded-md bg-white">
                    <option value="">Selecciona un filtro guardado</option>
                    {savedFilters.map(f => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                </select>
                {selectedFilter && (
                    <div className="mt-4 flex justify-end gap-2">
                        <button onClick={() => onEdit(selectedFilter.definition)} className="text-sm text-blue-600 hover:underline">
                            Editar y Guardar como Nuevo
                        </button>
                    </div>
                )}
            </div>
            <div>
                {selectedFilter && selectedFilter.definition && (
                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Definición del Filtro</h4>
                        <div className="p-4 bg-gray-50 rounded-lg border max-h-48 overflow-y-auto">
                           <SimpleFilterRulesPreview definition={selectedFilter.definition} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavedFilters;

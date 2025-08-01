import React, { useState, useEffect } from "react";
import CampaignActionMenu from "./CampaignActionMenu";
import { getCampaigns } from "../services/api";

// --- Helper para obtener el ícono y la capitalización del canal ---
const getChannelInfo = (channel) => {
  switch (channel.toLowerCase()) {
    case 'whatsapp':
      return { icon: '💬', name: 'WhatsApp' };
    case 'sms':
      return { icon: '📲', name: 'SMS' };
    case 'email':
      return { icon: '📧', name: 'Email' };
    default:
      return { icon: '📢', name: channel };
  }
};

// --- Helper para el color del estado ---
const getStatusColor = (status) => {
  const lowerStatus = status.toLowerCase();
  if (lowerStatus.includes('completed') || lowerStatus.includes('completada')) return "bg-green-200 text-green-900 border border-green-400";
  if (lowerStatus.includes('error')) return "bg-red-200 text-red-900 border border-red-400";
  if (lowerStatus.includes('sending') || lowerStatus.includes('enviando')) return "bg-orange-200 text-orange-900 border border-orange-400";
  if (lowerStatus.includes('scheduled') || lowerStatus.includes('programada')) return "bg-blue-200 text-blue-900 border border-blue-400";
  if (lowerStatus.includes('pending') || lowerStatus.includes('pendiente')) return "bg-yellow-200 text-yellow-900 border border-yellow-400";
  if (lowerStatus.includes('rejected') || lowerStatus.includes('rechazada')) return "bg-gray-300 text-gray-900 border border-gray-400";
  return "bg-gray-100 text-gray-700 border border-gray-300";
};

export default function CampaignsTable({ channelFilter }) {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const data = await getCampaigns();
        setCampaigns(data);
        setError(null);
      } catch (err) {
        setError("Error al cargar las campañas. Por favor, intente de nuevo más tarde.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const filteredCampaigns =
    channelFilter === 'Todos'
      ? campaigns
      : campaigns.filter((c) => getChannelInfo(c.channel_type).name === channelFilter);

  if (loading) {
    return <div className="text-center p-10">Cargando campañas...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  return (
    <div>
      <div className="p-6 bg-white rounded-t-xl">
        <h2 className="text-xl font-bold text-gray-800">Historial de Campañas</h2>
        <p className="text-sm text-gray-500 mt-1">Todas las campañas creadas y su estado actual.</p>
      </div>
      <div className="overflow-x-auto bg-white rounded-b-xl shadow-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre de Campaña
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Enviados
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Entregados
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Leídos
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Última Actualización
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCampaigns.map((c) => {
              const channelInfo = getChannelInfo(c.channel_type);
              const statusColor = getStatusColor(c.status);
              const formattedDate = c.updated_at ? new Date(c.updated_at).toLocaleDateString() : 'N/A';

              return (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gray-100">
                        <span className="text-xl">{channelInfo.icon}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{c.name}</div>
                        <div className="text-sm text-gray-500">{channelInfo.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor}`}>{c.status}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">{c.sent_count || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">{c.delivered_count || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">{c.read_count || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formattedDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                    <CampaignActionMenu campaign={c} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

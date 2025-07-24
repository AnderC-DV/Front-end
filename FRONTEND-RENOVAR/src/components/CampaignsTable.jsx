import React from "react";

const campaigns = [
  {
    name: "Campaña Mora > 90 días - Enero 2024",
    channel: "WhatsApp",
    status: "Completada",
    sent: 1250,
    delivered: 1180,
    read: 890,
    date: "2024-01-16",
    color: "bg-green-100 text-green-700",
    icon: "💬",
  },
  {
    name: "Recordatorio SMS Semanal",
    channel: "SMS",
    status: "Programada",
    sent: 0,
    delivered: 0,
    read: 0,
    date: "2024-01-25",
    color: "bg-blue-100 text-blue-700",
    icon: "📲",
  },
  {
    name: "Newsletter Mensual",
    channel: "Email",
    status: "Enviando",
    sent: 450,
    delivered: 420,
    read: 280,
    date: "2024-01-22",
    color: "bg-orange-100 text-orange-700",
    icon: "📧",
  },
  {
    name: "Plantilla WhatsApp Pendiente",
    channel: "WhatsApp",
    status: "Pendiente Aprobación",
    sent: 0,
    delivered: 0,
    read: 0,
    date: "No programada",
    color: "bg-yellow-100 text-yellow-700",
    icon: "💬",
  },
  {
    name: "Campaña Email Rechazada",
    channel: "Email",
    status: "Rechazada",
    sent: 0,
    delivered: 0,
    read: 0,
    date: "No programada",
    color: "bg-red-100 text-red-700",
    icon: "📧",
  },
];

export default function CampaignsTable() {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-bold mb-4">Historial de Campañas</h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-gray-500">
            <th className="py-2">Nombre / Canal</th>
            <th className="py-2">Estado</th>
            <th className="py-2">Enviados</th>
            <th className="py-2">Entregados/Abiertos</th>
            <th className="py-2">Leídos/Clics</th>
            <th className="py-2">Fecha Ejecución</th>
            <th className="py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((c) => (
            <tr key={c.name} className="border-t hover:bg-gray-50 transition">
              <td className="py-2 flex items-center gap-2">
                <span className="text-xl">{c.icon}</span>
                <span>{c.name}</span>
              </td>
              <td className="py-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${c.color}`}>{c.status}</span>
              </td>
              <td className="py-2">{c.sent}</td>
              <td className="py-2">{c.delivered}</td>
              <td className="py-2">{c.read}</td>
              <td className="py-2">{c.date}</td>
              <td className="py-2">
                <button className="text-gray-400 hover:text-blue-600 transition">•••</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

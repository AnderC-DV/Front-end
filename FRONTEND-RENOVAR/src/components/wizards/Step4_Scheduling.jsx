import React, { useState, useEffect } from 'react';

const Step4_Scheduling = ({ campaignData, setCampaignData }) => {
  const [scheduleType, setScheduleType] = useState('immediate'); // 'immediate' o 'scheduled'
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    if (scheduleType === 'immediate') {
      setCampaignData({ ...campaignData, scheduled_at: null });
    } else {
      if (date && time) {
        const combinedDateTime = new Date(`${date}T${time}`);
        setCampaignData({ ...campaignData, scheduled_at: combinedDateTime.toISOString() });
      }
    }
  }, [scheduleType, date, time]);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800">Programa el Envío</h2>
      <p className="text-gray-500 mt-1">Define cuándo se enviará la campaña.</p>

      <div className="mt-8 space-y-6">
        {/* --- Opciones de Envío --- */}
        <div className="space-y-4">
          <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="scheduleType"
              value="immediate"
              checked={scheduleType === 'immediate'}
              onChange={(e) => setScheduleType(e.target.value)}
              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="ml-3 text-sm font-medium text-gray-800">Envío Inmediato</span>
          </label>
          <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="scheduleType"
              value="scheduled"
              checked={scheduleType === 'scheduled'}
              onChange={(e) => setScheduleType(e.target.value)}
              className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="ml-3 text-sm font-medium text-gray-800">Envío Programado</span>
          </label>
        </div>

        {/* --- Campos de Fecha y Hora (si está programado) --- */}
        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${scheduleType === 'scheduled' ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
              <input
                type="time"
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step4_Scheduling;

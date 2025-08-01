import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTemplateById, getTemplateVariables, createTemplate } from '../services/api';

const TemplateEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState({
    name: '',
    channel_type: 'SMS',
    content: '',
    subject: ''
  });
  const [variables, setVariables] = useState([]);
  const [loading, setLoading] = useState(true);
  const contentRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vars = await getTemplateVariables();
        setVariables(vars);

        if (id) {
          const existingTemplate = await getTemplateById(id);
          setTemplate({
            name: `Copia de ${existingTemplate.name}`,
            channel_type: existingTemplate.channel_type,
            content: existingTemplate.content,
            subject: existingTemplate.subject || ''
          });
        }
      } catch (error) {
        console.error("Error al cargar los datos de la plantilla:", error);
        alert("No se pudieron cargar los datos necesarios.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleDragStart = (e, variableName) => {
    e.dataTransfer.setData("text/plain", `{${variableName}}`);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const variable = e.dataTransfer.getData("text/plain");
    const { selectionStart, selectionEnd, value } = contentRef.current;
    const newContent = value.substring(0, selectionStart) + variable + value.substring(selectionEnd);
    setTemplate(prev => ({ ...prev, content: newContent }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTemplate(template);
      alert("Plantilla guardada con éxito.");
      navigate('/templates');
    } catch (error) {
      alert(`Error al guardar la plantilla: ${error.message}`);
    }
  };

  if (loading) return <div className="p-8">Cargando editor...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{id ? 'Editar Plantilla (Guardar como Nueva)' : 'Crear Nueva Plantilla'}</h1>
            <p className="text-gray-500">Diseña tu mensaje y arrastra las variables que necesites.</p>
          </div>
          <button onClick={() => navigate('/templates')} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100">
            Volver
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre de la Plantilla</label>
              <input type="text" id="name" value={template.name} onChange={e => setTemplate({...template, name: e.target.value})} required className="mt-1 w-full p-2 border rounded-md" />
            </div>
            <div>
              <label htmlFor="channel" className="block text-sm font-medium text-gray-700">Canal</label>
              <select id="channel" value={template.channel_type} onChange={e => setTemplate({...template, channel_type: e.target.value})} className="mt-1 w-full p-2 border rounded-md bg-white">
                <option value="SMS">SMS</option>
                <option value="WHATSAPP">WhatsApp</option>
                <option value="EMAIL">Email</option>
              </select>
            </div>
          </div>

          {template.channel_type === 'EMAIL' && (
            <div className="mb-6">
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Asunto</label>
              <input type="text" id="subject" value={template.subject} onChange={e => setTemplate({...template, subject: e.target.value})} className="mt-1 w-full p-2 border rounded-md" />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">Contenido del Mensaje</label>
              <textarea
                id="content"
                ref={contentRef}
                value={template.content}
                onChange={e => setTemplate({...template, content: e.target.value})}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                rows="10"
                className="mt-1 w-full p-2 border rounded-md"
                placeholder="Escribe tu mensaje aquí y arrastra las variables desde la derecha."
              ></textarea>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">Variables Disponibles</h3>
              <div className="mt-2 border rounded-md p-2 h-64 overflow-y-auto bg-gray-50">
                {variables.map(v => (
                  <div
                    key={v.variable_name}
                    draggable
                    onDragStart={(e) => handleDragStart(e, v.variable_name)}
                    className="p-2 my-1 bg-white border rounded cursor-grab hover:bg-blue-50"
                    title={v.description}
                  >
                    {`{${v.variable_name}}`}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              Guardar Plantilla
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TemplateEditorPage;

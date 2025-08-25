import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

// --- Iconos para el menú ---
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z" /></svg>;
const DuplicateIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
const PreviewIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
// -------------------------

const TemplateActionMenu = ({ template, onDuplicate, onPreview, onReview }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const [isUpwards, setIsUpwards] = useState(false);
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/templates/${template?.id}/edit`);
    setIsOpen(false);
  };

  const handleDuplicate = () => {
    if (typeof onDuplicate === 'function') {
      onDuplicate(template);
    } else {
      console.warn('onDuplicate no es una función válida:', onDuplicate);
    }
    setIsOpen(false);
  };

  const handlePreview = () => {
    // Solo intentamos abrir el preview si la prop es una función válida
    if (typeof onPreview === 'function') {
      onPreview(template);
      setIsOpen(false);
    } else {
      // Silenciamos ejecución adicional; mantenemos un warning leve solo en modo desarrollo.
      if (process.env.NODE_ENV !== 'production') {
        console.warn('onPreview no es una función válida (se ocultará la opción en el menú). Valor recibido:', onPreview);
      }
    }
  };

  const handleReview = () => {
    if (typeof onReview === 'function') {
      onReview(template);
    } else {
      console.warn('onReview no es una función válida:', onReview);
    }
    setIsOpen(false);
  };

  // Cierra el menú si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setIsUpwards(spaceBelow < 120); // 120 is an estimate of the menu height
    }
    setIsOpen(!isOpen);
  };

  // Determina si se debe mostrar la acción de previsualizar
  const hasPreview = typeof onPreview === 'function';

  return (
    <div className="relative" ref={menuRef}>
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className="text-gray-500 hover:text-blue-600 font-bold p-2 rounded-full focus:outline-none"
      >
        •••
      </button>

      {isOpen && (
        <div className={`absolute right-0 w-56 bg-white rounded-md shadow-lg z-20 border ${isUpwards ? 'bottom-full mb-2' : 'mt-2'}`}>
          <ul className="py-1">
            <li>
              <button
                onClick={handleEdit}
                className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <EditIcon />
                Editar Plantilla
              </button>
            </li>
            <li>
              <button
                onClick={handleDuplicate}
                className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <DuplicateIcon />
                Duplicar Plantilla
              </button>
            </li>
            {hasPreview && (
              <li>
                <button
                  onClick={handlePreview}
                  className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <PreviewIcon />
                  Visualizar Plantilla
                </button>
              </li>
            )}
            {template.status === 'PENDING_INTERNAL_APPROVAL' && (
              <li>
                <button
                  onClick={handleReview}
                  className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                  Revisar Plantilla
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TemplateActionMenu;

// PropTypes para validar las props y evitar errores de ejecución
TemplateActionMenu.propTypes = {
  template: PropTypes.object.isRequired,
  onDuplicate: PropTypes.func,
  onPreview: PropTypes.func,
  onReview: PropTypes.func,
};

// Valores por defecto: onPreview queda null para detectar si falta implementación
TemplateActionMenu.defaultProps = {
  onDuplicate: () => {},
  onPreview: undefined, // Si no se pasa, se oculta la opción
  onReview: () => {},
};

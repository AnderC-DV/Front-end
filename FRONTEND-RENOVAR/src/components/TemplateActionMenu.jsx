import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// --- Iconos para el menú ---
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z" /></svg>;
const DuplicateIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
// -------------------------

const TemplateActionMenu = ({ template, onDuplicate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const [isUpwards, setIsUpwards] = useState(false);
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/templates/${template.id}/edit`);
    setIsOpen(false);
  };

  const handleDuplicate = () => {
    onDuplicate(template);
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
          </ul>
        </div>
      )}
    </div>
  );
};

export default TemplateActionMenu;

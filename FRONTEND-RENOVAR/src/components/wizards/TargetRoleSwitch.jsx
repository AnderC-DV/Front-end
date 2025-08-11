import React from 'react';

const TargetRoleSwitch = ({ selectedRole, onRoleChange }) => {
  const roles = [
    { id: 'DEUDOR', name: 'Deudor' },
    { id: 'CODEUDOR', name: 'Codeudor' },
  ];

  const getButtonClasses = (role) => {
    const baseClasses = "flex-1 py-2 px-4 text-sm font-medium transition-colors duration-200 focus:outline-none";
    if (selectedRole === role) {
      return `${baseClasses} bg-blue-600 text-white rounded-lg shadow`;
    }
    return `${baseClasses} bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-lg`;
  };

  return (
    <div className="mt-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        ¿A quién va dirigida esta campaña?
      </label>
      <div className="flex bg-gray-100 rounded-lg p-1 space-x-1">
        {roles.map((role) => (
          <button
            key={role.id}
            type="button"
            onClick={() => onRoleChange(role.id)}
            className={getButtonClasses(role.id)}
          >
            {role.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TargetRoleSwitch;

import React from 'react';

/*
  Componente multi-select de roles.
  Props nuevas:
    selectedRoles: array ['DEUDOR'] | ['CODEUDOR'] | ['DEUDOR','CODEUDOR']
    onChange: (rolesArray) => void
  Compatibilidad retro:
    selectedRole / onRoleChange todavía funcionan (internamente se adaptan).
  Lógica envío:
    Si ambos => se sugiere enviar target_role = 'BOTH' en el payload (el backend debe soportarlo).
*/

const ROLES = [
  { id: 'DEUDOR', name: 'Deudor' },
  { id: 'CODEUDOR', name: 'Codeudor' },
];

const STRATEGIES = [
  { id: 'FIRST', name: 'Enviar al primero que se encuentre' },
  { id: 'ALL', name: 'Enviar a todos los que se encuentren' },
];

const TargetRoleSwitch = ({ selectedRoles, onChange, codebtorStrategy, onCodebtorStrategyChange }) => {
  const effectiveRoles = React.useMemo(() => {
    if (Array.isArray(selectedRoles) && selectedRoles.length) return selectedRoles;
    return ['DEUDOR'];
  }, [selectedRoles]);

  const emitRoles = (next) => {
    if (onChange) onChange(next);
  };

  const toggle = (roleId) => {
    const next = [roleId]; // Siempre selecciona solo uno
    emitRoles(next);
  };

  const showStrategySelector = effectiveRoles.includes('CODEUDOR');

  const getButtonClasses = (active) => {
    const base = 'flex-1 py-2 px-4 text-sm font-medium transition-colors duration-200 focus:outline-none rounded-lg';
    return active ? `${base} bg-blue-600 text-white shadow` : `${base} bg-gray-200 text-gray-700 hover:bg-gray-300`;
  };

  return (
    <div className="mt-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        ¿A quién va dirigida esta campaña?
      </label>
      <div className="flex bg-gray-100 rounded-lg p-1 space-x-1">
        {ROLES.map(role => (
          <button
            key={role.id}
            type="button"
            onClick={() => toggle(role.id)}
            className={getButtonClasses(effectiveRoles.includes(role.id))}
          >
            {role.name}
          </button>
        ))}
      </div>
      
      {showStrategySelector && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estrategia para Codeudores
          </label>
          <select
            value={codebtorStrategy || ''}
            onChange={(e) => onCodebtorStrategyChange(e.target.value)}
            className="w-full p-2 border rounded-md bg-white"
          >
            <option value="" disabled>Selecciona una estrategia</option>
            {STRATEGIES.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      )}

      <p className="mt-2 text-xs text-gray-500">
        Valor que se enviará: {effectiveRoles[0]}.
      </p>
    </div>
  );
};

export default TargetRoleSwitch;

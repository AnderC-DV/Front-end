import React, { useState } from 'react';

const PolicyEditor = ({ onInsert }) => {
  const policyTerms = [
    'Contado',
    '2 - 6 meses',
    '7 - 12 meses',
    '13 - 24 meses',
    '25 - 36 meses',
    '>36 meses'
  ];
  const [selectedTerm, setSelectedTerm] = useState(policyTerms[0]);

  const handleInsertPolicy = () => {
    onInsert(`{politica_plazo:"${selectedTerm}"}`);
  };

  return (
    <div className="flex items-center space-x-4">
      <button
        type="button"
        onClick={handleInsertPolicy}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Agregar Política
      </button>
      <div className="flex items-center">
        <label htmlFor="policy-term" className="mr-2 text-sm font-medium text-gray-700">
          Plazo para pagar
        </label>
        <select
          id="policy-term"
          value={selectedTerm}
          onChange={(e) => setSelectedTerm(e.target.value)}
          className="p-2 border rounded-md bg-white"
        >
          {policyTerms.map(term => (
            <option key={term} value={term}>{term}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default PolicyEditor;

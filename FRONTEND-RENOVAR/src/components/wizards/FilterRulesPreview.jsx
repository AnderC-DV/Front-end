import React from 'react';
import { segmentationOperators } from './segmentationUtils';

const FilterRulesPreview = ({ rules }) => {
  if (!rules || rules.length === 0) {
    return <p className="text-xs text-gray-500 italic mt-1">No se han definido reglas para esta audiencia.</p>;
  }

  const getOperatorName = (operatorId) => {
    const operator = segmentationOperators.find(o => o.id === operatorId);
    return operator ? operator.name : operatorId;
  };

  return (
    <div className="mt-2 space-y-1">
      {rules.map((rule, index) => (
        <div key={index} className="text-xs text-gray-600 bg-gray-50 p-1.5 rounded-md flex items-center">
          <span className="font-semibold bg-gray-200 text-gray-800 px-2 py-0.5 rounded-md mr-2">{rule.field_name}</span>
          <span className="font-medium text-blue-600 mr-2">{getOperatorName(rule.operator)}</span>
          <span className="italic text-gray-800 truncate">{rule.value}</span>
        </div>
      ))}
    </div>
  );
};

export default FilterRulesPreview;

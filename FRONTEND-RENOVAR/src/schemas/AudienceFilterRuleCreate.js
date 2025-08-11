/**
 * @class AudienceFilterRuleCreate
 * @description Represents the schema for creating a single rule within an audience filter.
 */
class AudienceFilterRuleCreate {
  /**
   * @param {string} field_name - The name of the field to filter on.
   * @param {string} operator - The comparison operator (e.g., 'EQ', 'GT', 'CONTAINS').
   * @param {string} value - The value to compare against.
   */
  constructor(field_name, operator, value) {
    if (!field_name || typeof field_name !== 'string' || field_name.trim() === '') {
      throw new Error("Rule 'field_name' must be a non-empty string.");
    }
    if (!operator || typeof operator !== 'string' || operator.trim() === '') {
      throw new Error("Rule 'operator' must be a non-empty string.");
    }
    if (value === null || value === undefined || typeof value !== 'string') {
      throw new Error("Rule 'value' must be a string.");
    }

    this.field_name = field_name;
    this.operator = operator;
    this.value = value;
  }
}

export default AudienceFilterRuleCreate;

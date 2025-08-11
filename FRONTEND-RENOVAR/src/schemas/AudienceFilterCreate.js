import AudienceFilterRuleCreate from './AudienceFilterRuleCreate.js';

/**
 * @class AudienceFilterCreate
 * @description Represents the schema for creating a new audience filter.
 */
class AudienceFilterCreate {
  /**
   * @param {string} name - The name of the filter (must be between 3 and 100 characters).
   * @param {Array<object>} rules - An array of rule objects ({ field_name, operator, value }).
   * @param {string|null} [description=null] - An optional description for the filter.
   */
  constructor(name, rules, description = null) {
    if (!name || typeof name !== 'string' || name.length < 3 || name.length > 100) {
      throw new Error("Filter name must be a string between 3 and 100 characters.");
    }
    if (!Array.isArray(rules) || rules.length === 0) {
      throw new Error("Filter must have at least one rule.");
    }

    this.name = name;
    this.rules = rules.map(r => new AudienceFilterRuleCreate(r.field_name, r.operator, r.value));
    
    if (description !== null && typeof description === 'string' && description.trim() !== '') {
      this.description = description;
    }
  }
}

export default AudienceFilterCreate;

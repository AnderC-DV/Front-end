import TemplateCreateWhatsApp from './TemplateCreateWhatsApp.js';

/**
 * @class TemplateCreateWhatsApp_PromoBodyOnly
 * @description Represents a WhatsApp template with only a body component and no variables.
 */
class TemplateCreateWhatsApp_PromoBodyOnly extends TemplateCreateWhatsApp {
  constructor() {
    const name = "promo_body_only";
    const meta_template_name = "promo_body_only";
    const category = "MARKETING";
    const components = {
      body: {
        text: "Hola, tenemos promociones disponibles esta semana."
      }
    };
    super(name, meta_template_name, category, components);
  }
}

export default TemplateCreateWhatsApp_PromoBodyOnly;

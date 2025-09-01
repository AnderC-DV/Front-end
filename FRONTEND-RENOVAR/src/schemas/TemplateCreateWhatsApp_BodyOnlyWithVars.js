import TemplateCreateWhatsApp from './TemplateCreateWhatsApp.js';

/**
 * @class TemplateCreateWhatsApp_BodyOnlyWithVars
 * @description Represents a WhatsApp template with only a body component and variables.
 */
class TemplateCreateWhatsApp_BodyOnlyWithVars extends TemplateCreateWhatsApp {
  constructor() {
    const name = "body_only_with_vars";
    const meta_template_name = "body_only_with_vars";
    const category = "UTILITY";
    const components = {
      body: {
        text: "Hola {nombre}, tu pedido #{numero_pedido} está listo.",
        example: {
          body_text: [
            ["Ana", "566701"]
          ]
        }
      }
    };
    super(name, meta_template_name, category, components);
  }
}

export default TemplateCreateWhatsApp_BodyOnlyWithVars;

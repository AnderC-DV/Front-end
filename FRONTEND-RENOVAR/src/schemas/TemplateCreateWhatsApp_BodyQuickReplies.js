import TemplateCreateWhatsApp from './TemplateCreateWhatsApp.js';

/**
 * @class TemplateCreateWhatsApp_BodyQuickReplies
 * @description Represents a WhatsApp template with a body and quick reply buttons.
 */
class TemplateCreateWhatsApp_BodyQuickReplies extends TemplateCreateWhatsApp {
  constructor() {
    const name = "body_quick_replies";
    const meta_template_name = "body_quick_replies";
    const category = "MARKETING";
    const components = {
      body: {
        text: "¿Deseas recibir más promociones?"
      },
      buttons: [{
        type: "QUICK_REPLY",
        text: "Sí, quiero"
      }, {
        type: "QUICK_REPLY",
        text: "No, gracias"
      }]
    };
    super(name, meta_template_name, category, components);
  }
}

export default TemplateCreateWhatsApp_BodyQuickReplies;

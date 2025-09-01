import TemplateCreateWhatsApp from './TemplateCreateWhatsApp.js';

/**
 * @class TemplateCreateWhatsApp_BodyFooter
 * @description Represents a WhatsApp template with body and footer components.
 */
class TemplateCreateWhatsApp_BodyFooter extends TemplateCreateWhatsApp {
  constructor() {
    const name = "body_footer";
    const meta_template_name = "body_footer";
    const category = "MARKETING";
    const components = {
      body: {
        text: "Recuerda visitar nuestra tienda para más novedades."
      },
      footer: {
        text: "Responde STOP para dejar de recibir mensajes"
      }
    };
    super(name, meta_template_name, category, components);
  }
}

export default TemplateCreateWhatsApp_BodyFooter;

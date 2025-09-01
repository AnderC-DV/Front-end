import TemplateCreateWhatsApp from './TemplateCreateWhatsApp.js';

/**
 * @class TemplateCreateWhatsApp_HeaderImageBody
 * @description Represents a WhatsApp template with an image header and body component.
 */
class TemplateCreateWhatsApp_HeaderImageBody extends TemplateCreateWhatsApp {
  constructor() {
    const name = "header_image_body";
    const meta_template_name = "header_image_body";
    const category = "MARKETING";
    const components = {
      header: {
        format: "IMAGE",
        gcs_object_name: "whatsapp/123/media/abc123.jpg"
      },
      body: {
        text: "Hola {nombre}, mira la imagen de nuestra nueva colección.",
        example: {
          body_text: [
            ["Marcos"]
          ]
        }
      }
    };
    super(name, meta_template_name, category, components);
  }
}

export default TemplateCreateWhatsApp_HeaderImageBody;

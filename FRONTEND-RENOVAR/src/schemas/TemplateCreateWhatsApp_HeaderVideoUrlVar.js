import TemplateCreateWhatsApp from './TemplateCreateWhatsApp.js';

/**
 * @class TemplateCreateWhatsApp_HeaderVideoUrlVar
 * @description Represents a WhatsApp template with a video header, body, and a URL button with a variable.
 */
class TemplateCreateWhatsApp_HeaderVideoUrlVar extends TemplateCreateWhatsApp {
  constructor() {
    const name = "header_video_url_var";
    const meta_template_name = "header_video_url_var";
    const category = "MARKETING";
    const components = {
      header: {
        format: "VIDEO",
        gcs_object_name: "whatsapp/123/media/campania.mp4",
        file_name: "campania.mp4",
        mime_type: "video/mp4"
      },
      body: {
        text: "Hola {nombre}, mira el video de la campaña de {temporada}.",
        example: {
          body_text: [
            ["Diana", "verano"]
          ]
        }
      },
      buttons: [{
        type: "URL",
        text: "Ver promo",
        url: "https://www.example.com/promo?code={{1}}",
        example: ["SUMMER2025"]
      }]
    };
    super(name, meta_template_name, category, components);
  }
}

export default TemplateCreateWhatsApp_HeaderVideoUrlVar;

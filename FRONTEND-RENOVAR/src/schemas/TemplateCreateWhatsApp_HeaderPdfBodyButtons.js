import TemplateCreateWhatsApp from './TemplateCreateWhatsApp.js';

/**
 * @class TemplateCreateWhatsApp_HeaderPdfBodyButtons
 * @description Represents a WhatsApp template with a document header, body, and buttons.
 */
class TemplateCreateWhatsApp_HeaderPdfBodyButtons extends TemplateCreateWhatsApp {
  constructor() {
    const name = "header_pdf_body_buttons";
    const meta_template_name = "header_pdf_body_buttons";
    const category = "UTILITY";
    const components = {
      header: {
        format: "DOCUMENT",
        gcs_object_name: "whatsapp/123/media/recibo_2025.pdf",
        file_name: "recibo_2025.pdf",
        mime_type: "application/pdf"
      },
      body: {
        text: "Hola {nombre}, tu comprobante está en el documento adjunto.",
        example: {
          body_text: [
            ["Paula"]
          ]
        }
      },
      buttons: [{
        type: "URL",
        text: "Soporte",
        url: "https://www.example.com/support"
      }, {
        type: "PHONE_NUMBER",
        text: "Llamar",
        phone_number: "15550051310"
      }]
    };
    super(name, meta_template_name, category, components);
  }
}

export default TemplateCreateWhatsApp_HeaderPdfBodyButtons;

import TemplateCreateWhatsApp from './TemplateCreateWhatsApp.js';

/**
 * @class TemplateCreateWhatsApp_HeaderBodyFooterText
 * @description Represents a WhatsApp template with text header, body, and footer components, with variables.
 */
class TemplateCreateWhatsApp_HeaderBodyFooterText extends TemplateCreateWhatsApp {
  constructor() {
    const name = "header_body_footer_text";
    const meta_template_name = "header_body_footer_text";
    const category = "MARKETING";
    const components = {
      header: {
        format: "TEXT",
        text: "Oferta por tiempo limitado: {fecha_fin}",
        example: {
          header_text: [
            ["31 de Agosto"]
          ]
        }
      },
      body: {
        text: "Hola {nombre}, usa el código {codigo} y ahorra {porcentaje}.",
        example: {
          body_text: [
            ["Lucía", "AHORRA25", "25%"]
          ]
        }
      },
      footer: {
        text: "Aplica términos y condiciones"
      }
    };
    super(name, meta_template_name, category, components);
  }
}

export default TemplateCreateWhatsApp_HeaderBodyFooterText;

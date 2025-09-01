import TemplateCreateWhatsApp from './TemplateCreateWhatsApp.js';

/**
 * @class TemplateCreateWhatsApp_FullInteractiveTemplate
 * @description Represents a complete interactive WhatsApp template with text header, body, footer, and various button types.
 */
class TemplateCreateWhatsApp_FullInteractiveTemplate extends TemplateCreateWhatsApp {
  constructor() {
    const name = "full_interactive_template";
    const meta_template_name = "full_interactive_template_2";
    const category = "MARKETING";
    const components = {
      header: {
        format: "TEXT",
        text: "¡Hola {nombre_deudor}!",
        example: {
          header_text: [
            ["Carlos"]
          ]
        }
      },
      body: {
        text: "Aprovecha {porcentaje_ltv} de descuento usando el código {sistema_origen} antes de {fecha_importacion}. No te pierdas esta gran oportunidad",
        example: {
          body_text: [
            ["20%", "RENOVA20", "30/09/2025"]
          ]
        }
      },
      footer: {
        text: "Gestiona preferencias con los botones"
      },
      buttons: [{
        type: "QUICK_REPLY",
        text: "Quiero suscribirme"
      }, {
        type: "URL",
        text: "Comprar ahora",
        url: "https://www.example.com/shop?promo={{1}}",
        example: ["RENOVA20"]
      }, {
        type: "PHONE_NUMBER",
        text: "Llamar soporte",
        phone_number: "573059117385"
      }]
    };
    super(name, meta_template_name, category, components);
  }
}

export default TemplateCreateWhatsApp_FullInteractiveTemplate;

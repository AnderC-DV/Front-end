/**
 * @class TemplateCreateWhatsApp
 * @description Represents the schema for creating a WhatsApp template.
 */
class TemplateCreateWhatsApp {
  /**
   * @param {string} name - The name of the template (must be between 3 and 100 characters).
   * @param {string} meta_template_name - The name of the template in Meta (must be less than or equal to 512 characters and match ^[a-z0-9_]+$).
   * @param {string} category - The category of the template (must be one of "AUTHENTICATION", "MARKETING", or "UTILITY").
   * @param {object} components - The components of the template.
   * @param {object} [components.header] - Optional header component.
   * @param {string} [components.header.format] - Format of the header (TEXT, IMAGE, DOCUMENT, VIDEO).
   * @param {string} [components.header.text] - Text for TEXT header format.
   * @param {string} [components.header.gcs_object_name] - GCS object name for media headers.
   * @param {string} [components.header.file_name] - File name for DOCUMENT/VIDEO headers.
   * @param {string} [components.header.mime_type] - Mime type for DOCUMENT/VIDEO headers.
   * @param {object} [components.body] - Optional body component.
   * @param {string} [components.body.text] - Text for the body.
   * @param {object} [components.footer] - Optional footer component.
   * @param {string} [components.footer.text] - Text for the footer.
   * @param {Array<object>} [components.buttons] - Optional array of button components.
   */
  constructor(name, meta_template_name, category, components) {
    if (name.length < 3 || name.length > 100) {
      throw new Error("Template name must be between 3 and 100 characters.");
    }
    if (meta_template_name.length > 512 || !/^[a-z0-9_]+$/.test(meta_template_name)) {
      throw new Error("Meta template name is invalid.");
    }
    if (!["AUTHENTICATION", "MARKETING", "UTILITY"].includes(category)) {
      throw new Error("Invalid template category.");
    }

    this.name = name;
    this.channel_type = 'WHATSAPP';
    this.meta_template_name = meta_template_name;
    this.category = category;
    this.components = components;

    this.validateComponents(components);
  }

  /**
   * Validates the structure and content of the components object.
   * @param {object} components - The components object to validate.
   */
  validateComponents(components) {
    if (!components) {
      throw new Error("Components object is required.");
    }

    // Validate Body
    if (components.body) {
      if (typeof components.body.text !== 'string' || components.body.text.trim() === '') {
        throw new Error("Body text is required for the body component.");
      }
    }

    // Validate Footer
    if (components.footer) {
      if (typeof components.footer.text !== 'string' || components.footer.text.trim() === '') {
        throw new Error("Footer text is required for the footer component.");
      }
    }

    // Validate Header
    if (components.header) {
      if (!components.header.format) {
        throw new Error("Header format is required for the header component.");
      }
      const validHeaderFormats = ["TEXT", "IMAGE", "DOCUMENT", "VIDEO"];
      if (!validHeaderFormats.includes(components.header.format)) {
        throw new Error("Invalid header format. Must be one of TEXT, IMAGE, DOCUMENT, VIDEO.");
      }

      if (components.header.format === "TEXT") {
        if (typeof components.header.text !== 'string' || components.header.text.trim() === '') {
          throw new Error("Header text is required for TEXT header format.");
        }
      } else if (["IMAGE", "DOCUMENT", "VIDEO"].includes(components.header.format)) {
        if (typeof components.header.gcs_object_name !== 'string' || components.header.gcs_object_name.trim() === '') {
          throw new Error("GCS object name is required for media headers (IMAGE, DOCUMENT, VIDEO).");
        }
        if (components.header.format === "DOCUMENT" || components.header.format === "VIDEO") {
          if (typeof components.header.file_name !== 'string' || components.header.file_name.trim() === '') {
            throw new Error("File name is required for DOCUMENT/VIDEO headers.");
          }
          if (typeof components.header.mime_type !== 'string' || components.header.mime_type.trim() === '') {
            throw new Error("Mime type is required for DOCUMENT/VIDEO headers.");
          }
        }
      }
    }

    // Validate Buttons
    if (components.buttons) {
      if (!Array.isArray(components.buttons)) {
        throw new Error("Buttons must be an array.");
      }
      components.buttons.forEach(button => {
        if (!button.type || !button.text) {
          throw new Error("Button type and text are required for each button.");
        }
        const validButtonTypes = ["QUICK_REPLY", "URL", "PHONE_NUMBER"];
        if (!validButtonTypes.includes(button.type)) {
          throw new Error("Invalid button type. Must be one of QUICK_REPLY, URL, PHONE_NUMBER.");
        }
        if (button.type === "URL" && (typeof button.url !== 'string' || button.url.trim() === '')) {
          throw new Error("URL is required for URL button type.");
        }
        if (button.type === "PHONE_NUMBER" && (typeof button.phone_number !== 'string' || button.phone_number.trim() === '')) {
          throw new Error("Phone number is required for PHONE_NUMBER button type.");
        }
      });
    }
  }
}

export default TemplateCreateWhatsApp;

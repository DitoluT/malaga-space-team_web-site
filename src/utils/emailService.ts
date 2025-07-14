import emailjs from '@emailjs/browser';

// EmailJS configuration
const EMAILJS_CONFIG = {
  serviceId: "service_2iu77at",
  templateId: "template_cpxlc8r",
  publicKey: "8HrjK7cb_trVMfQ6g"
};

// Email data interface for consistent typing
export interface EmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Initialize EmailJS with public key
export const initializeEmailJS = (): void => {
  try {
    emailjs.init(EMAILJS_CONFIG.publicKey);
    console.log("EmailJS initialized successfully");
  } catch (error) {
    console.error("Error initializing EmailJS:", error);
  }
};

// Send email using EmailJS
export const sendEmail = async (formElement: HTMLFormElement): Promise<void> => {
  try {
    // Validate configuration
    if (!EMAILJS_CONFIG.serviceId || !EMAILJS_CONFIG.templateId || !EMAILJS_CONFIG.publicKey) {
      throw new Error('EmailJS configuration is missing');
    }

    const result = await emailjs.sendForm(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      formElement,
      EMAILJS_CONFIG.publicKey
    );

    if (result.status !== 200) {
      throw new Error(`EmailJS returned status: ${result.status}`);
    }

    console.log("Email sent successfully:", result);
  } catch (error) {
    console.error("EmailJS error:", error);
    throw error instanceof Error ? error : new Error('Failed to send email');
  }
};

// Alternative method for sending email with form data object
export const sendEmailWithData = async (emailData: EmailData): Promise<void> => {
  try {
    // Validate configuration
    if (!EMAILJS_CONFIG.serviceId || !EMAILJS_CONFIG.templateId || !EMAILJS_CONFIG.publicKey) {
      throw new Error('EmailJS configuration is missing');
    }

    // Create a temporary form element with the data
    const tempForm = document.createElement('form');
    Object.entries(emailData).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.name = key;
      input.value = value;
      tempForm.appendChild(input);
    });

    const result = await emailjs.sendForm(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      tempForm,
      EMAILJS_CONFIG.publicKey
    );

    if (result.status !== 200) {
      throw new Error(`EmailJS returned status: ${result.status}`);
    }

    console.log("Email sent successfully:", result);
  } catch (error) {
    console.error("EmailJS error:", error);
    throw error instanceof Error ? error : new Error('Failed to send email');
  }
};

// Get EmailJS configuration (for debugging/logging purposes)
export const getEmailJSConfig = () => {
  return {
    serviceId: EMAILJS_CONFIG.serviceId,
    templateId: EMAILJS_CONFIG.templateId,
    // Don't expose the public key in logs
    hasPublicKey: !!EMAILJS_CONFIG.publicKey
  };
};
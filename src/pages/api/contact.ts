import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { name, email, subject, message } = data;

    // Validación básica
    if (!name || !email || !subject || !message) {
      return new Response(JSON.stringify({ error: 'All fields are required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Aquí puedes implementar el envío de email usando:
    // 1. Servicio SMTP con nodemailer
    // 2. API de terceros como SendGrid, Mailgun, etc.
    // 3. Función serverless
    
    // Por ahora, retornamos success y logeamos los datos
    console.log('Contact form submission:', { name, email, subject, message });
    
    // En producción, aquí enviarías el email a spaceteam@uma.es
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Form received. Email functionality needs to be configured with your preferred email service.' 
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
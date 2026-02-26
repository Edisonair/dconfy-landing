import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const data = await request.json();
        const { company, name, email, profiles, message } = data;

        // 1. Email para ti (Aviso a info@dconfy.io)
        await resend.emails.send({
            from: 'dconfy <info@dconfy.io>',
            to: 'info@dconfy.io',
            subject: `🔥 Nueva solicitud de Plan Empresa: ${company}`,
            html: `
        <h2>Nueva solicitud de Plan Empresa</h2>
        <p><strong>Empresa:</strong> ${company}</p>
        <p><strong>Contacto:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Perfiles:</strong> ${profiles}</p>
        <p><strong>Mensaje:</strong> ${message || 'No especificado'}</p>
      `,
        });

        // 2. Email automático para el cliente (Diseño Premium)
        await resend.emails.send({
            from: 'dconfy <info@dconfy.io>',
            to: email,
            subject: 'Hemos recibido tu solicitud - dconfy',
            html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FFF9F0; padding: 40px 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);">
            
            <div style="text-align: center; padding: 32px 20px; border-bottom: 1px solid #f1f5f9;">
              <img src="https://dconfy.io/dconfy_logo.png" alt="dconfy logo" style="height: 40px; width: auto;" />
            </div>
            
            <div style="padding: 40px 32px;">
              <h2 style="color: #111827; font-size: 24px; font-weight: 900; margin-top: 0; letter-spacing: -0.5px;">¡Hola, ${name}! 👋</h2>
              <p style="color: #475569; font-size: 16px; line-height: 1.6;">Hemos recibido correctamente tu solicitud para el Plan Empresa de <strong>${company}</strong>.</p>
              <p style="color: #475569; font-size: 16px; line-height: 1.6;">Nuestro equipo ya está analizando tus datos. Nos pondremos en contacto contigo en las próximas 24 horas para darte acceso y comentar los siguientes pasos.</p>
              
              <div style="margin-top: 32px; padding: 20px; background-color: #fff7ed; border-radius: 12px; border-left: 4px solid #F97316;">
                <p style="color: #c2410c; font-size: 14px; margin: 0; font-weight: 500;">
                  ¿Tienes alguna duda urgente? Responde directamente a este correo y te atenderemos enseguida.
                </p>
              </div>
            </div>
            
            <div style="background-color: #171A21; padding: 24px; text-align: center;">
              <p style="color: #8C98A9; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} dconfy. Todos los derechos reservados.</p>
            </div>
            
          </div>
        </div>
      `,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error enviando email:', error);
        return NextResponse.json({ error: 'Error enviando email' }, { status: 500 });
    }
}
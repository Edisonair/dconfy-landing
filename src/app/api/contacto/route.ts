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

        // 2. Email automático para el cliente (Diseño Premium Oscuro Forzado)
        await resend.emails.send({
            from: 'dconfy <info@dconfy.io>',
            to: email,
            subject: 'Hemos recibido tu solicitud - dconfy',
            html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0B0D12; padding: 40px 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #171A21; border-radius: 24px; overflow: hidden; border: 1px solid #2A2F3D; box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);">
            
            <div style="text-align: center; padding: 32px 20px; border-bottom: 1px solid #2A2F3D;">
              <img src="https://dconfy.io/dconfy_logo_dark.png" alt="dconfy logo" style="height: 40px; width: auto; display: block; margin: 0 auto;" />
            </div>
            
            <div style="padding: 40px 32px;">
              <h2 style="color: #FFFFFF; font-size: 24px; font-weight: 900; margin-top: 0; letter-spacing: -0.5px;">¡Hola, ${name}! 👋</h2>
              <p style="color: #94A3B8; font-size: 16px; line-height: 1.6;">Hemos recibido correctamente tu solicitud para el Plan Empresa de <strong style="color: #E2E8F0;">${company}</strong>.</p>
              <p style="color: #94A3B8; font-size: 16px; line-height: 1.6;">Nuestro equipo ya está analizando tus datos. Nos pondremos en contacto contigo en las próximas 24 horas para darte acceso y comentar los siguientes pasos.</p>
              
              <div style="margin-top: 32px; padding: 20px; background-color: rgba(249, 115, 22, 0.1); border-radius: 12px; border-left: 4px solid #F97316;">
                <p style="color: #FDBA74; font-size: 14px; margin: 0; font-weight: 500;">
                  ¿Tienes alguna duda urgente? Responde directamente a este correo y te atenderemos enseguida.
                </p>
              </div>
            </div>
            
            <div style="background-color: #0B0D12; padding: 24px; text-align: center;">
              <p style="color: #475569; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} dconfy. Todos los derechos reservados.</p>
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
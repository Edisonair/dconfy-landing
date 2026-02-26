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

        // 2. Email automático para el cliente
        await resend.emails.send({
            from: 'dconfy <info@dconfy.io>',
            to: email,
            subject: 'Hemos recibido tu solicitud - dconfy',
            html: `
        <h2>¡Hola, ${name}!</h2>
        <p>Hemos recibido correctamente tu solicitud para el Plan Empresa de <strong>${company}</strong>.</p>
        <p>Nuestro equipo está revisando tus datos y nos pondremos en contacto contigo en las próximas 24 horas para darte acceso y comentar los siguientes pasos.</p>
        <br/>
        <p>Un saludo,</p>
        <p><strong>El equipo de dconfy</strong></p>
      `,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error enviando email:', error);
        return NextResponse.json({ error: 'Error enviando email' }, { status: 500 });
    }
}
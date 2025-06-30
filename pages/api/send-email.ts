import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ message: 'Invalid email' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"ElevIA" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '¡Gracias por agendar una demo con ElevIA!',
      html: `
        <h2>Hola 👋</h2>
        <p>Gracias por tu interés en <strong>ElevIA</strong>.</p>
        <p>En breve uno de nuestros especialistas se pondrá en contacto contigo para agendar una demo personalizada.</p>
        <br />
        <p>🧠 ¡Estamos muy contentos de ayudarte a potenciar tu negocio con inteligencia artificial!</p>
        <p style="color: #888;">— El equipo de ElevIA</p>
      `,
    });

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ message: 'Error sending email' });
  }
}

import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
  service: 'Mailgun',
  auth: {
    user: process.env.MAILGUN_USERNAME,
    pass: process.env.MAILGUN_PASSWORD
  }
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  try {
    const { email, subject, body } = JSON.parse(req.body)
    await transport.sendMail({
      from: email,
      subject: subject,
      html: body,
      to: process.env.MAILGUN_RECEIVER,
    })
    res.status(200).json("Email sent successfully")
  } catch (error: any) {
    res.status(400).json(error?.response?.data)
  }
}
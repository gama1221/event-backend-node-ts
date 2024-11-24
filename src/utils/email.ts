import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); // Loads the .env file

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
export const sendEmail = (to: string, subject: string, text: string, date: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: `
      <html>
        <head>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              color: #333;
              line-height: 1.5;
            }
            .email-container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
              border-radius: 8px;
              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            }
            h1 {
              color: #2d3e50;
            }
            p {
              font-size: 16px;
              color: #555;
            }
            .highlight {
              color: #d9534f;
              font-weight: bold;
            }
            .footer {
              font-size: 14px;
              text-align: center;
              color: #888;
              margin-top: 30px;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <h1>Reminder: ${subject} is happening in one hour!</h1>
            <p>Dear Participant,</p>
            <p>This is a reminder that the <span class="highlight">${subject}</span> is starting in <span class="highlight">one hour</span>.</p>
            <p><strong>Event Description:</strong> ${text}</p>
            <p><strong>Event Time:</strong> ${new Date(date).toLocaleTimeString()}</p>
            <p>We hope to see you there!</p>
            <p>If you have any questions or need assistance, feel free to reach out to us.</p>
            <div class="footer">
              <p>This is an automated email from ${process.env.ORGANIZATION_NAME || 'Baccaum'}.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  return transporter.sendMail(mailOptions);
};


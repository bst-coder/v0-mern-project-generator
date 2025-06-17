import transporter from "../config/email.js"

// Envoyer un email de vérification
const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Vérifiez votre compte PlombierPro",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Bienvenue sur PlombierPro !</h2>
        <p>Merci de vous être inscrit sur notre plateforme.</p>
        <p>Pour activer votre compte, veuillez cliquer sur le lien ci-dessous :</p>
        <a href="${verificationUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Vérifier mon compte
        </a>
        <p style="margin-top: 20px; color: #666;">
          Si vous n'avez pas créé de compte, vous pouvez ignorer cet email.
        </p>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}

// Envoyer un email de notification de rendez-vous
const sendAppointmentNotification = async (email, appointment) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Nouveau rendez-vous - PlombierPro",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Nouveau rendez-vous</h2>
        <p><strong>Service :</strong> ${appointment.service}</p>
        <p><strong>Date :</strong> ${new Date(appointment.scheduledDate).toLocaleDateString("fr-FR")}</p>
        <p><strong>Adresse :</strong> ${appointment.address.street}, ${appointment.address.city}</p>
        <p><strong>Description :</strong> ${appointment.description}</p>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}

export { sendVerificationEmail, sendAppointmentNotification }

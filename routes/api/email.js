const express = require("express")
const router = express.Router()
const nodemailer = require("nodemailer")
const validateEmailInput = require("../../validators/email")

const smtpHost = process.env.SMTP_HOST
const smtpUser = process.env.SMTP_USER
const smtpPassword = process.env.SMTP_PASSWORD
const emailReceiver = process.env.EMAIL_RECEIVER

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: 465,
  secure: true,
  pool: true,
  auth: {
    user: smtpUser,
    pass: smtpPassword,
  },
})

transporter.verify((err, success) => {
  if (err) {
    console.warn("Problem z połączeniem z emailem " + err)
  }
})

router.post("/", (req, res) => {
  const { errors, isValid } = validateEmailInput(req.body)

  console.log(req.body)
  if (!isValid) {
    return res
      .status(400)
      .json({ message: "Niepoprawny formularz", err: errors })
  }
  const { email, subject, content, firstName, lastName, phoneNumber } = req.body

  const personalData = `\n Dane osobowe podane w formularzu : <br/> \n Imie: ${firstName} \n <br/> Nazwisko: ${lastName} <br/> \n Numer telefonu: ${phoneNumber} \n <br/> `

  const mailOptions = {
    from: email,
    to: emailReceiver,
    subject: subject,
    text: content + "\n" + personalData,
    html: `<p>${content}</p> \n<br/><br/><br/> <hr/> ${personalData} <hr/>`,
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res
        .status(500)
        .json({ message: "Nie da się wysłać poczty", err: error })
    }

    return res.status(200).json({ message: "Email poprawnie wysłany" })
  })
})

module.exports = router

/* eslint-disable no-undef */
import senderMail = require('@sendgrid/mail')

export const sendMailOfConfirmationCode = (
    emailDestination: string,
    code: string
) => {
    if (process.env.APIKEYSENDGRID) {
        const body = `Welcome to our microblog!, your activation code is: ${code}`
        senderMail.setApiKey(process.env.APIKEYSENDGRID)
        const message = {
            to: emailDestination,
            from: 'edith@ravn.co',
            subject: 'Confirmation email to microblog',
            text: body,
            html: `<p>${body}</p>`,
        }
        try {
            senderMail.send(message).then((response) => {
                console.log(response[0])
            })
        } catch (error) {
            throw new Error(error.message)
        }
    }
}

import nodemailer, {SendMailOptions} from 'nodemailer'
import config from 'config'
import log from './logger'
import i18next from 'i18next'

// async function createTestCreds() {
//     const creds = await nodemailer.createTestAccount();
//     console.log({ creds });
// }

// createTestCreds();

const smtp = config.get<{
    user: string,
    pass: string,
    host: string,
    port: number,
    secure: boolean
}>("smtp")

const transporter = nodemailer.createTransport({
    ...smtp,
    auth: { user: smtp.user, pass: smtp.pass }
})

async function sendEmail(payload: SendMailOptions) {
    transporter.sendMail(payload, (err, info) => {
        if (err) {
            log.error(err, i18next.t('error:email_send_error'))
            return;
        }

        log.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`)
    })
}

export default sendEmail;
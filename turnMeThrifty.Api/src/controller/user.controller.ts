import { debug } from 'console';
import { Request, Response } from 'express'
import i18next from 'i18next';
import { CreateUserInput } from '../schema/user.schema';
import { createUser } from '../service/user.service';
import log from '../utils/logger';
import sendEmail from '../utils/mailer';

export async function createUserHandler(
    req: Request<{}, {}, CreateUserInput>,
    res: Response
) {
    const body = req.body;

    try {

        const user = await createUser(body);
        log.info("user createad -> " + user)
        await sendEmail({
            from: 'test@example.com',
            to: user.email,
            subject: "Please verify your e-mail",
            text: `Verification Code ${user.verificationCode}. Id: ${user._id}`
        });

        return res.send(i18next.t('user:user_create_success'))

    } catch (e: any) {
        if (e.code === 11000) {
            return res.status(409).send(i18next.t('user:account_exists'));
        }

        return res.status(500).send(e);
    }
}
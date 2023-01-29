import { debug } from 'console';
import { Request, Response } from 'express'
import i18next from 'i18next';
import { CreateUserInput, VerifyUserInput } from '../schema/user.schema';
import { createUser, findUserById } from '../service/user.service';
import log from '../utils/logger';
import sendEmail from '../utils/mailer';

export async function createUserHandler(
    req: Request<{}, {}, CreateUserInput>,
    res: Response
) {
    const body = req.body;

    try {

        const user = await createUser(body);

        await sendEmail({
            from: 'test@example.com',
            to: user.email,
            subject: i18next.t('user:verificatione_email_subject'),
            text: `${i18next.t('user:verification_code')} ${user.verificationCode}. Id: ${user._id}`
        });

        return res.send(i18next.t('user:user_create_success'))

    } catch (e: any) {
        if (e.code === 11000) {
            return res.status(409).send(i18next.t('user:account_exists'));
        }

        return res.status(500).send(e);
    }
}

export async function verifyUserHandler(req: Request<VerifyUserInput>, res: Response) {

    try {
        const id = req.params.id;
        const verificationCode = req.params.verificationCode;

        const user = await findUserById(id);

        if (!user) {
            return res.send(i18next.t('user:could_not_verify_user'));
        }

        if (user.verified) {
            return res.send(i18next.t('user:user_already_verified'));
        }

        if (user.verificationCode === verificationCode) {
            user.verified = true;

            await user.save();

            return res.send(i18next.t('user:user_verify_success'));
        }

        return res.send(i18next.t('user:could_not_verify_user'));
    } catch (e: any) {
        return res.status(500).send(e);
    }
}
import { Request, Response } from 'express'
import i18next from 'i18next';
import { CreateSessionInput } from '../schema/auth.schema'
import { findUserByEmail, findUserById } from '../service/user.service';
import { findSessionById, signAccessToken, signRefreshToken } from '../service/auth.service';
import { verifyJwt } from '../utils/jwt';
import { get } from 'lodash';

export async function createSessionHandler(
    req: Request<{}, {}, CreateSessionInput>,
    res: Response
) {
    const message = "";
    const { email, password } = req.body;
    const user = await findUserByEmail(email);

    if (!user) {
        return res.send(i18next.t('auth:invalid_credentials'));
    }

    if (!user.verified) {
        return res.send(i18next.t('auth:user_not_verified'));
    }

    const isValid = await user.validatePassword(password);

    if (!isValid)
    {
        return res.send(message);
    }

    const accessToken = signAccessToken(user);

    const refreshToken = await signRefreshToken({
        userId: user._id });
        
    return res.send({
        accessToken,
        refreshToken
    });
}

export async function refreshAccessTokenHandler(req: Request, res: Response) {

    const refreshToken = get(req, 'headers.x-refresh').toString();

    const decoded = verifyJwt<{ session: string }>(refreshToken, 'refreshTokenPublicKey');

    if (!decoded) {
        return res.status(401).send(i18next.t('auth:could_not_refresh_token'));
    }

    const session = await findSessionById(decoded.session);

    if (!session || !session.valid) {
        return res.status(401).send(i18next.t('auth:could_not_refresh_token'));
    }

    const user = await findUserById(String(session.user));

    if (!user) {
        return res.status(401).send(i18next.t('auth:could_not_refresh_token'));
    }

    const accessToken = signAccessToken(user);

    return res.send({ accessToken });
}
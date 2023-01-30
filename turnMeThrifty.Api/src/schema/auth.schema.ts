import i18next from 'i18next'
import { object, string, TypeOf } from 'zod'

export const createSessionSchema =
    object({
        body: object({
            email: string({
                required_error: 'auth:email_required'
            }).email('auth:invalid_credentials'),
            password: string({
                required_error: 'user:password_required'
            }).min(6, 'auth:invalid_credentials')
        })
    });

export type CreateSessionInput = TypeOf<typeof createSessionSchema>["body"];
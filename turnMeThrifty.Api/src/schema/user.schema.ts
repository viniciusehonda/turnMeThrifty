import i18next from 'i18next'
import { object, string, TypeOf } from 'zod'

export const createUserSchema = object({
    body: object({
        firstName: string({
            required_error: 'user:first_name_required'
        }),
        lastName: string({
            required_error: 'user:last_name_required'
        }),
        password: string({
            required_error: 'user:password_required'
        }).min(6, 'user:password_short'),
        passwordConfirmation: string({
            required_error: 'user:password_confirmation_required'
        }),
        email: string({
            required_error: 'user:email_required'
        }).email('user:email_not_valid')
    }).refine((data) => data.password === data.passwordConfirmation, {
        message: 'user:password_not_match',
        path: ['passwordConfirmation']
    })
});

export const verifyUserSchema = object({
    params: object({
        id: string(),
        verificationCode: string(),
    }),
});

export const forgotPasswordSchema = object({
    body: object({
        email: string({
            required_error: 'user:email_required'
        }).email('user:email_not_valid')
    })
});

export const resetPasswordSchema = object({
    params: object({
        id: string(),
        passwordResetCode: string()
    }),
    body: object({
        password: string({
            required_error: 'user:password_required'
        }).min(6, 'user:password_short'),
        passwordConfirmation: string({
            required_error: 'user:password_confirmation_required'
        }),
    }).refine((data) => data.password === data.passwordConfirmation, {
        message: 'user:password_not_match',
        path: ['passwordConfirmation']
    })
});

export type CreateUserInput = TypeOf<typeof createUserSchema>["body"];

export type VerifyUserInput = TypeOf<typeof verifyUserSchema>["params"];

export type ForgotPasswordInput = TypeOf<typeof forgotPasswordSchema>["body"];

export type ResetPasswordInput = TypeOf<typeof resetPasswordSchema>;
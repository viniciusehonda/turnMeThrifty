import { getModelForClass, modelOptions, pre, prop, Severity, DocumentType, index } from "@typegoose/typegoose";
import { nanoid } from "nanoid";
import argon2 from 'argon2'
import log from "../utils/logger";
import i18next from "i18next";

@pre<User>("save", async function () {
    if (!this.isModified('password')) {
        return;
    }

    const hash = await argon2.hash(this.password);

    this.password = hash;

    return;
})

@index({email: 1})
@modelOptions({
    schemaOptions: {
        timestamps: true
    },
    options: {
        allowMixed: Severity.ALLOW
    }
})

export class User {
    @prop({ lowercase: true, required: true, unique: true })
    email: string

    @prop({ required: true })
    firstName: string

    @prop({ required: true })
    lastName: string

    @prop({ required: true })
    password: string

    @prop({ required: true, default: () => nanoid() })
    verificationCode: string;

    @prop()
    passwordResetCode: string | null;

    @prop({ default: false })
    verified: boolean;

    async validatePassword(this: DocumentType<User>, candiatePassword: string) {
        try {
            return await argon2.verify(this.password, candiatePassword);
        } catch (e) {
            log.error(e, i18next.t('user:password_validation_error'));
            return false;
        }
    }
}

const UserModel = getModelForClass(User);

export default UserModel;
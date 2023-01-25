import { zxcvbn } from '@zxcvbn-ts/core'

export class PasswordHinter {
    static evaluatePassword(password: string) {
        return zxcvbn(password);
    }
}
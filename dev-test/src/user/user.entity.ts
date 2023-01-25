import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, now } from 'mongoose';

import { Exclude } from 'class-transformer';
import { AuthProvider } from '../auth/providers/auth-hashing.provider';
import { ExcludeProperty } from 'nestjs-mongoose-exclude';

export type UserDocument = User & Document<User>;

@Schema({ timestamps: true })
export class User {
    @Prop({ nullable: false, unique: true })
    public email: string;

    @Prop({ nullable: false })
    @ExcludeProperty()
    public password: string;

    @Prop({ default: now() })
    @ExcludeProperty()
    public passwordUpdatedAt: Date

    @Prop({ default: now() })
    @ExcludeProperty()
    public createdAt?: Date;

    @Prop({ default: now() })
    @ExcludeProperty()
    public updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<User>('save', async function () {
    const user = this;
    user.password = await AuthProvider.generateHash(user.password);
});
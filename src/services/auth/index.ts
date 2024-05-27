import { Request } from 'express';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import AES from "crypto-js/aes";
import CryptoJS from "crypto-js";
import { getUsersUtils } from "../../services/serviceLocator/composer";
import { Strategy as JWTStrategy, ExtractJw } from 'passport-jwt';
import 'dotenv/config';

passport.use('local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
},
//*Autenticación de usuario existente
    async (request: Request, email: string, password: string, done: any) => {

        const usersUtils = getUsersUtils();
        const user = await usersUtils.getUserByEmail(email);

        if (!user) {
            return done('USER NOT FOUND', null, { message: "User or password incorrect" });
        }

        if (typeof user === 'object') {

            const encryptedPassword = AES.decrypt(user.password, process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);

            if (typeof user === 'object' && password !== encryptedPassword) {

                return done('PASSWORD INCORRECT', null, { message: "Password incorrect" });
            }
            if (typeof user === 'object' && password === encryptedPassword) {
                const userData = {
                    id_user: user.id_user,
                    names: user.names,
                    lastNames: user.lastNames,
                    email: user.email,
                    password: user.password,
                }
                return done(null, user);
            }
        }
        return done('ERROR', null, { message: "Error in Login" });
    }
)
)
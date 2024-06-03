import { Request } from 'express';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import AES from "crypto-js/aes";
import CryptoJS from "crypto-js";
import { getUsersUtils } from "../../services/serviceLocator/composer";
import { Strategy as JWTStrategy, ExtractJw } from 'passport-jwt';
import { SECRET_KEY } from '../../utils/configs/configs';

passport.use('local', new LocalStrategy({
    usernameField: 'correo',
    passwordField: 'password',
    passReqToCallback: true,
},

//*Autenticación del Usuario 
    async (request: Request, correo: string, password: string, done: any) => {

        const usersUtils = getUsersUtils();
        const user = await usersUtils.getUserBycorreo(correo);

        if (!user) {
            return done('USER NOT FOUND', null, { message: "User or password incorrect" });
        }

        if (typeof user === 'object') {

            const encryptedpassword = AES.decrypt(user.password, SECRET_KEY).toString(CryptoJS.enc.Utf8);

            if (typeof user === 'object' && password !== encryptedpassword) {

                return done('password INCORRECT', null, { message: "password incorrect" });
            }
            if (typeof user === 'object' && password === encryptedpassword) {
                const userData = {
                    id_usuario: user.id_usuario,
                    nombre: user.nombre,
                    apellido: user.apellido,
                    correo: user.correo,
                    password: user.password,
                }
                return done(null, user);
            }
        }
        return done('ERROR', null, { message: "Error in Login" });
    }
)
)
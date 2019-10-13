import express from 'express';
import * as appConfig from '../config';
import jwt from 'jsonwebtoken';
import fs from 'fs';

export default class InitDBService{

    constructor(JokeModel, UserModel){
        this.JokeModel = JokeModel;
        this.UserModel = UserModel;
    }

    async initDB(file){
        const app = this;
        fs.readFile(file, 'utf8', async(err, data)=>{
            if(err){
                console.log('Read file error');
            }

            const sentences = data.split('\n');

            sentences.map(async (sentence)=>{
                await app.JokeModel.create({sentence: sentence.trim()});
            })

        });

        //Add default admin user
        await app.UserModel.create({
            name: 'John',
            email: 'admin@healthera.com',
            password: 'foozle'
        })

    }

    isValidToken(token){
        const expressApp = express();
        expressApp.set('token', appConfig.config.secret);

        jwt.verify(token, expressApp.get('token'), function(err, decoded) {      
            if (err) {
                return false;
            } else {
                return true;
            }
        });
    }
}
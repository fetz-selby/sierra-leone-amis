import express from 'express';
import jwt from 'jsonwebtoken';
import * as appConfig from '../../config';
import * as utils from '../../services/utils';
    
export default class SessionRoutes{

    constructor(UserModel){
        this.UserModel = UserModel;
    }

    routes(){
        const sessionRouter = express.Router();

        sessionRouter.route('/')
            .get((req, res)=>{
                const {email, password} = req.query;
                
                try{

                    if(!email){
                        throw new Error('email is required');
                    }

                    if(!password){
                        throw new Error('password is required');
                    }

                    this.generateSession(res, email, password);
                }catch(error){
                    res.status(400)
                    .json({
                        success: false,
                        message: error.message
                    })
                }
            });

        return sessionRouter;
    }

    async generateSession(res, email, password){
        
        const user = await this.UserModel.findOne({where: {email, password: utils.getHash(password), status: 'A'}});

        if(user){
            const token = jwt.sign({user}, appConfig.config.secret, {expiresIn: '10d'});

            res.status(200)
            .json({
                success: true,
                results: {userId: user.id, 
                          username: user.name, 
                          token}
            })
        }else{
            res.status(400)
            .json({
                success: false,
                message: 'invalid user'
            })
        }
    }
}
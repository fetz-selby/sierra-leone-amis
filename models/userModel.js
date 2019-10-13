import {Sequelize} from 'sequelize';
import * as utils from '../services/utils';

export default class User{

    model(config){
        const user = config.define('user', {
                name:{
                    type: Sequelize.STRING
                },
                email:{
                    type: Sequelize.STRING,
                    validate : {
                        isEmail : true
                    }
                },
                password:{
                    type: Sequelize.STRING,
                    set(val) {
                        this.setDataValue('password', utils.getHash(val.trim()));
                    }
                },
                status: {
                    type : Sequelize.ENUM,
                    values : ['A','D'],
                    defaultValue : ['A']
                }
            }, {underscored: true});
      
            return user;
    }
}
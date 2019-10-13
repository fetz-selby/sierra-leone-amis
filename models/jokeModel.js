import {Sequelize} from 'sequelize';

export default class Joke{

    model(config){
        const joke = config.define('joke', {
                id : {
                    type : Sequelize.UUID,
                    defaultValue : Sequelize.UUIDV1,
                    primaryKey: true
                },
                sentence:{
                    type: Sequelize.TEXT
                },
                status: {
                    type : Sequelize.ENUM,
                    values : ['A','D'],
                    defaultValue : ['A']
                }
            }, {underscored: true});
      
            return joke;
    }
}
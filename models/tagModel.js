import {Sequelize} from 'sequelize';

export default class Tag{

    model(config){
        const tag = config.define('tag', {
                name:{
                    type: Sequelize.STRING
                },
                status: {
                    type : Sequelize.ENUM,
                    values : ['A','D'],
                    defaultValue : ['A']
                }
            }, {underscored: true});
      
            return tag;
    }
}
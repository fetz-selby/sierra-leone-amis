import {Sequelize} from 'sequelize';

export default class JokeGroup{

    model(config){
        const joke_group = config.define('joke_group', {
                joke_id:{
                    type: Sequelize.UUID
                },
                tag_id:{
                    type: Sequelize.INTEGER
                },
                status: {
                    type : Sequelize.ENUM,
                    values : ['A','D'],
                    defaultValue : ['A']
                }
            }, {underscored: true});
      
            return joke_group;
    }
}
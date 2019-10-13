import express from 'express';
import _ from 'lodash';
import * as utils from '../../services/utils';
    
export default class JokeRoutes{

    constructor(JokeModel, JokeGroupModel, TagModel){
        this.JokeModel = JokeModel;
        this.JokeGroupModel = JokeGroupModel;
        this.TagModel = TagModel;
    }

    routes(){
        const app = this;
        const jokeRouter = express.Router();

        jokeRouter.route('/')
            .get((req, res)=>{
                const {tags} = req.query;

                try{
                    this.fetchJokes(res, tags);
                }catch(error){
                    res.status(400)
                    .json({
                        success: false,
                        message: error.message
                    })
                }
            });

        jokeRouter.route('/:id')
            .get((req, res)=>{
                const {id} = req.params;
                try{
                    app.fetchJoke(res, id);
                }catch(error){
                    res.status(400)
                    .json({
                        success: false,
                        message: error.message
                    })
                }
            });


        jokeRouter.route('/:id')
            .put((req, res)=>{
                const {sentence,tags} = req.body;
                const {id} = req.params;
                try{
                    app.updateJoke(res, id, sentence, tags);
                }catch(error){
                    res.status(400)
                    .json({
                        success: false,
                        message: error.message
                    })
                }
            });

        jokeRouter.route('/')
            .post((req, res)=>{
                const {sentence, tags} = req.body;
                try{
                   if(!sentence){
                       throw new Error('sentence is required');
                   }

                   app.addJoke(res, sentence, tags);
                }catch(error){
                    res.status(400)
                    .json({
                        success: false,
                        message: error.message
                    })
                }
            });
        
        jokeRouter.route('/:id')
            .delete((req, res)=>{
                const {id} = req.params;
                try{
                    app.deleteJoke(res,id);
                }catch(error){
                    res.status(400)
                    .json({
                        success: false,
                        message: error.message
                    })
                }
            });

        return jokeRouter;
    }

    /**
     * Create or add a new Joke. Either with tags or without it
     * @param res - API's response object
     * @param sentence - Joke sentence
     * @param lTags - commas separated list of tags to associate with joke
     */

    async addJoke(res, sentence, lTags){
        const app = this;
        let joke,tags;
        try{
            if(lTags){
                tags = _.uniq(utils.getAsArray(lTags, ','));
                const isTagsValid = await app.isTagsValid(tags);
                if(!isTagsValid){
                    throw new Error('Invalid tags association');
                }

                joke = await app.JokeModel.create({sentence});
                tags.map(async(tagId)=>{
                    await app.JokeGroupModel.create({
                        joke_id: joke.id,
                        tag_id: tagId
                    })
                   })
            }else{
                joke = await app.JokeModel.create({sentence});
            }

           res.status(200)
           .json({
               success: true,
               message: 'Joke added successfully',
               results: {
                   id: joke.id,
                   sentence: joke.sentence,
                   tags
               }
           })
        }catch(error){
            res.status(400)
            .json({
                success: false,
                message: error.message
            })
        }
    }

    /**
     * Fetch a single Joke
     * @param res - API response object
     * @param id - ID of joke
     */

    async fetchJoke(res, id){
        const app = this;
        try{
            const joke = await app.JokeModel.findOne({where:{id, status: 'A'}, attributes: ['id', 'sentence']});
            const tags = await app.JokeGroupModel.findAll({where: {joke_id:joke.id, status: 'A'}, include: [{model: app.TagModel, attributes: ['id', 'name']}]});
            const flatTags = tags.map((tag)=>({id: tag.tag_id, name:tag.tag.name}));
            
            res.status(200)
            .json({
                success: true,
                message: 'Joke request successful',
                results: {
                    id: joke.id,
                    sentence: joke.sentence,
                    tags: flatTags
                }
            })
        }catch(error){
            res.status(400)
            .json({
                success: false,
                message: error.message
            })
        }
    }

    /**
     * Fetch jokes either with tags or not
     * @param tags - comma separated list of tag ID's
     * @param res - API's response object
     */

    async fetchJokes(res, tags){
        const app = this;
        try{
            //TODO limit the number of jokes to send if count is not specified
           if(!tags){
               const jokes = await this.JokeModel.findAll({where: {status: 'A'}, attributes: ['id', 'sentence']});
               res.status(200)
               .json({
                   success: true,
                   message: 'Jokes request successful',
                   results: jokes
               });
               return;
            }
            const jokes = [];

            //Convert joke tags to array and fetch all related jokes
            const tagIds = utils.getAsArray(tags, ',');
            tagIds.map(async (tag, i)=>{
                const jokeGroup = await this.JokeGroupModel.findAll({where: {tag_id:tag, status: 'A'}, include:[{model: app.JokeModel, attributes: ['id', 'sentence']}] });
                if(jokeGroup){
                    jokeGroup.map(async(sJoke)=>{
                        if(!_.find(jokes, ['id',sJoke.joke.id])){
                            jokes.push(sJoke.joke);
                        }
                    })
                }

                if(i === tagIds.length-1){
                    res.status(200)
                    .json({
                        success: true,
                        message: 'Jokes request successful',
                        results: jokes
                    })
                }
            });
            
        }catch(error){
            res.status(400)
            .json({
                success: false,
                message: error.message
            })
        }
    }

    /**
     * Update the joke
     * @param res - API's response object
     * @param sentence - Joke statement
     * @param itags - Comma separated values of tags
     */
    async updateJoke(res, id, sentence, itags){
        const app = this;
        const tags = utils.getAsArray(itags, ',');

        console.log(tags);
        try{

            //Validate tags
            if(tags){

                //Check if tags are valid
                const isValidTags = await app.isTagsValid(tags);

                if(!isValidTags){
                    throw new Error('Invalid tags association');
                }

                //Verify if tags specified is same as the persisted tags
                const hasChanged = await app.hasChanged(id, tags);
                if(hasChanged){

                    //Remove all tags and persist them again
                    await app.removeAllTags(id);
                    await app.associateTags(id, tags);
                }
            }

            await app.JokeModel.update({sentence}, {where:{id, status: 'A'}});
            
            res.status(200)
            .json({
                success: true,
                message: 'Joke update request successful',
                results: {
                    id,
                    sentence
                }
            })
        }catch(error){
            res.status(400)
            .json({
                success: false,
                message: error.message
            })
        }
    }

    /**
     * Set's a joke status to D
     * @param res - API response object
     * @param id - id of the joke
     */

    async deleteJoke(res, id){
        try{

            //Use soft deletion by setting status to D
            const update = await this.JokeModel.update({status:'D'}, {where: {id, status:'A'}});
            await this.JokeGroupModel.update({status: 'D'}, {where: {joke_id:id, status:'A'}})
            
            if(!update){
                throw new Error('Joke delete request failed');
            }

            res.status(200)
            .json({
                success: true,
                message: 'Joke deleted successfully'
            })
        }catch(error){
            res.status(400)
            .json({
                success: false,
                message: error.message
            })
        }
    }

    /**
     * Fetch DB tags and compare with given tags if they're same
     * @param tags - Array of tag ID's
     * @param jokeId - Id of joke
     */

    async hasChanged(jokeId, tags){
        const app = this;

        return new Promise(async(resolve, reject)=>{
            const allTags = await app.JokeGroupModel.findAll({where:{joke_id: jokeId, 
                                                                    status: 'A'}, attributes: ['tag_id']});
            
            const uniqTagsDB = _.sortedUniq(allTags.map((tag)=>tag.tag_id));
            const uniqTags = _.sortedUniq(tags);

            //Checking if returned tags length equal request tags
            if(uniqTagsDB.length != uniqTags.length){
                return resolve(true);
            }

            //Check if tag values are the same
            return resolve(!_.isEmpty(_.difference(uniqTags, uniqTagsDB)));
        })
    }

    /**
     * Set all a tags associated to jokeId status to D
     * @param jokeId - joke id
     */
    async removeAllTags(jokeId){
        const app = this;

        return new Promise(async(resolve, reject)=>{
            try{

                //Removing all tags associated with joke
                const update = await app.JokeGroupModel.update({status: 'D'}, {where:{joke_id: jokeId, status: 'A'}});
                if(update) return resolve(true);
                return resolve(false);
            }catch(error){
                return reject(error);
            }
        })
    }

    /**
     * Create new tags with associated jokeId
     * @param tags - Array of tag ID's
     * @param jokeId - ID of joke
     */

    async associateTags(jokeId, tags){
        const app = this;

        return new Promise(async(resolve, reject)=>{
            try{
                //Create tags
                const groupTags = tags.map(async(tag)=>{
                    return await app.JokeGroupModel.create({
                        tag_id: tag,
                        joke_id: jokeId
                    })
                });

                return resolve(groupTags)
            }catch(error){
                return reject(error);
            }
        })
    }

    /**
     * Validate tags
     * @param tags - Array of tag ID's
     */
    async isTagsValid(tags){
        const app = this;

        //Validate given tags if exists
        return new Promise(async(resolve, reject)=>{
            tags.map(async(tag, i)=>{
                const result = await app.TagModel.findOne({where:{id: tag, status: 'A'}});

                if(!result){
                    return resolve(false)
                }

                if(i == tags.length-1){
                    return resolve(true);
                }
            });
        })
    }
}
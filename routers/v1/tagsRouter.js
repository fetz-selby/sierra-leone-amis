import express from 'express';
    
export default class TagRoutes{

    constructor(TagModel){
        this.TagModel = TagModel;
    }

    routes(){
        const tagRouter = express.Router();

        tagRouter.route('/')
            .get((req, res)=>{
                const {size} = req.query;
                try{
                    if(!size){

                        //Default to fetch 10 tag if size not specified
                        this.fetchTags(res, 10);
                    }else{
                        this.fetchTags(res, size);
                    }
                }catch(error){
                    res.status(400)
                    .json({
                        success: false,
                        message: error.message
                    })
                }
            });

        tagRouter.route('/:id')
            .get((req, res)=>{
                try{
                    this.fetchTag(res, res.params.id);
                }catch(error){
                    res.status(400)
                    .json({
                        success: false,
                        message: error.message
                    })
                }
            });

        tagRouter.route('/')
            .post((req, res)=>{
                const {name} = req.body;
                try{
                    if(!name){
                        throw new Error('name required');
                    }

                    this.addTag(res, name);
                }catch(error){
                    res.status(400)
                    .json({
                        success: false,
                        message: error.message
                    })
                }
            });
        
        tagRouter.route('/:id')
            .delete((req, res)=>{
                const {id} = req.params;
                try{
                    if(!id){
                        throw new Error('id required')
                    }

                    this.deleteTag(res, id);
                }catch(error){
                    res.status(400)
                    .json({
                        success: false,
                        message: error.message
                    })
                }
            });

        return tagRouter;
    }

    /**
     * Create or add new tag
     * @param res - API's response object
     * @param name - name of tag
     */

    async addTag(res, name){
        try{
            const tag = await this.TagModel.create({
                name
            });

            res.status(200)
            .json({
                success: true,
                message: 'Tag added successfully',
                results: {
                    id: tag.id,
                    name: tag.name
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
     * Fetch single tags
     * @param res - API's response object
     * @param id - ID of tag to be fetched
     */
    async fetchTag(res, id){
        try{
            const tag = await this.TagModel.findOne({where:{id, status: 'A'}});
            res.status(200)
            .json({
                success: true,
                message: 'Tag request successful',
                results: tag
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
     * Fetch tags
     * @param res - API's response object
     * @param size - size to be pulled
     */
    async fetchTags(res, size){
        try{
            const tags = await this.TagModel.findAll({where:{status: 'A'}, limit: size});
            res.status(200)
            .json({
                success: true,
                message: 'Tags request successful',
                results: tags
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
     * Delete tag
     * @param res - API's response object
     * @param id - ID of tag
     */

    async deleteTag(res, id){
        try{

            //Setting the status to D for deletion
            const tag = await this.TagModel.update({status: 'D'}, {where:{id, status: 'A'}});
            if(!tag){
                throw new Error('Delete tag request unsuccessful');
            }

            res.status(200)
            .json({
                success: true,
                message: 'Tag request successful',
                results: tag
            })
        }catch(error){
            res.status(400)
            .json({
                success: false,
                message: error.message
            })
        }
    }
}
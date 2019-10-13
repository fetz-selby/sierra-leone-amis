import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import logger from 'morgan';
import session from 'express-session';
import * as appConfig from './config';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import compression from 'compression';
import path from 'path';
import http from 'http';

import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";


//Models
import User from './models/userModel';
import Tag from './models/tagModel';
import Joke from './models/jokeModel';
import JokeGroup from './models/jokeGroupModel';

//Routers
import SessionsRouter from './routers/v1/sessionsRouter';
import TagsRouter from './routers/v1/tagsRouter';
import UsersRouter from './routers/v1/usersRouter';
import JokesRouter from './routers/v1/jokesRouter';

//Services
import InitDBService from './services/InitDBService';

export default class App {

    constructor(){
        this.app = express();
        this.initExpress(this.app);
        this.initSQLAndRouters(this.app);
        this.finalize(this.app);
    }

    initExpress(app){
        app.use(bodyParser.json({limit: '50mb', parameterLimit: 1000000}));
        app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 1000000}));
        app.use(cookieParser());
        app.use(compression());
        app.use(session({resave:true, saveUninitialized: true, 
                        secret: appConfig.config.secret,
                        cookieName: 'session',
                        duration: 30*60*1000, 
                        activeDuration: 5*60*1000, 
                        httpOnly: true, 
                        cookie: {secure: false }}));

        //logging
        app.use(logger('dev'));
        app.use(express.static('build'));

        //Disable cache
        app.use((req, res, next) => {
            res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
            res.header('Expires', '-1');
            res.header('Pragma', 'no-cache');
            next();
        });

        app.use(cors());
    }

    initDoc(){
        const swaggerDefinition = {
            basePath: '/healthera/api',
            info: {
                description: "Admin API suite for the Healthera joke system.",
                title: "Healthera Jokes",
                version:'v1',
            },
            tags: [{
                description: "APIs for managing jokes",
                name: "jokes",
            }],
        };
        
        const options = {
            apis:['./routers/v1/*.js'],
            swaggerDefinition,
        };
        
        return swaggerJSDoc(options);
    }

    validate(req, res, next){
        const app = express();

        //JSON Web Token Secret
        app.set('token', appConfig.config.secret);
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        
        // decode token
        if(token) {
            jwt.verify(token, app.get('token'), (err)=>
                (err)?res.json({success: false, message: 'Failed to authenticate token.'}):next());
        }else{
            return res.status(403).send({ 
                success: false, 
                message: 'No token provided.' 
            });
        }
    }

    async initSQLAndRouters(app){

        const db = appConfig.sequelize;

        const jokeModel = new Joke().model(db);
        const jokeGroupModel = new JokeGroup().model(db);
        const tagModel =  new Tag().model(db);
        const userModel = new User().model(db);

        //Setting relationship
        jokeGroupModel.belongsTo(jokeModel);
        jokeGroupModel.belongsTo(tagModel);

        //Init Routers
        const jokesRouter = new JokesRouter(jokeModel, jokeGroupModel, tagModel);
        const usersRouter = new UsersRouter(userModel);
        const tagsRouter = new TagsRouter(tagModel);
        const sessionsRouter = new SessionsRouter(userModel);

        if(appConfig.config.prepare){     

            //Drop all tables if exist
            await db.drop();
            await db.sync({force: true});

            //TODO Init DB
           const csvJokes = path.resolve('./resources/jokes.csv');

           const service = new InitDBService(jokeModel, userModel);
           service.initDB(csvJokes);

        }else{
            await db.sync();
        }

        app.get('/', (req, res)=>{
            res.sendFile(path.join(__dirname, 'build', 'index.html'));
        });

        app.use('/healthera/api/docs', swaggerUi.serve, swaggerUi.setup(this.initDoc()));
        app.use('/healthera/api/v1/*', this.validate); 
        app.use('/healthera/api/v1/tags', tagsRouter.routes()); 
        app.use('/healthera/api/v1/jokes', jokesRouter.routes()); 
        app.use('/healthera/api/sessions', sessionsRouter.routes());
        app.use('/healthera/api/users', usersRouter.routes()); 

    }

    finalize(app){
        const HTTP_PORT = appConfig.config.HTTP_SERVER_PORT;
        const httpServer = http.createServer(app); 
        
        httpServer.listen(HTTP_PORT, ()=>{
            console.log(`*** Running on PORT ::: ${HTTP_PORT} ***`);
        });
       
    }
}

const server = new App();
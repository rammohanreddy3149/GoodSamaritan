const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const ejs = require('ejs');
const http = require('http');
const container = require('./container');
const cookieParser = require('cookie-parser');
const validator = require('express-validator');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');


const {initializePayment, verifyPayment} = require('./config/paystack')(request);

const socketIO = require('socket.io');
const {Users} = require('./helpers/UsersClass');
const {Global} = require('./helpers/Global');
const {Donor} = require('./models/donor')
const compression = require('compression');
const helmet = require('helmet');

const Article = require('./models/article')
const articleRouter = require('./controllers/articles')
const methodOverride = require('method-override')
const nodemailer=require('nodemailer');
process.env.NODE_TLS_REJECT_UNAUTHORIZED='0'
require('dotenv').config();

container.resolve(function(donor,users, _,admin, home, group,articles, results,listmail,mail,samaritan,maps,privatechat, profile,issues){
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost/tgs');
    const app= SetupExpress();

    function SetupExpress(){
        const app = express();
        const server = http.createServer(app);
        const io = socketIO(server);
        server.listen(3000,function(){//process.env.PORT || 3000, function(){
            console.log('Listening on port 3000');
        });
        ConfigureExpress(app);

        
        require('./socket/groupchat')(io, Users);
        require('./socket/friend')(io);
        require('./socket/globalroom')(io, Global, _);
        require('./socket/privatemessage')(io);
        

        const router = require('express-promise-router')();
        users.SetRouting(router);
        admin.SetRouting(router);
        home.SetRouting(router);
        samaritan.SetRouting(router);
        group.SetRouting(router);
        results.SetRouting(router);
        privatechat.SetRouting(router);
        profile.SetRouting(router);
        issues.SetRouting(router);
        maps.SetRouting(router);
        articles.SetRouting(router);
        mail.SetRouting(router);
        listmail.SetRouting(router);
        donor.SetRouting(router);
        app.use(methodOverride('_method'))
        app.use(router);
        
        
        
    }
    

    function ConfigureExpress(app){

        
        app.use(compression());
        app.use(helmet());
        

        require('./passport/passport-local');
        //require('./passport/passport-facebook');
        //require('./passport/passport-google');

        app.use(express.static('public'));
        app.use(cookieParser());
        app.set('view engine','ejs');
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(express.urlencoded({ extended: false }));
        app.use(validator());
        app.use(session({
            secret: 'thisisasecretkey',
            resave: true,
            saveUninitialized: true,
            store: new MongoStore({mongooseConnection: mongoose.connection})
        }));

        app.use(flash());

        app.use(passport.initialize());
        app.use(passport.session());

        app.locals._ =_;
    }

});
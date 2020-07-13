const nodemailer=require('nodemailer');
module.exports = function(async, Company, _, Users, Message, FriendResult){
    return {
        SetRouting: function(router){
            router.get('/mail', this.homePage);
            router.post('/mail', this.postHomePage);
        },
        
        homePage: function(req, res){
            
            let transporter=nodemailer.createTransport({
                service: 'gmail',
                auth:{
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD
                }
            });
            //STEP 2
            let mailOptions=({
                from:'2020thegoodsamaritan@gmail.com',
                to: req.user.email,
                subject:'WELCOME TO TGS',
                text:req.user.username+' Thank you for joining good samaritan'
            });
            //STEP 3
            transporter.sendMail(mailOptions,function(err,data){
            if(err)
            {
                console.log(err);
                console.log('MAIL IS NOT SENT');
            }
            else{
                console.log('MAIL HAS BEEN SENT');
            }
            }
            );
            res.redirect('/home');
            //return res.render('samaritan',{user:req.user});
           },

        postHomePage: function(req, res){
            let transporter=nodemailer.createTransport({
                service: 'gmail',
                auth:{
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD
                }
            });
            //STEP 2
            let mailOptions=({
                from:'2020thegoodsamaritan@gmail.com',
                to:'gcaroleunice@gmail.com',
                subject:'THIS IS A TEST MAIL.',
                text:'Thank you for joining good samaritan'
            });
            //STEP 3
            transporter.sendMail(mailOptions,function(err,data){
            if(err)
            {
                console.log(err);
                console.log('MAIL IS NOT SENT');
            }
            else{
                console.log('MAIL HAS BEEN SENT');
            }
            }
            );
            res.redirect('/home');
            
            //return res.render('samaritan',{user:req.user});    
        }
        
        
    }
}
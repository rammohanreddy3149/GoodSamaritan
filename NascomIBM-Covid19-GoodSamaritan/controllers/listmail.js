const nodemailer=require('nodemailer');
module.exports = function(async, Company, _, Users, Message, FriendResult){
    return {
        SetRouting: function(router){
            router.get('/listmail', this.homePage);
            router.post('/listmail', this.postHomePage);
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
            let mailOptions1=({
                from:'2020thegoodsamaritan@gmail.com',
                to: req.user.email,
                subject:'Your list has been placed',
                text:'Hi '+req.user.username+'Your list has been placed'
            });
            //STEP 3
          
            transporter.sendMail(mailOptions1,function(err,data){
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
            
            //return res.render('samaritan',{user:req.user});    
        }
        
        
    }
}
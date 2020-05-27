
module.exports = function(async, Company, _, Users, Message, FriendResult){
    return {
        SetRouting: function(router){
            router.get('/maps', this.homePage);
            router.post('/maps', this.postHomePage);
        },
        
        homePage: function(req, res){
            return res.render('maps',{user:req.user});
           },

        postHomePage: function(req, res){
            return res.render('maps',{user:req.user});    
        }
        
        
    }
}
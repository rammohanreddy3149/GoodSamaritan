module.exports = function(async, Company, _, Users, Message, FriendResult){
    return {
        SetRouting: function(router){
            router.get('/samaritan', this.homePage);
            router.post('/samaritan', this.postHomePage);
        },
        
        homePage: function(req, res){
            return res.render('samaritan',{user:req.user});
           },

        postHomePage: function(req, res){
            return res.render('samaritan',{user:req.user});    
        }
        
        
    }
}
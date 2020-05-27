module.exports = function(Users, async, Message, FriendResult, Group, Issue){
    return {
        SetRouting: function(router){
            router.get('/group/issues/:name', this.groupIssuePage);
            router.post('/group/issues/:name', this.groupIssuePostPage);
        },
        
        groupIssuePage: function(req, res){
            const name = req.params.name;
            var resu = name.split("*");
            const group=resu[0];
            const issue=resu[1];
            async.parallel([
                function(callback){
                    Users.findOne({'username': req.user.username})
                    .populate('request.userId')
                    .exec((err, result) => {
                        //console.log(result);
                        callback(err, result);
                    })
                },
                
                function(callback){
                    const nameRegex = new RegExp("^" + req.user.username.toLowerCase(), "i")
                    Message.aggregate([
                        {$match:{$or:[{"senderName":nameRegex}, {"receiverName":nameRegex}]}},
                        {$sort:{"createdAt":-1}},
                        {
                            $group:{"_id":{
                            "last_message_between":{
                                $cond:[
                                    {
                                        $gt:[
                                        {$substr:["$senderName",0,1]},
                                        {$substr:["$receiverName",0,1]}]
                                    },
                                    {$concat:["$senderName"," and ","$receiverName"]},
                                    {$concat:["$receiverName"," and ","$senderName"]}
                                ]
                            }
                            }, "body": {$first:"$$ROOT"}
                            }
                        }, 
                    ]).exec(function(err, newResult){
                        const arr = [
                        {path: 'body.sender', model: 'User'},
                        {path: 'body.receiver', model: 'User'}
                    ];
                    //console.log(arr);
                    
                     Message.populate(newResult, arr, (err, newResult1) => {
                        //console.log("hujnk",newResult1);
                        callback(err, newResult1);
                    });
                    })
                },
                /*function(callback){
                    Group.find({})
                        .populate('sender')
                        .exec((err, result) => {
                            callback(err, result);
                        });
                },*/
                function(callback){
                    Issue.find({})//'group': req.user.username})
                    /*.populate({
                        issue: 'issue',
                        victim: 'victim',
                        victimName: 'victimName'
                    })*/
                    .sort({"createdAt":-1})
                    .exec((err, result) => {
                        //console.log("ooo",result);
                        callback(err, result);
                    })
                }
            ], (err, results) => {
                const result1 = results[0];
               // console.log(result1+"in group");
                const result2 = results[1];
                const result3 = results[2];
                //const result4 = results[3];
                //console.log(result4);
                //res.render('groupchat/group', {title: 'YouMeChat - Group', user:req.user, groupName: name, data: result1, chat: result2, groupMsg: result3, groupIssue: result4});
                res.render('groupchat/issues', {title: 'YouMeChat - Issues',user:req.user, groupName:group, data: result1, issue: issue.replace(/-/g," "),chat: result2,groupIssue: result3,issuename:name});//user:req.user, groupName:name, data: result1, chat:result2, groupMsg: result3});
            });
        },
        
        groupIssuePostPage: function(req, res){
            const name = req.params.name;
            var resu = name.split("*");
            const group=resu[0];
            const issue=resu[1];
            FriendResult.PostRequest(req, res, '/group/issues/'+req.params.name);
            async.parallel([
                function(callback){
                    if(req.body.solution){
                        Issue.update({
                            'group': group,
                            'issue': issue,
                            'SolveList.solverId': {$ne: req.user._id},
                        },
                        {
                            $push: {SolveList: {
                                solverId: req.user._id,
                                solverName:req.user.username,
                                solution:req.body.solution
                            }}
                        }, (err, count) => {
                            console.log("hi",count);
                            callback(err, count);
                        })
                    }
                }/*,
                function(callback){
                    //console.log("hello     "+req.user);
                    if(req.body.receiverName){
                        //console.log("bello      "+req.user);
                        Users.update({
                            'fullname': req.user.fullname,
                            'sentRequests.username': {$ne: req.body.receiverName}
                        },
                        {
                            $push: {sentRequests: {
                                username: req.body.receiverName
                            }}
                        }, (err, count) => {
                            callback(err, count);
                        })
                    }
                }   */
            ], (err, results) => {
                res.redirect('/group/'+group);
            });














                /*function(callback){
                    if(req.body.issue){
                        const issues = new Issue();
                        issues.issue = req.user._id;
                        issues.group = req.body.message;
                        issues.victim = req.body.groupName;
                        issues.victimName = new Date();
                        group.save((err, msg) => {
                           // console.log(msg);
                           // console.log("pojbebd");
                            callback(err, msg);
                        })
                    }
                }
            ], (err, results) => {
                res.redirect('/group/'+req.params.name);
            });*/
        }
    }
}
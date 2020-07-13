const mongoose = require('mongoose');
var issueSchema = mongoose.Schema({
    group: {type: String},
    issue: {type: String},
    victim: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    victimName: {type: String},
    SolveList: [{
        solverId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},  
        solverName: {type: String, default: ''},
        solution: {type: String, default:''}
    }],
    createdAt: {type: Date, default: Date.now}
});
module.exports= mongoose.model('Issue', issueSchema);

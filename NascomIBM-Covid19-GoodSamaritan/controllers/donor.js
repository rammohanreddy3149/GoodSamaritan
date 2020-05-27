const {Donor} = require('./../models/donor')
const request = require('request');
const {initializePayment, verifyPayment} = require('./../config/paystack')(request);
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
module.exports = function(async, Company, _, Users, Message, FriendResult){
    return {
        SetRouting: function(router){
            router.get('/donor', this.homePage);
            router.get('/donor/paystack/callback', this.postHomePage);
            router.post('/donor/paystack/pay', this.page1);
            router.get('/donor/receipt/:id',this.page2);
            router.get('/error',this.errorPage);
        },
        
        errorPage: function(req,res){
            res.render('error');
        },

        homePage: function(req, res){
                return res.render('pay');
        },
        page1: function(req,res)
        {
            const form = _.pick(req.body,['amount','email','full_name']);
            form.metadata = {
                full_name : form.full_name
            }
            form.amount *= 100;
            
            initializePayment(form, (error, body)=>{
                if(error){
                    //handle errors
                    console.log(error);
                    return res.redirect('/donor/error')
                    return;
                }
                response = JSON.parse(body);
                res.redirect(response.data.authorization_url)
        });
        },

        page2: function(req,res)
        {
            const id = req.params.id;
            Donor.findById(id).then((donor)=>{
                if(!donor){
                    //handle error when the donor is not found
                    res.redirect('/donor/error')
                }
                res.render('success.ejs',{donor});
            }).catch((e)=>{
                res.redirect('/donor/error')
            })
        },

        postHomePage: function(req, res){
            const ref = req.query.reference;
            verifyPayment(ref, (error,body)=>{
                if(error){
                    //handle errors appropriately
                    console.log(error)
                    return res.redirect('/error');
                }
                response = JSON.parse(body);        

                const data = _.at(response.data, ['reference', 'amount','customer.email', 'metadata.full_name']);

                [reference, amount, email, full_name] =  data;
                
                newDonor = {reference, amount, email, full_name}

                const donor = new Donor(newDonor)

                donor.save().then((donor)=>{
                    if(!donor){
                        return res.redirect('/error');
                    }
                    res.redirect('/donor/receipt/'+donor._id);
                }).catch((e)=>{
                    res.redirect('/donor/error');
                })
            });
            
        },
        
        
    }
}
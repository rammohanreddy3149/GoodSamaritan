const express = require('express')
const Article = require('./../models/article')
const methodOverride = require('method-override')

const nodemailer=require('nodemailer');


module.exports = function(async, Company, _, Users, Message, FriendResult){
    return {
        SetRouting: function(router){
            router.get('/articles',async (req, res) => {
                const articles = await Article.find().sort({ createdAt: 'desc' })
                res.render('articles/index', { articles: [...articles],currentUserId:JSON.stringify(req.user._id) });
  
              });
            router.get('/articles/new', (req, res) => {
                res.render('articles/new', { article: new Article() })
                
              });
              router.get('/articles/edit/:id', async (req, res) => {
                const article = await Article.findById(req.params.id)
                res.render('articles/edit', { article: article })
              });
              router.get('/articles/:slug', async (req, res) => {
                const article = await Article.findOne({ slug: req.params.slug })
                let transporter=nodemailer.createTransport({
                  service: 'gmail',
                  auth:{
                      user: process.env.EMAIL,
                      pass: process.env.PASSWORD
                  }
              });
              req.user.samaritan_coins+=100;
              console.log(req.user.samaritan_coins);
              let mailOptions=({
                  from:'2020thegoodsamaritan@gmail.com',
                  to: req.params.slug+'@gmail.com',
                  subject:'List has been Accepted',
                  text:'Hi '+req.params.slug+'Your list has been accepted by '+req.user.email+' Thank You'
              });
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
                



                    let transporter1=nodemailer.createTransport({
                      service: 'gmail',
                      auth:{
                          user: process.env.EMAIL,
                          pass: process.env.PASSWORD
                      }
                  });
                  //STEP 2
                  //console.log(req.params.id);
                  let mailOptions1=({
                      from:'2020thegoodsamaritan@gmail.com',
                      to: req.user.email,
                      subject:'Acceptation Mail',
                      text:'Hi '+req.user.username+'You had successfully accepted '+req.params.slug+' List Thank You'
                  });
                  //STEP 3
                  transporter1.sendMail(mailOptions1,function(err,data){
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
                    if (article == null) 
                        res.redirect('/articles')
                    else
                        res.render('articles/show', { article: article })
                    //res.redirect('/listmail');
              });
              router.put('/articles/:id',(req,res)=>
              {
              res.redirect('/home');
              });
              router.post('/articles', async (req, res, next) => {
                req.article = new Article()
                console.log('Hi');
                next()
              }, saveArticleAndRedirect('/articles/new'));
              
              router.put('/articles/:id', async (req, res, next) => {
                req.article = await Article.findById(req.params.id)
                //console.log(req.params.id);
                //console.log(req.article);
                next()
              }, saveArticleAndRedirect('/articles/edit'));
              
              router.delete('/articles/:id', async (req, res) => {
                await Article.findByIdAndDelete(req.params.id)
                console.log(req.params.id);
                res.redirect('/articles/index');
              });
              function saveArticleAndRedirect(path) {
                  console.log(path);
                  
                return async (req, res) => {
                  res.redirect('/listmail')
                  let article = req.article
                  article.title = req.body.title
                  article.description = req.body.description
                  article.markdown = req.body.markdown
                  article.userId = JSON.stringify(req.user._id);
                  try {
                    article = await article.save()
                    if(res.redirect('/articles/${article.slug}'))
                      res.redirect('/listmail')
                  } catch (e) {
                    res.render(`articles/${path}`, { article: article })
                  }
                }
              }
              


            
        }
        
        
    }
}






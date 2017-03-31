var express=require('express');
var app=express();
var http=require('http').Server(app);
var io=require('socket.io')(http);
var classifier=require('classifier');
var bayes=new classifier.Bayesian();

bayes.train("i like pizza","pizza");
bayes.train("i like car","car");



var bodyparser=require('body-parser');

function notify(req,res,next){
    console.log('request to'+req.url);
next();
}

app.use(bodyparser.urlencoded({extended:false}));
app.use (notify);

require('../router/route')(app,io,bayes);



var server=http.listen(process.env.PORT || 8000,function(){
    console.log("server running in 8000");
});





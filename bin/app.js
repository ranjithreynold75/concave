var express=require('express');
var app=express();
var http=require('http').Server(app);
var io=require('socket.io')(http);




var bodyparser=require('body-parser');

function notify(req,res,next){
    console.log('request to'+req.url);
next();
}

app.use(bodyparser.urlencoded({extended:false}));
app.use (notify);

require('../router/route')(app,io);



var server=http.listen(process.env.PORT || 8000,function(){
    console.log("server running in 8000");
});





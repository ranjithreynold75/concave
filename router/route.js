
//mongodb://<dbuser>:<dbpassword>@ds145380.mlab.com:45380/concave

var m=require('mongodb');
var url="mongodb://concave:alwaysforward1.@ds145380.mlab.com:45380/concave";
var mc=m.MongoClient;
var _db;
mc.connect(url,function(err,db){
    if(err)
    {
        console.log(err);
    }
    else
    {
        _db=db;

    }
});





module.exports=function (app,io) {




app.get("/",function(req,res){
    res.send("welcome to concave-->Lets collaborate");
})






}
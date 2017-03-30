
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

var users={
    user:{

    }

};





module.exports=function (app,io) {


io.on("connection",function(socket){

    console.log("A user connected:"+ socket.id);
    socket.emit('message', {'id': socket.id});

    socket.on('register', function (data) {
        var d = JSON.parse(data);
        console.log(data);
        console.log("registering user " + d.id);
        users.user[d.no] = d.id;

        console.log(users);
        //  io.sockets.emit("notify",{"message":"welcome to smartlife"});
    })

    socket.on('disconnect', function () {
        console.log('A user disconnected ' + socket.id);

    })


})


    app.get("/",function(req,res){
    res.send("welcome to concave-->Lets collaborate");
})

    app.post("/signup",function(req,res){

        var collection=_db.collection("user");
        var data={
          _id:req.body.no,
            name:req.body.name,
            password:req.body.pass,
            location:{
              longitude:0,
                latitude:0
            },
          status:"offline"
        };

        collection.insertOne(data,function(err){
        if(err) {
            console.log(err);
        res.send("unsuccess");
        }
        else
            res.send("success");
        });




    })

    app.post("/login",function (req,res) {

        var no=req.body.no;
        var password=req.body.pass;

        var collection=_db.collection("user");
        var cursor=collection.find({_id:no,password:password});
        cursor.count(function(err,c){
            if(err)
                console.log(err);
            else
            {
                if(c==1)
                {
                    console.log("user logged in:"+no);
                collection.updateOne({_id:no},{$set:{status:"online"}});

                    res.send("success");
                }
                else
                {
                    res.send("unsuccess");
                }
            }



        })





    })






}
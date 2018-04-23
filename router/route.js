
//mongodb://<dbuser>:<dbpassword>@ds145380.mlab.com:45380/concave
var node=require('node-schedule');
var bayes=require('bayes');
var classifier=bayes();
classifier.learn('like pizza','positive');

classifier.learn('i dislike pizza','negative');

var m=require('mongodb');
var url="mongodb://concave:@ds145380.mlab.com:45380/concave";
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

    });

    function predict(m,sender,socket)
    {
console.log(m+" "+sender);

        if(m.match("like"))
        {
            if(m.match("pizza"))
            {
                socket.emit("notify", {message: "20% off on Pizza near your pizza hut"});

            }
            else if(m.match("car"))
            {
                socket.emit("notify", {message: "New nexa cars in showroom"});

            }

        }
        if(m.match("need"))
        {
            if(m.match("service"))
            {

            if(m.match("car")) {
                socket.emit("notify", {message: "25% service part offer for  car in toyata showroom"});
            }
            else if(m.match("bike")){
                socket.emit("notify", {message: "50% service offers for bikes in SK BIKE SHOWROOM"});
            }
            }
          else if(m.match("emergency"))
            {
                socket.emit("notify", {message: "Can i contact Emergency service!!!"});
            }
        }
        if(m.match("emergency"))
        {
            socket.emit("notify", {message: "Can i contact Emergency service!!!"});
        }
/*console.log(classifier.categorize(m));
var m1=classifier.categorize(m);
        var collection=_db.collection("user");



if(m1=="positive") {

}
  */


    }

socket.on("p_chat",function(data){
    var d=JSON.parse(data);
    var from=d.from;
    var to1=d.t;
    var msg=d.m;

    predict(msg,from,socket);
    console.log(d);
    if(users.user[to1])
    {
        var s=users.user[to1];
        console.log(s);
        io.to(s).emit("receive",{from:from,message:msg});



    }
    else
    {
        console.log("not online");
        socket.emit("receive",{from:to1,message:"not Online"});
    }


});


    socket.on("online",function(data){

        var d=JSON.parse(data);

        var no=d.no;

        var collection=_db.collection("user");
        collection.updateOne({_id:no},{$set:{status:"online"}});
    });



    socket.on("idle",function(data){

      var d=JSON.parse(data);

      var no=d.no;

      var collection=_db.collection("user");
      collection.updateOne({_id:no},{$set:{status:"idle"}});
  });



});  //end of socket


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

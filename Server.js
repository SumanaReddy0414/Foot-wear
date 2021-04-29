const express = require('express')
const app = express()
const bodyParser=require('body-parser')
const MongoClient=require('mongodb').MongoClient

var db,s;
MongoClient.connect('mongodb://localhost:27017/FootWear', (err, database)=>{
    if(err) return console.log(err)
    db=database.db('FootWear')
    app.listen(3000,()=>{
        console.log("Listentining at port number 6000")
    })
})

app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/',(req,res)=>{
    db.collection('ladies').find().toArray((err,result)=>{
            if(err) return console.log(err)
        res.render('home.ejs', {data :result})
    })
})

app.get('/insertdata',(req,res)=>{
    res.render('insertdata.ejs')
})
app.get('/update',(req,res)=>{
    res.render('update.ejs')
})
app.get('/delete',(req,res)=>{
    res.render('Delete.ejs')
})

app.post('/addData',(req,res)=>{
    db.collection('ladies').save(req.body,(err,result)=>{
        if(err) return console.log(err)
        res.redirect('/')
    })
})

app.post('/updateinfo',(req,res)=>{
    console.log(req.body.pid);
    var query = { pid: req.body.pid };
    var s;
   console.log("Requesting for: " + req.body.pid)
   db.collection("ladies").find(query).toArray(function (err, result) {
      if (err) throw err;      
      s=result.stock;
      console.log(result.stock+" kkkk   "+s+"  "+result);

   });

    
        console.log("OldStock: "+s+" "+"new "+req.body.nstock)
    db.collection('ladies').findOneAndUpdate({pid: req.body.pid},{
        $set : {stock : (s + parseInt(req.body.nstock)).toString()}},
        {sort: {_id:-1}},(err,result)=>{
            if(err) res.send(err)
            console.log(req.body.pid+ 'Stock updated')
            res.redirect('/')
    });
})


app.post('/deleterow',(req,res)=>{
    db.collection('ladies').findOneAndDelete({pid : req.body.pid},(err,result)=>{
        if(err) return console.log(err)
        res.redirect('/')
    })
})


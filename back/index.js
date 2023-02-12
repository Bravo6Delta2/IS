var express = require('express');
var http = require('http');
var logger = require('morgan');
var path = require('path');
var jwt = require('jsonwebtoken');
var app = express();
var cors = require('cors');
const { Pool, Client } = require('pg');
const bodyParser = require('body-parser');
const server = require('http').Server(app)
const io = require('socket.io')(server,{
    cors:{
        origin:'*',
        methods:['GET','POST']
    }
})

const db_cred = {
    user: 'postgres',
    host: 'localhost',
    database: 'Debate',
    password: 'aleksandar',
    port: 5432,
};
app.use(bodyParser.json());
app.use(logger("short"));
app.use(cors());
var publicPath =  path.resolve(__dirname,"front");
app.use(express.static(publicPath));



app.post('/register',async (req,res)=>{

    // console.log(req.body);
     let ret = {msg:''};
     if (!req.body){
         ret.msg = 'Neuspjesno';
         res.sendStatus = 200;
         res.json(ret);
         return;
     }
     try{
         const pool = new Pool(db_cred);
         const {rows} = await pool.query('SELECT * FROM KORISNIK WHERE EMAIL = $1;',[req.body.email]);
         //console.log(rows);
         if (rows.length == 1){
             ret.msg = 'email';
             res.sendStatus = 200;
             res.json(ret);
             return;
         }

         const xxx = await pool.query('SELECT * FROM KORISNIK WHERE USERNAME = $1;',[req.body.username]);
         //console.log(rows);
         if (xxx.rows.length == 1){
             ret.msg = 'username';
             res.sendStatus = 200;
             res.json(ret);
             return;
         }

         const xx = await pool.query('INSERT INTO KORISNIK (EMAIL,USERNAME,IME_PREZIME,PASSWORD) VALUES ($1,$2,$3,$4);',[req.body.email,req.body.username,req.body.ime_prezime,req.body.password]);  
         if (xx == 0){
             ret.msg = 'problem 1';
             res.sendStatus = 200;
             res.json(ret);
             return;
         }
         res.statusCode = 200;
         ret.msg = 'GG';
         res.json(ret);
         }
         catch(err){
            console.log(err);
            res.statusCode = 200;
            ret.msg = 'Xd';
            res.json(ret);
     }
 
});

app.post('/login', async(req,res)=>{
    let ret = {token:null,msg:''};
    if (!req.body){
        ret.msg = 'Neuspjesno';
        res.sendStatus = 200;
        res.json(ret);
        return;
    }
    try{
        let pool = new Pool(db_cred); 
        const { rows } = await pool.query('SELECT * FROM KORISNIK WHERE EMAIL = $1 AND PASSWORD = $2;',[req.body.email,req.body.password]);
        pool.end();
        if (rows.length == 0){
            ret.msg = 'Pogresno unijeti podaci';
            res.statusCode = 200;
            res.json(ret);
            return;
        }
        tok = jwt.sign( {email : req.body.email,username:rows[0].username},'aaaaaaaaaa',{expiresIn : '24h'});
        ret.token = tok;
        ret.msg ='GG';
        res.statusCode = 200;
        res.json(ret); 
        
    }
    catch(err){
        console.log(err);
        ret.msg ='Xd';
        res.statusCode = 200;
        res.json(ret); 
    }
});


app.post('/create',async (req,res) =>{
    let ret = {msg:''};
    if (!req.body){
        ret.msg = 'Neuspjesno';
        res.sendStatus = 200;
        res.json(ret);
        return;
    }
    try{
        jwt.verify(req.body.token,'aaaaaaaaaa')
        let username = jwt.decode(req.body.token).username
        const pool = new Pool(db_cred);
        const {rows} = await pool.query('INSERT INTO DEBATE (USERNAME,NAZIV,OPIS,KATEGORIJA,DATUM,POCELA,JAVNA,ZAVRSENA) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',[username,req.body.naziv,req.body.opis,req.body.kategorija,req.body.datum,false,true,false]);
        
            ret.msg = 'GG';
            res.sendStatus = 200;
            res.json(ret);
            return;   
    }
    catch(err){
        console.log(err);
        ret.msg ='Xd';
        res.statusCode = 200;
        res.json(ret); 
    }

})


app.post('/profil',async(req,res)=>{
    let ret = {msg:'',user:null};
    if (!req.body){
        ret.msg = 'Neuspjesno';
        res.sendStatus = 200;
        res.json(ret);
        return;
    }
    try{
        //console.log(req.body)
        jwt.verify(req.body.token,'aaaaaaaaaa')
        let username = jwt.decode(req.body.token).username
        const pool = new Pool(db_cred);
        const {rows} = await pool.query('SELECT * FROM KORISNIK WHERE USERNAME = $1',[username]);
        if(rows.length == 0){
            ret.msg = 'Neuspjesno';
            res.sendStatus = 200;
            res.json(ret);
            return;
        }
        ret.user = rows[0];
        ret.msg = 'GG';
        res.sendStatus = 200;
        res.json(ret);
        return;
    }
    catch(err){
        console.log(err);
        ret.msg ='Xd';
        res.statusCode = 200;
        res.json(ret); 
    }

})


app.post('/debateh',async (req,res)=>{

    let ret = {msg:'',debate:null};
    if (!req.body){
        ret.msg = 'Neuspjesno';
        res.sendStatus = 200;
        res.json(ret);
        return;
    }
    try{
        let offset = 10*(req.body.page - 1)
        const pool = new Pool(db_cred);
        const {rows} = await pool.query('SELECT * FROM DEBATE WHERE KATEGORIJA = $1 AND POCELA=$3 AND JAVNA = TRUE AND ZAVRSENA = FALSE ORDER BY ID DESC OFFSET $2 LIMIT 10',[req.body.kategorija,offset,req.body.pocela]);
        if(rows.length == 0){
            ret.msg = 'Neuspjesno';
            res.sendStatus = 200;
            res.json(ret);
            return;
        }
        ret.debate = rows;
        ret.msg = 'GG';
        res.sendStatus = 200;
        res.json(ret);
        return;
    }
    catch(err){
        console.log(err);
        ret.msg ='Xd';
        res.statusCode = 200;
        res.json(ret); 
    }

})

app.post('/chp',async (req,res)=>{
    let ret = {msg:''};
    if (!req.body){
        ret.msg = 'Neuspjesno';
        res.sendStatus = 200;
        res.json(ret);
        return;
    }
    try{
        jwt.verify(req.body.token,'aaaaaaaaaa')
        let username = jwt.decode(req.body.token).username
        const pool = new Pool(db_cred);
        const {rows} = await pool.query('UPDATE DEBATE SET JAVNA = $1 WHERE ID = $2',[req.body.javna,req.body.id])
        
        ret.msg = 'GG';
        res.sendStatus = 200;
        res.json(ret);
        return;
    }
    catch(err){
        console.log(err);
        ret.msg ='Xd';
        res.statusCode = 200;
        res.json(ret); 
    }
})

app.post('/start',async (req,res)=>{
    ret = {msg:''}
    if (!req.body){
        ret.msg = 'Neuspjesno';
        res.sendStatus = 200;
        res.json(ret);
        return;
    }
    try{
        jwt.verify(req.body.token,'aaaaaaaaaa')
        let username = jwt.decode(req.body.token).username
        const pool = new Pool(db_cred);
        const {rows} = await pool.query('UPDATE DEBATE SET POCELA = TRUE WHERE ID = $1',[req.body.id])
        
        ret.msg = 'GG';
        res.sendStatus = 200;
        res.json(ret);
        return;
    }
    catch(err){
        console.log(err);
        ret.msg ='Xd';
        res.statusCode = 200;
        res.json(ret); 
    }

})


app.post('/chz',async (req,res)=>{
    let ret = {msg:''};
    if (!req.body){
        ret.msg = 'Neuspjesno';
        res.sendStatus = 200;
        res.json(ret);
        return;
    }
    try{
        jwt.verify(req.body.token,'aaaaaaaaaa')
        let username = jwt.decode(req.body.token).username
        const pool = new Pool(db_cred);
        const {rows} = await pool.query('UPDATE DEBATE SET ZAVRSENA = TRUE WHERE ID = $1',[req.body.id])
        
        ret.msg = 'GG';
        res.sendStatus = 200;
        res.json(ret);
        return;
    }
    catch(err){
        console.log(err);
        ret.msg ='Xd';
        res.statusCode = 200;
        res.json(ret); 
    }
})



app.post('/debatek',async (req,res)=>{
    let ret = {msg:'',debate:null};
    if (!req.body){
        ret.msg = 'Neuspjesno';
        res.sendStatus = 200;
        res.json(ret);
        return;
    }
    try{
        let offset = 5*(req.body.page - 1)
        jwt.verify(req.body.token,'aaaaaaaaaa')
        let username = jwt.decode(req.body.token).username
        const pool = new Pool(db_cred);
        const {rows} = await pool.query('SELECT * FROM DEBATE WHERE USERNAME = $1 AND ZAVRSENA = FALSE ORDER BY ID DESC OFFSET $2 LIMIT 5',[username,offset]);
        ret.msg = 'GG';
        ret.debate = rows;
        res.sendStatus = 200;
        res.json(ret);
        return;
    }
    catch(err){
        console.log(err);
        ret.msg ='Xd';
        res.statusCode = 200;
        res.json(ret); 
    }


})


app.post("/sein",async (req,res)=>{
    let ret = {msg:''};
    if (!req.body){
        ret.msg = 'Neuspjesno';
        res.sendStatus = 200;
        res.json(ret);
        return;
    }
    try{
        jwt.verify(req.body.token,'aaaaaaaaaa')
        let username = jwt.decode(req.body.token).username
        const pool = new Pool(db_cred);
        const {rows} = await pool.query('INSERT INTO POZIVNICA (id_d,ui,ur) VALUES ($1,$2,$3)',[req.body.id,username,req.body.username]) 
        ret.msg = 'GG';
        res.sendStatus = 200;
        res.json(ret);
        return;
        }    
    catch(err){
        console.log(err);
        ret.msg ='Xd';
        res.statusCode = 200;
        res.json(ret); 
    }

})


app.post("/getin",async (req,res)=>{
    let ret = {msg:'',inv:null};
    if (!req.body){
        ret.msg = 'Neuspjesno';
        res.sendStatus = 200;
        res.json(ret);
        return;
    }
    try{
        jwt.verify(req.body.token,'aaaaaaaaaa')
        let username = jwt.decode(req.body.token).username
        const pool = new Pool(db_cred);
        const {rows} = await pool.query('Select * from pozivnica where ur = $1 and resp is null',[username]) 
        ret.msg = 'GG';
        ret.inv = rows;
        res.sendStatus = 200;
        res.json(ret);
        return;
        }    
    catch(err){
        console.log(err);
        ret.msg ='Xd';
        res.statusCode = 200;
        res.json(ret); 
    }
})


app.post('/rein',async (req,res)=>{
    let ret = {msg:''};
    if (!req.body){
        ret.msg = 'Neuspjesno';
        res.sendStatus = 200;
        res.json(ret);
        return;
    }
    try{
        jwt.verify(req.body.token,'aaaaaaaaaa')
        let username = jwt.decode(req.body.token).username
        const pool = new Pool(db_cred);
        const {rows} = pool.query('UPDATE POZIVNICA SET RESP = $1 WHERE ID_D = $2 AND UI=$3 AND UR =$4',[req.body.resp,req.body.id_d,req.body.ui,username])
        ret.msg = 'GG';
        res.sendStatus = 200;
        res.json(ret);
        return;
    }
    catch(err){
        console.log(err);
        ret.msg ='Xd';
        res.statusCode = 200;
        res.json(ret); 
    }

})


app.post("/getuc",async (req,res)=>{

    let ret = {msg:'',debate:null};
    if (!req.body){
        ret.msg = 'Neuspjesno';
        res.sendStatus = 200;
        res.json(ret);
        return;
    }
    try{
    jwt.verify(req.body.token,'aaaaaaaaaa')
    let username = jwt.decode(req.body.token).username
    const pool = new Pool(db_cred);
    const {rows} = await pool.query('SELECT * FROM DEBATE INNER JOIN POZIVNICA ON id = id_d where resp = true and ur = $1 and zavrsena = false;',[username])
    ret.msg = 'GG';
    ret.debate = rows;
    res.sendStatus = 200;
    res.json(ret);
    return;
    }
    catch(err){
        console.log(err);
        ret.msg ='Xd';
        res.statusCode = 200;
        res.json(ret); 
    }

})


app.post("/debata",async (req,res)=>{

    let ret = {msg:'',info:{info:null,ucs:null}};
    if (!req.body){
        ret.msg = 'Neuspjesno';
        res.sendStatus = 200;
        res.json(ret);
        return;
    }
    try{
        const pool = new Pool(db_cred);
        const {rows} = await pool.query('Select * from debate where id = $1',[req.body.id]) 
        if(rows.length == 0){
            ret.msg = 'Nema';
            res.sendStatus = 200;
            res.json(ret);
            return;
        }
        const xxx = await pool.query('Select ur from pozivnica where id_d = $1 and resp = true',[req.body.id])
        ret.msg = 'GG';
        ret.info.ucs = xxx.rows;
        ret.info.info = rows[0];
        res.sendStatus = 200;
        res.json(ret);
        return;
    }
    catch(err){
        console.log(err);
        ret.msg ='Xd';
        res.statusCode = 200;
        res.json(ret); 
    }
})



app.post('/getse',async (req,res)=>{
    let ret = {msg:''};
    if (!req.body){
        ret.msg = 'Neuspjesno';
        res.sendStatus = 200;
        res.json(ret);
        return;
    }
    try{
        jwt.verify(req.body.token,'aaaaaaaaaa')
        let username = jwt.decode(req.body.token).username
        const pool = new Pool(db_cred);
        const {rows} = await pool.query('Select * form pozivnica where id_d = $1 and ur = $2 and resp = true',[req.body.id,username]) 
        if(rows.length == 0){
            ret.msg = 'obicni';
            res.sendStatus = 200;
            res.json(ret);
            return;
        }
        ret.msg = 'spec';
        res.sendStatus = 200;
        res.json(ret);
        return;
        }    
    catch(err){
        console.log(err);
        ret.msg ='Xd';
        res.statusCode = 200;
        res.json(ret); 
    }

})




io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
    //console.log(roomId,userId)
    socket.join(roomId)
    socket.to(roomId).emit('user-connected', userId)
    
    socket.on('send-msg',(data)=>{
        socket.to(data.roomId).emit('rcv-msg', {userId:data.userId,msg:data.msg})
    })

      socket.on('dis', () => {
        socket.to(roomId).emit('dis', userId)
        console.log("d",roomId,userId)
    })
    })
  })

server.listen(3001);
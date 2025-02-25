const express = require("express");
const { PrismaClient } = require('@prisma/client');
const bodyParser = require('body-parser')

const app = express();
app.use(bodyParser.json());
const prisma = new PrismaClient();


app.get('/', (req, res) => {
    res.send("Hello World!!");
});

app.get('/user', async (req, res) => {
    const data = await prisma.user.findMany();
    const finalData = await data.map(record => {
        console.log("record" , record);
        delete record.password;
        return record;
    })
    res.json({
        message: "OK",
        data: finalData
    });
});

app.get('/user-raw', async (req, res) => {
    const data = await prisma.$queryRaw`SELECT id, username as user FROM User`;
    res.json({
        message: "OK",
        data: data
    });
});

app.post('/user', async (req, res) => {
    console.log(req.body);
    // const response = await prisma.user.create(req.body);
    const response = await prisma.user.create( {
        data: {
            username: req.body.username,
            password: req.body.password
    }
    });
    if(response){
 res.json({
        message: "add data successfully",
    });
    }else{
        res.json({
            message: "add data error",
        });
    }
   
});

app.listen(3000 , () => {
    console.log("Server is running on port 3000");
});
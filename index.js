const path = require('path');
const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const app = express();

app.set('port', process.env.PORT || 3000);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log("DB connected");
})

const db = client.db("royi")
const users = db.collection("users");
const messages = db.collection("messages");

app.post("/user/add", (req, res) => {
    users.find({ email: req.body.email }).toArray((err, items) => {
        if (items.length > 1) {
            res.json("usuario registrado");
        }
        else {
            users.insertOne({ uid: req.body.uid, name: req.body.displayName, photo: req.body.photoURL, email: req.body.email });
        }
    })
})

app.get("/message/all", (req, res) => {
    messages.find().toArray((err, items) => {
        res.json(items);
    })
})

app.get("/user/all", (req, res) => {
    users.find().toArray((err, items) => {
        res.json(items);
    })
})

const server = app.listen(app.get('port'), () => {
    console.log('server on port', app.get('port'));
});

const SocketIO = require('socket.io');
const io = SocketIO(server);

io.on('connection', (socket) => {
    socket.on('chat:message', (data) => {
        io.sockets.emit('chat:message', data);
        messages.insertOne(data);
    });

    socket.on('chat:typing', (data) => {
        socket.broadcast.emit('chat:typing', data);
    })
});

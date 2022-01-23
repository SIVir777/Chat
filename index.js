const express = require('express');
const cors = require('cors');
const events = require('events');
const fs = require('fs');


const emitter = new events.EventEmitter();
const Port = process.env.PORT || 3000;
const app = express();

// app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', function (req, res) {
    sendFile('../chat rabochiy/client/index.html', res);
});

app.get('/main.css', function(req, res) {
    sendFile('../chat rabochiy/client/main.css', res);
});

app.get('/Script.js', function(req, res) {
    sendFile('../chat rabochiy/client/Script.js', res);
});

function sendFile(url, res) {
    fs.stat(url, function(err, stat) {
        if (err) {
            res.statusCode = 404;
            res.end('File not found');
            console.log(err);
            return;
        };
        let potok = new fs.ReadStream(url);
        potok.pipe(res);
        potok.on('error', function(err) {
            if (err) {
                res.ststusCode = 500;
                res.end('Server error');
                console.log(err);
            };
        });
        res.on('close', function() {
            potok.destroy();
        });
    });
};

app.get('/get-message', function(req, res) {
    emitter.once('/prishlo-message', function(message) {
        res.json(message);
    });
});

app.post('/new-message', function(req, res) {
    const object = req.body;
    const message = object.message;
    emitter.emit('/prishlo-message', message);
    res.status(200);
    res.json('Ответ на пост запрос')
});


app.listen(Port, function() {
    console.log(`server running on port ${Port}`);
});

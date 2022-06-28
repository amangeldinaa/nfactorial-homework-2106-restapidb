import express, { request } from "express";
import bodyParser from "body-parser";
import { connect, getDB } from "./db.js";
import { ObjectId } from "mongodb";
import "dotenv/config";

const app = express();
const port = process.env.port || 8080;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

connect();

app.get('/', (req, res) => {
    res.status(200).send();
});

app.get('/items', (req, res) => {

    getDB()
    .collection('items')
    .find({})
    .sort({'name': 1})
    .toArray((err, result) => {
        if (err) {
            res.status(500).json({ err: err });
            return;
        }
        res.status(200).json(result);
    });
});

app.post('/item', (req, res) => {
    const {name, deadline} = req.body;

    getDB()
    .collection('items')
    .insertOne({'name': name, 'deadline': deadline}, (err) => {
        if (err) {
            res.status(500).json({ err: err });
            return;   
        }
        res.status(200).send();
    });
});


app.delete('/item/:id', (req, res) => {
    
    getDB()
    .collection('items')
    .deleteOne({ _id: new ObjectId(req.params.id) }, (err) => {
        if (err) {
            res.status(500).json({ err: err });
            return;   
        }
        res.status(200).send();
    });
});

app.listen(port, () => {
    console.log('Server started!');
});
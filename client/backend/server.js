const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const Data = require('./data');
const https = require('https');
const fs = require('fs');


const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();

// this is our MongoDB database
const dbRoute = 'mongodb+srv://ben:Umaga123@duombaze-vt9gv.mongodb.net/test?retryWrites=true&w=majority';
// connects our back end code with the database
mongoose.connect(dbRoute, {useNewUrlParser: true});

let db = mongoose.connection;

db.once('open', () => console.log('connected to the database'));

// checks if connection with the database is successful
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(logger('dev'));

// this is our get method
// this method fetches all available data in our database
router.get('/getData', (req, res) => {
    Data.find((err, data) => {
        if (err) return res.json({success: false, error: err});
        return res.json({success: true, data: data});
    });

});

router.get('/getOneChamp/:id', (req, res) => {


    var id = req.params.id;


    Data.findOne({ _id: id }, function (err, data) {
        if (err) return res.json({success: false, error: err});

        return res.json({success: true, data: data});
    });
});

// this is our update method
// this method overwrites existing data in our database
router.post('/updateChamp', (req, res) => {
    console.log("BODY" ,req.body);
    const id = req.body.idChamp;
    const champ = req.body.champ;
    console.log("REQ", id, champ);

    Data.findByIdAndUpdate(id, champ, (err) => {
        console.log(err)
        if (err) return res.json({success: false, error: err});
        return res.json({success: true});
    });
});

// this is our delete method
// this method removes existing data in our database
router.get('/removeOneChamp/:id', (req, res) => {
    var id = req.params.id;
    Data.findByIdAndRemove(id, (err) => {
        if (err) return res.send(err);
        return res.json({success: true});
    });
});

// this is our create methid
// this method adds new data in our database
router.post('/putData', (req, res) => {
    let data = new Data();

    const {name, armor, attackDamage, mana, hp, photo} = req.body;

    if (((!name || !armor || !attackDamage || !mana || !hp))) {
        return res.json({
            success: false,
            error: 'INVALID INPUTS',
        });
    }

    data.name = name;
    data.armor = armor;
    data.attackDamage = attackDamage;
    data.mana = mana;
    data.hp = hp;
    data.photo = photo;

    data.save((err) => {
        if (err) return res.json({success: false, error: err});
        return res.json({success: true});
    });
});

// append /api for our http requests
app.use('/api', router);

// we will pass our 'app' to 'https' server
const httpsServer = https.createServer({
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem'),
    passphrase: 'asdasd'
}, app);

httpsServer.listen(3001, () => {
    console.log('HTTPS Server running on port 3001');
});

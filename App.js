const express= require ('express');
const fileUpload = require ('express-fileupload');
const bodyParser = require ('body-parser');
const mysql = require ('mysql');
const path = require ('path');
const app = express();

const port = 5000;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password : '',
    database: 'socka'
});

const {getHomePage} = require('./routes/index');
const {addPlayerPage,addPlayer, deletePlayer, editPlayer, editPlayersPage} = require ('./routes/player');

db.connect((err)=>{
    if (err) {
        throw err;
    }
    console.log('connected to database');
});
global.db = db;

app.set('port', process.env.port || port);
app.set('views',__dirname + '/views');
app.set ('view engine', 'ejs');
app.use (bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use (fileUpload());


app.listen(port,() => {
    console.log(`Server running on port: ${port}`);
});

app.get('/',getHomePage);
app.get('/add', addPlayerPage);
app.get('/edit:id', editPlayersPage);
app.get('/delete/:id', deletePlayer);
app.post('/add', addPlayer);
app.post('/edit/:id', editPlayer);

app.listen(port, () =>{
    console.log(`Server running on port: ${port}`);
});
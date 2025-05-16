
const express = require ('express');
const cors = require ('cors');

const app = express();


app.use(express.json());
app.use(cors());


users={
    "mugnozzo": {
        "age": 39,
        "mail": "meil@mail.it",
        "tel": "+39 012 4651 123"
    },
    "pippo": {
        "age": 80,
        "mail": "pippo@mail.it",
        "tel": "+60 11 2222 1333"
    },
    "pluto": {
        "age": 5,
        "mail": "pluto@mail.it",
        "tel": "+355555555"
    },
    "tolopino": {
        "age": 150,
        "mail": "topolino@mail.it",
        "tel": "+40 5060606 54046064"
    },
}

//Route 1: Home page
app.get('/', (req, res) => {
    
    res.json({
        status: "ok"
    
    });
});

//Route 2: User query
app.get('/user/query', (req, res) => {
    response = {} //oggetto che passo in uscita ed inizialmente è vuoto
    if (req.query.username in users) {
        response = {
            status: "ok",
            user_data: users[req.query.username]
        }}
        else{
            response = {
                status: "Error",
                message: "User not found in database"
            };
        }
        res.json(response);
        });


// Server Start
app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});

console.log("Il server sta funzionando");

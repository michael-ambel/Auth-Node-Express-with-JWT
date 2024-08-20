const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/userRout.js');
const cookieParser = require('cookie-parser');
const { routeProtect, identifyUser } = require('./middleware/authMiddle.js');

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs')
app.use(express.json())
app.use(cookieParser())

const uri = 'mongodb+srv://blog:blogblog@clusblogaut.rryro.mongodb.net/bloguser?retryWrites=true&w=majority&appName=ClusBlogAut'
mongoose.connect(uri)
.then(result=>app.listen(3000))
.then(() => { 
    console.log('DB connected');
    console.log('Server connected');
})
.catch(err => console.log(err));

app.get('*', identifyUser)
app.get('/', (req, res) => {res.render('home.ejs')})
app.get('/smoothies', routeProtect, (req, res) =>{res.render('smoothies.ejs')})
app.use(router);



// app.get('/set-cookies', (req, res) => {
//     //res.setHeader('Set-Cookie', 'newUser=true')

//     res.cookie('newUser', false, {httpOnly: true})
//     res.cookie('isEmploy', true, {maxAge: 1000*60*60*24, secure: true})
//     res.send('cookie recived')
// })

// app.get('/get-cookies', (req, res) => {
//     const cookies = req.cookies;
//     res.send(cookies)
//     console.log(cookies);
// })
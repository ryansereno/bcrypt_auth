const express = require("express")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const app = express()
const User = require("./models/user")
const session = require('express-session')

mongoose.connect("mongodb://localhost:27017/authDemo", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(express.urlencoded({extended: true}))
app.use(session({secret:'privatekey'}))

app.get('/', (req,res) =>{
    res.send('this is the homepage')
})

app.get('/register', (req,res) =>{
    res.render('register')
})

app.post('/register', async (req,res) =>{
    const {username} = req.body
    const {password} = req.body
    const hashpw = await bcrypt.hash(password, 12)
    const user = new User({
        username: username,
        password: hashpw 
    })
    await user.save()
    req.session.user_id = user._id
    res.redirect('/')
})


app.get('/login', (req,res) =>{
    res.render('login')
})


app.post('/login', async (req,res) =>{
    const {username} = req.body
    const {password} = req.body
    const user = await User.findOne({username: username})
    const passValid = await bcrypt.compare(password, user.password)
    if(passValid) {
        req.session.user_id = user._id //setting the session user id to the user._id of the mongoDB user document
        res.send('correct')

    }else{
        res.send('incorrect')
    }
})

app.get('/secret', (req,res) =>{
    if (!req.session.user_id){
    res.redirect('/login')
    }else{
        res.send('this is an authorized page')
    }
})

app.listen(3000, () =>{
    console.log('Listening on port 3000')
})

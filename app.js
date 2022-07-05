const express = require("express")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const app = express()
const User = require("./models/user")


mongoose.connect("mongodb://localhost:27017/authDemo", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(express.urlencoded({extended: true}))


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
        res.send('correct')
    }else{
        res.send('incorrect')
    }
    res.redirect('/')
})

app.get('/secret', (req,res) =>{
    res.send('password site')
})

app.listen(3000, () =>{
    console.log('Listening on port 3000')
})

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const {Schema} = mongoose
const dbConnect = require('./config/db')


require('dotenv').config()


dbConnect() // connects to db

app.use(express.json()) // needed to parse the body of the request



const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: String,
    image: String
},
{timestamps: true}
)

const Category = mongoose.model('Category', categorySchema)


app.get('/', (req, res) => {
    console.log('Hello from route')

    res.send('Hello from express')
})

app.post('/categories/add', async (req, res) => {

    try {
        console.log("🚀 ~ module.exports.add= ~ req.body", req.body)
        
        const category = await Category.create(req.body) // adds a document to the DB
        console.log("🚀 ~ module.exports.add= ~ category", category)
        
        res.send('hello from cat add')
    } catch (error) {
        console.log("🚀 ~ Category add error ", error)
        
    }

})

// syntax app.use('path', express.static('storedpathofthefile'))
app.use('/images', express.static('./server/uploads'))

const port = process.env.PORT || 4001
app.listen(port, () => console.log('Server is up and running at port', port))
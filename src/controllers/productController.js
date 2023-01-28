const Product = require('../models/Product')

module.exports.add = async (req, res) => {

    try {
        
        console.log("🚀 ~ product add hello", req.body)

        console.log("🚀 ~ product add file", req.file)
        
        req.body.image = req.file.filename

        const newProduct = await Product.create(req.body)
        console.log("🚀 ~ module.exports.add= ~ newProduct", newProduct)

        if (!newProduct) return res.send({success: false, errorId: 2})

        res.send({success: true, product: newProduct})

    } catch (error) {
        console.log("🚀 ~ product add error", error.message)

        res.send({success: false, error: error.message})
        
    }
}

module.exports.list = async (req, res) => {

    try {
        
        console.log("🚀 ~ product list hello", req.query)

        const skip = req.query.skip === undefined ? 0 : Number(req.query.skip)

        const products = await Product
        .find()
        .sort('-_id')
        .limit(5)
        .skip(skip)

        const total = await Product.countDocuments()
        console.log("🚀 ~ module.exports.list= ~ total", total)

        res.send({success: true, products, total})

    } catch (error) {
        console.log("🚀 ~ product list error", error.message)

        res.send({success: false, error: error.message})
        
    }
}

module.exports.delete = async (req, res) => {

    try {
        
        console.log("🚀 ~ product delete hello", req.params)

        const deletedProduct = await Product.findByIdAndDelete(req.params._id)

        console.log("🚀 ~ module.exports.delete ~ deletedProduct", deletedProduct)

        if (!deletedProduct) return res.send({success: false, errorId: 1})
        

        res.send({success: true})

    } catch (error) {
        console.log("🚀 ~ product delete error", error.message)

        res.send({success: false, error: error.message})
        
    }
}

module.exports.findone = async (req, res) => {

    try {
        
        console.log("🚀 ~ product findone hello", req.query)

        const product = await Product.findOne(req.query).select('-__v')
        console.log("🚀 ~ module.exports.findone= ~ product", product)

        res.send({success: true, product})

    } catch (error) {
        console.log("🚀 ~ product findone error", error.message)

        res.send({success: false, error: error.message})
        
    }
}

module.exports.edit = async (req, res) => {

    try {
        
        console.log("🚀 ~ product edit hello", req.body)

        const {_id, ...product} = req.body
        console.log("🚀 ~ _id, product", _id, product)

        product.image = req.file.filename
        console.log("🚀 ~ req.file", req.file)

        // // findByIdAndUpdate({filter}, {updated resource}, {options})
        const newProduct = await Product.findByIdAndUpdate({_id}, {...product}, {new: true})
        console.log("🚀 ~ module.exports.edit= ~ newProduct", newProduct)

        if (!newProduct) return res.send({success: false, errorId: 1})

        res.send({success: true, product: newProduct})

    } catch (error) {
        console.log("🚀 ~ product edit error", error.message)

        res.send({success: false, error: error.message})
        
    }
}
module.exports.search = async (req, res) => {

    try {
        
        console.log("🚀 ~ product search hello", req.body)

        let filter = {}


        if (req.body.text) {
            const regExp =  new RegExp(req.body.text, 'i')
            filter.name = regExp
        }

        if (req.body.minPrice > 0 || req.body.maxPrice > 0) {
            filter.price = {$gte: req.body.minPrice, $lte: req.body.maxPrice}
        }

        console.log("🚀 ~ filter", filter)

        const products = await Product.find(filter)

        // const products = await Product.find({name: {$regex: /ani/i}})
        // const products = await Product.find({
        //     name: regExp,
        //     price: {$gte: req.body.minPrice, $lte: req.body.maxPrice}
        // })
        console.log("🚀 ~ products", products)

        res.send({success: true, products})

    } catch (error) {
        console.log("🚀 ~ product search error", error.message)

        res.send({success: false, error: error.message})
        
    }
}
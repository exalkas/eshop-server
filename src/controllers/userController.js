const { Types } = require('mongoose')
const User = require('../models/User')

// module.exports = function register () {}

module.exports.register = async (req, res) => {

    try {
        
        console.log('Hello from register', req.body)
    
        await User.create(req.body)
    
    
        res.send({success: true})

    } catch (error) {
        console.log("🚀 ~ register error", error.message)

        res.send({success: false, error: error.message})
        
    }
}

module.exports.login = async (req, res) => {

    try {
        console.log('Hello from login', req.body)

        // User.find(some object) RETURNS AN ARRAY
        // User.findONe(some object) RETURNS AN OBJECT
        const user = await User
        .findOne(req.body)
        .select('-password -__v')
        // .populate({path: 'wishlist', select: 'name price image'})
    
        // const user = await User.find({
        //     email: req.body.email,
        //     password: req.body.password
        // })
        
        console.log("🚀 ~ user", user)

        if (!user) return res.send({success: false, errorId: 1})
    
        res.send({success: true, user})
    } catch (error) {
        console.log("🚀 ~ login error", error.message)

        res.send({success: false, error: error.message})
    }
   
}

module.exports.list = async (req, res) => {

    try {
        console.log('Hello from list')

        const users = await User.find().select('-password -__v')
        console.log("🚀 ~ module.exports.list= ~ users", users)
    
        // THIS IS THE RESPONSE TO THE CLIENT
        res.send({success: true, users})
    } catch (error) {
        console.log("🚀 ~ list error", error.message)

        res.send({success: false, error: error.message})
    }
   
}

module.exports.delete = async (req, res) => {

    try {
        console.log('Hello from delete', req.params)

        const deletedUser= await User.findByIdAndDelete(req.params._id)
        console.log("🚀 ~ module.exports.delete ~ deletedUser", deletedUser)

        if (!deletedUser) return res.send({success: false, errorId: 1})
       
        res.send({success: true})
    } catch (error) {
        console.log("🚀 ~ delete error", error.message)

        res.send({success: false, error: error.message})
    }
   
}

module.exports.findOne = async (req, res) => {

    try {
        console.log('Hello from findone', req.params)

        const user = await User.findById(req.params._id).select('-__v')
        console.log("🚀 ~ module.exports.findOne= ~ user", user)
       
        res.send({success: true, user})
    } catch (error) {
        console.log("🚀 ~ findone error", error.message)

        res.send({success: false, error: error.message})
    }
   
}

module.exports.edit = async (req, res) => {

    try {
        console.log('Hello from user edit', req.body)

        if (!req.body.username ||
            !req.body.email ||
            !req.body.password
            ) return res.send({success: false, errorId: 3})

        const {_id, ...user} = req.body
        // console.log("🚀 ~ module.exports.edit= ~ _id", _id)
        // console.log("🚀 ~ module.exports.edit= ~ user", user)

        // findByIdAndUpdate({filter}, {new values}, {options/parameters})

        // const updatedUser = await User.findByIdAndUpdate({_id: req.body._id}, {
        //     username: req.body.username,
        //     password: req.body.password,
        //     email: req.body.email
        
        // }, {new: true})

        const updatedUser = await User.findByIdAndUpdate(_id, {...user}, {new: true})
        console.log("🚀 ~ module.exports.edit= ~ updatedUser", updatedUser)

        if (!updatedUser) return res.send({success: false, errorId: 1})
       
        res.send({success: true})
    } catch (error) {
        console.log("🚀 ~ edit user error", error.message)

        res.send({success: false, error: error.message})
    }
   
}

module.exports.addToCart = async (req, res) => {

    try {
        console.log('Hello from add to cart', req.body)

        const user = await User.findById(req.body._id)

        // check if the product is already there

        const product = user.cart.filter(item => item.product.toString() === req.body.product)
        console.log("🚀 ~ product", product)

        let cart = [];
        
        if (!product.length) { // product is not in the cart

            
            const newUser = await User.findByIdAndUpdate(
                {
                    _id: req.body._id                
                },
                {
                    $push: {
                        cart: {
                            product: req.body.product,
                            quantity: 1
                        }
                    }
                },
                {new: true})
            console.log("🚀 ~ newUser", newUser)

            cart = [...newUser.cart]
        } else { // product is in the cart

            const newUser1 = await User.findByIdAndUpdate(
                {
                    _id: req.body._id,
                    // 'cart.product': req.body.product
                    cart: {$elemMatch: {product: req.body.product}},                
                },
                {
                    $inc: { 'cart.$[alkis].quantity': 1 }
                },
                {
                    arrayFilters: [{'alkis.product': req.body.product}],
                    new: true
                })
            console.log("🚀 ~ newUser", newUser1)
            cart = [...newUser1.cart]
        }

        // console.log("🚀 ~ module.exports.addToCart= ~ user", user.cart)

        res.send({success: true, cart})
    } catch (error) {
        console.log("🚀 ~ add to cart error", error.message)

        res.send({success: false, error: error.message})
    }

}
module.exports.addToCartOld = async (req, res) => {

    try {
        console.log('Hello from add to cart', req.body)

        const user = await User.findByIdAndUpdate(
            {_id: req.body._id},
            {
                $push: {
                    cart: req.body
                }
            },
            {new: true})

        console.log("🚀 ~ module.exports.addToCart= ~ user", user)

        res.send({success: true})
    } catch (error) {
        console.log("🚀 ~ add to cart error", error.message)

        res.send({success: false, error: error.message})
    }

}

module.exports.removeFromCart = async (req, res) => {

    try {
        console.log('Hello from remove from cart', req.body)

        const user = await User.findById(req.body._id)

        // console.log("🚀 ~ module.exports.removeFromCart= ~ user", user)

        const cart = user.cart.filter(item => item.product.toString() !== req.body.product)
        console.log("🚀 ~ module.exports.removeFromCart= ~ products", cart)

        const updatedUser = await User.findByIdAndUpdate(
            {_id: req.body._id},
            {cart},
            {new: true}
        )
        console.log("🚀 ~ module.exports.removeFromCart= ~ updatedUser", updatedUser)

        res.send({success: true, cart})
    } catch (error) {
        console.log("🚀 ~ remove from cart error", error.message)

        res.send({success: false, error: error.message})
    }

}
module.exports.updateCart = async (req, res) => {

    try {
        console.log('Hello from update cart', req.body)

        const newUser = await User.findByIdAndUpdate(
            {
                _id: req.body._id,
                'cart.product': req.body.product
                // cart: {$elemMatch: {product: req.body.product}},                
            },
            {
                $set: { 'cart.$[alkis].quantity': req.body.quantity }
            },
            {
                arrayFilters: [{'alkis.product': req.body.product}],
                new: true
            })
        console.log("🚀 ~ newUser", newUser)

        res.send({success: true, cart: newUser.cart})
    } catch (error) {
        console.log("🚀 ~ update cart error", error.message)

        res.send({success: false, error: error.message})
    }

}
module.exports.listCart = async (req, res) => {

    try {
        console.log('Hello from list cart', req.params)

        const user = await User
        .findById(req.params.user)
        .populate({path: "cart.product", select: "-__v"})
        // .populate({path:"cart", populate: {path: "product", select: "-__v"} })

        console.log("🚀 ~ update cart: user", user)

        res.send({success: true, products: user.cart})
    } catch (error) {
        console.log("🚀 ~ list cart error", error.message)

        res.send({success: false, error: error.message})
    }

}

module.exports.addToWishlistClientLogic = async (req, res) => {

    try {
        console.log('Hello from add to wishlist', req.body)

        const user = await User.findByIdAndUpdate(
            {_id: req.body.user},
            {
                $push: {
                    wishlist: req.body.product
                }
            },
            {new: true})

        console.log("🚀 ~ module.exports.addToCart= ~ user", user)

        res.send({success: true})
    } catch (error) {
        console.log("🚀 ~ add to cart error", error.message)

        res.send({success: false, error: error.message})
    }

}

module.exports.removeFromWishlistClientLogic = async (req, res) => {

    try {
        console.log('Hello from remove from cart', req.body)

        const user = await User.findById(req.body.user)

        console.log("🚀 ~ user", user)

        const wishlist = user.wishlist.filter(item => item.toString() !== req.body.product)
        console.log("🚀 ~ wishlist", wishlist)

        const updatedUser = await User.findByIdAndUpdate(
            {_id: req.body.user},
            {wishlist},
            {new: true}
        )
        console.log("🚀 ~ updatedUser", updatedUser)

        res.send({success: true, wishlist: updatedUser.wishlist})
    } catch (error) {
        console.log("🚀 ~ remove from cart error", error.message)

        res.send({success: false, error: error.message})
    }

}
module.exports.listWishlist = async (req, res) => {

    try {
        console.log('Hello from Wishlist', req.params)

        const user = await User
        .findById(req.params.user)
        .populate({path: 'wishlist', select: '-__v'})

        
        res.send({success: true, wishlist: user.wishlist})
    } catch (error) {
        console.log("🚀 ~ list wishlist error", error.message)

        res.send({success: false, error: error.message})
    }

}
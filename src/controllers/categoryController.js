const Category = require('../models/Category')

module.exports.add = async (req, res) => {

    try {
        console.log("🚀 ~ module.exports.add= ~ req.body", req.body)
        
        const category = await Category.create(req.body) // adds a document to the DB
        console.log("🚀 ~ module.exports.add= ~ category", category)
        
        res.send('hello from cat add')
    } catch (error) {
        console.log("🚀 ~ Category add error ", error)
        
    }

}

module.exports.list = async (req, res) => {

    try {
        console.log("🚀 ~ module.exports.add= ~ req.body", req.body)
        
        const categories = await Category.find()
        
        res.send({success: true, categories})
    } catch (error) {
        console.log("🚀 ~ Category list error ", error)
        
    }

}

module.exports.deleteQuery = async (req, res) => {

    try {
        console.log("🚀 ~ delete ", req.query)
        
        const deletedCategory = await Category.findByIdAndDelete({_id: req.query.id})
        console.log("🚀 ~ module.exports.deleteQuery ~ deletedCategory", deletedCategory)
        
        res.send({success: true})
    } catch (error) {
        console.log("🚀 ~ Category delete error ", error)
        res.send({success: false, error: error.message})
    }

}

module.exports.deleteParams = async (req, res) => {

    try {
        console.log("🚀 ~ delete ", req.params)
        
        const deletedCategory = await Category.findByIdAndDelete({_id: req.params._id})
        console.log("🚀 ~ module.exports.deleteQuery ~ deletedCategory", deletedCategory)
        
        res.send({success: true})
    } catch (error) {
        console.log("🚀 ~ Category delete error ", error)
        res.send({success: false, error: error.message})
    }

}

module.exports.edit = async (req, res) => {

    try {
        console.log("🚀 ~ edit ", req.body)
        
        // ({filter}, {updated values}, {options})
        const updatedCategory = await Category.findByIdAndUpdate(
            {_id: req.body._id},
            {
                name: req.body.name,
                description: req.body.description
            },
            {new: true}
            )
        console.log("🚀 ~ module.exports.edit= ~ updatedCategory", updatedCategory)
        
        res.send({success: true, category: updatedCategory})
    } catch (error) {
        console.log("🚀 ~ Category edit error ", error)
        res.send({success: false, error: error.message})
    }

}

module.exports.editDestructuring = async (req, res) => {

    try {
        console.log("🚀 ~ edit ", req.body)

        const {_id, ...document} = req.body
        
        // ({filter}, {updated values}, {options})
        const updatedCategory = await Category.findByIdAndUpdate(
            {_id},
            {
                ...document
            },
            {new: true}
            )
        console.log("🚀 ~ module.exports.edit= ~ updatedCategory", updatedCategory)
        
        res.send({success: true, category: updatedCategory})
    } catch (error) {
        console.log("🚀 ~ Category edit error ", error)
        res.send({success: false, error: error.message})
    }

}
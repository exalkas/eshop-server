const express = require('express')
const router = express.Router()

const categoryController = require('../controllers/categoryController')

router.post('/add', categoryController.add)
router.get('/list', categoryController.list)
router.delete('/deleteparams/:_id', categoryController.deleteParams) // params
router.delete('/deletequery', categoryController.deleteQuery) // query
router.patch('/edit', categoryController.edit)
router.patch('/editdestructured', categoryController.editDestructuring)

module.exports = router
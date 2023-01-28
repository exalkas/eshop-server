const express = require('express')
const router = express.Router()

const productController = require('../controllers/productController')

const multer = require('multer')

// const uploadMulterSimple = multer({dest: './server/uploads'})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        
      cb(null, './server/uploads')
    },
    filename: function (req, file, cb) {
        console.log("🚀 ~ INSIDE DESTINATION: file:", file)

        let extension = ''

        if (file.mimetype.includes('image')) extension = file.mimetype.slice(6) // gets the characters after index 5

        const newFile = file.fieldname + '-' + Date.now() + '.' + extension
        console.log("🚀 ~  INSIDE DESTINATION: file READY", newFile)
      cb(null, newFile)
    }
  })

  
const uploadMulterAdvanced = multer({ storage: storage })

router.post('/add', uploadMulterAdvanced.single('image'),  productController.add)
router.post('/edit', uploadMulterAdvanced.single('image'),  productController.edit)

router.get('/list', productController.list)
router.delete('/delete/:_id', productController.delete)
router.get('/findone', productController.findone)

router.post('/search', productController.search)



module.exports = router
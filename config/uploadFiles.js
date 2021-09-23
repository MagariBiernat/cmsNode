const multer = require("multer")
const fs = require("fs")
const { promisify } = require("util")
const { uuid } = require("uuidv4")

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/")
  },

  filename: function (req, file, cb) {
    const randomPart = uuid()
    const extension = file.mimetype.split("/")[1]
    cb(null, Date.now() + "-" + randomPart + `.${extension}`)
  },
})

const imageFilter = function (req, file, cb) {
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = "Only image files are allowed!"
    return cb(new Error("Only image files are allowed!"), false)
  }
  cb(null, true)
}

exports.upload = multer({
  storage: storage,
  fileFilter: imageFilter,
}).array("images", 10)

const unlinkAsync = promisify(fs.unlink)

exports.deleteFiles = async (files) => {
  files.forEach(async (file) => {
    console.log("deleting file : " + file.path)
    await unlinkAsync(file.path)
  })
}

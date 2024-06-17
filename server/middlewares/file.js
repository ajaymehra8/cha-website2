const multer = require('multer');
const asyncHandler = require("express-async-handler");
const sharp = require('sharp');
const { storage } = require('../config/firebaseConfig');
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

const uploadUserPhoto = upload.single('pic');

const resizeUserPhoto = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();
  
  req.file.buffer = await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toBuffer();

  next();
});

const uploadPhotoToFirebase = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();

  const fileBuffer = req.file.buffer;
  const fileName = req.file.originalname;

  try {
    const storageRef = ref(storage, `users/${fileName}`);
    const uploadResult = await uploadBytes(storageRef, fileBuffer);
    const downloadUrl = await getDownloadURL(uploadResult.ref);

    req.file.filename = downloadUrl;
    console.log('Download URL:', downloadUrl);

    next();
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = { uploadUserPhoto, resizeUserPhoto, uploadPhotoToFirebase };

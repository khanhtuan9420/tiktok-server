const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

function checkType(req, res, next) {
  // console.log(req.file)
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const isImage = req.file.mimetype.startsWith('image/');
  const isVideo = req.file.mimetype.startsWith('video/');

  if (isImage) {
    req.uploadType = 'image';
  } else if (isVideo) {
    req.uploadType = 'video';
  } else {
    return res.status(400).json({ error: 'Invalid file type' });
  }

  next();
}

// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: 'image',
//     allowed_formats: ['png', 'jpg', 'jpeg', 'mp4'],
//     resource_type: 'image',
//     use_filename: false,
//     unique_filename: true,
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname); 
//   }
// });

const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'image',
    allowed_formats: ['png', 'jpg', 'jpeg'],
    resource_type: 'image',
    use_filename: false,
    unique_filename: true,
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

// Cấu hình lưu trữ cho video
const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'video',
    allowed_formats: ['mp4'],
    resource_type: 'video',
    use_filename: false,
    unique_filename: true,
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const deleteFile = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log(result);
  } catch (error) {
    console.error(error);
  }
};

// Tải lên hình ảnh
const uploadImageCloud = multer({ storage: imageStorage });

// Tải lên video
const uploadVideoCloud = multer({ storage: videoStorage });

module.exports = { checkType, uploadImageCloud, uploadVideoCloud, deleteFile };
const multer = require("multer");
const path = require("path");

const filebaseConfig = require("../config/firebase.config");
const {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} = require("firebase/storage");
const { initializeApp } = require("firebase/app");

// Initialize Firebase
const app = initializeApp(filebaseConfig);
const firebasestorage = getStorage(app);

//Set Storage engine
// const storage = multer.diskStorage({
//   destination: "./uploads/",
//   filename: (req, file, cb) => {
//     cb(
//       null,
//       file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//     );
//   },
// });

// Init Upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1000000 }, //limit 1Mb
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb); // Check file extension
  },
}).single("file"); // input name

function checkFileType(file, cb) {
  const fileTypes = /jpeg|jpg|png|gif|webp/;
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (mimetype && extName) {
    return cb(null, true);
  } else {
    cb("Error: Image Only!");
  }
}

// Upload file to Firebase storage
async function uploadToFirebase(req, res, next) {
  if (!req.file) {
    next();
  } else {
    //save Location
    const uniqueFilename = `${Date.now()}-${req.file.originalname}`;
    const storageRef = ref(firebasestorage, `uploads/${uniqueFilename}`);

    const metadata = {
      contentType: req.file.mimetype,
    };
    try {
      //upload file
      const snapshot = await uploadBytesResumable(
        storageRef,
        req.file.buffer,
        metadata
      );
      //get url from firebase
      req.file.firebaseUrl = await getDownloadURL(snapshot.ref);
      next();
    } catch (error) {
      res.status(500).json({
        message:
          error.message || "Somthing went wrong while uploading to firebase",
      });
    }
  }
}

module.exports = { upload, uploadToFirebase };

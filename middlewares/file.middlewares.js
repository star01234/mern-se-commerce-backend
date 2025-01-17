const multer =require("multer");
const path =require("path");

const storage = multer.diskStorage({
     destination: './uploads/', 
    filename: (req, file, cb) => { 
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
     }
}); 

const upload = multer({ 
    storage: storage,
    limits: {fieldSize: 1000000 }, 
    fileFilter: (req, file, cd) => {
        checkFileType(file, cd );
    },
}).single("file"); 

function checkFileType(file, cb) { // Allowed extensions 
    const fileTypes = /jpeg|jpg|png|gif|webp/; // Check extension 
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase()); // Check mime 
    const mimeType = fileTypes.test(file.mimetype); 

    if (mimeType && extName) {
    cb(null, true); // ไฟล์ผ่านการตรวจสอบ
  } else {
    cb(new Error("Error: Images Only!")); // ไฟล์ไม่ผ่านการตรวจสอบ
  }
}

module.exports = { upload };
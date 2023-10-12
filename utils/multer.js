import multer from 'multer';
import path from 'path';

// MULTER CONFIG
const upload = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext !== '.jpg' && ext !== 'png' && ext !== 'jpeg') {
      cb(new Error('File format is not supported'), false);
    }
    cb(null, true);
  },
});

export default upload;

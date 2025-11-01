import multer from 'multer';

// Use memory storage so multer gives us file.buffer
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, 
  },
});

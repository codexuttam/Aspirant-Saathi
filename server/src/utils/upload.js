const multer = require("multer");

// Use memoryStorage so uploaded files are kept in RAM (req.file.buffer)
// instead of being written to disk. This is required for serverless/cloud
// deployments (Vercel, Render, etc.) where the local filesystem is ephemeral.
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only images allowed"));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB max
  },
});

module.exports = upload;

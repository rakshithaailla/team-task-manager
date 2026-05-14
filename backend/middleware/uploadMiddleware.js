const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, "uploads/");
    },

    filename(req, file, cb) {
        cb(
            null,
            Date.now() +
            "-" +
            file.originalname.replace(/\s+/g, "-")
        );
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpg|jpeg|png|pdf|doc|docx/;
    const extName = allowedTypes.test(
        path.extname(file.originalname).toLowerCase()
    );

    if (extName) {
        cb(null, true);
    } else {
        cb(new Error("Only images, PDF, DOC, and DOCX files are allowed"));
    }
};

const upload = multer({
    storage,
    fileFilter,
});

module.exports = upload;
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Thư mục lưu ảnh
const uploadDir = path.join(__dirname, "../public/img");

// Kiểm tra nếu thư mục chưa tồn tại thì tạo mới
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình lưu trữ
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Lưu ảnh vào thư mục public/img
    },
    filename: (req, file, cb) => {
        // Đổi tên file thành duy nhất: timestamp + phần mở rộng
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    },
});

// Kiểm tra định dạng file
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Chỉ hỗ trợ định dạng JPG, JPEG, PNG"), false);
    }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;

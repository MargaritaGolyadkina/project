const express = require("express");
const { prizeController, upload } = require("../controllers/prize_controller");

const router = express.Router();

router.get("/", prizeController.getAll);
router.get("/:id", prizeController.getOne);
router.post("/create", upload.single("photo"), prizeController.create);
router.put("/:id", upload.single("photo"), prizeController.update);
router.delete("/:id", prizeController.delete);
router.put("/:id/assign", prizeController.assignPrize);

// Новый маршрут для загрузки фото отдельно
router.post("/upload", upload.single("photo"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "Файл не загружен" });
    }
    res.json({ photoUrl: `/uploads/${req.file.filename}` });
});

module.exports = router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/auth.ts
const express_1 = require("express");
const authcontroller_1 = require("../controllers/authcontroller");
const router = (0, express_1.Router)();
router.post('/login', authcontroller_1.login);
router.post('/cadastro', authcontroller_1.cadastro);
exports.default = router;

import express, { Router } from "express";
const router = express.Router();

router.get('/', (req,res) =>{ 
    res.render('index');
});

export const indexRouter = router;
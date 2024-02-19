//recently added books into our homepage
import express, { Router } from "express";
const router = express.Router();
import Book from '../models/book.js';

router.get('/', async (req,res) =>{
    let books;
    try{
        //find first 10 books arranged in descending order
        books = await Book.find().sort({createdAt: 'desc'}).limit(10).exec();
    } 
    catch{
        //if error fill an empty array
        books=[];
    }
    res.render('index',{books: books});
});

export { router as indexRouter };
import express, { Router } from "express";
const router = express.Router();
import multer from 'multer'; //picture libraray
import path from 'path'; // what is the use
import fs from 'fs'; // used to delete the bookcover that are not in the DB
import Book, { coverImageBasePath }  from '../models/book.js';
import Author from '../models/author.js';

const uploadPath = path.join('public', coverImageBasePath); //public folder & coverImageBasePath are combined
const imageMimeTypes = ['image/jpeg','image/png','image/gif']; //image types that will be accepted
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback)=>{ //which files to filter
        callback(null, imageMimeTypes.includes(file.mimetype));
    }
});


//All books route
router.get('/', async(req,res)=>{
   let query = Book.find() ;
   if(req.query.title != null && req.query.title != ''){
    query = query.regex('title',new RegExp(req.query.title,'i'));
   }
   if(req.query.publisedBefore != null && req.query.publishedBefore !='')
   {
    query = query.lte('publishedDate', req.query.publishedBefore);
   }
   if(req.query.publishedAfter != null && req.query.publishedAfter !=''){
    query = query.gte('publishedDate', req.query.publishedAfter);
   }
   try{
    const books = await query.exec();
    res.render('books/index',{
       books:books,
       searchOptions:req.query 
    });
   }catch{
    res.redirect('/');
   }
});

router.get('/new', async(req,res)=>{
    renderNewPage(res, new Book())
});

//create book route
router.post('/', upload.single('cover'),async (req,res)=>{ //upload only a single file ,its name is cover--multer will create,upload store in correct folder
    const fileName = req.file != null ? req.file.filename :null //multer requires a file name 
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        coverImageName: fileName,
        description:req.body.description
     });

     try{
        const newBook = await book.save();
        res.redirect('books');
     }
     catch{
        if(book.coverImageName != null){
            removeBookCover(book.coverImageName);
        }
        renderNewPage(res.book,true);
     }
});

function removeBookCover(fileName){
    fs.unlink(path.join(uploadPath,fileName),err =>{
        if(err) console.error(err);
    });
}

async function renderNewPage(res, book, hasError =  false){//no error indicator using hasError
   try{
    const authors = await Author.find({});
    const params = {
        authors: authors,
        book: book
    }
    if(hasError) params.errorMessage = 'Error Creating Book';
    res.render('books/new', params);
   } 
   catch{
    res.redirect('/books');
   }
}
export { router as bookRouter };


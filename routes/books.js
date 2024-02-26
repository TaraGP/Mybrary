import express, { Router } from "express";
const router = express.Router();
import Book from '../models/book.js';
import Author from '../models/author.js';

const imageMimeTypes = ['image/jpeg','image/png','image/gif, image/jpg']; //image types that will be accepted

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
       books: books,
       searchOptions: req.query 
    });
   }catch{
    res.redirect('/');
   }
});

router.get('/new', async(req,res)=>{
    renderNewPage(res, new Book());
});


router.post('/', async(req,res)=>{
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        description: req.body.description
    });
    saveCover(book, req.body.cover);//save book & encoded json cover into our request

    try{
        const newBook = await book.save();
        res.redirect('books'); 
    }
    catch{
        renderNewPage(res, book, true);
    }
});

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

function saveCover(book, coverEncoded){
    console.log('Cover Encoded:', coverEncoded); // Log coverEncoded to inspect its value
    if(coverEncoded == null) return;
    try{
    const cover = JSON.parse(coverEncoded);
    if(cover != null && imageMimeTypes.includes(cover.type)){
        book.coverImage = new Buffer.from(cover.data, `base64`);//base 64 to data conversion & then storing in a buffer
        book.coverImageType = cover.type; //book covers are not stored on the server
    }}
    catch (e)
    {
        console.error(e); 
    }
}

export { router as bookRouter };

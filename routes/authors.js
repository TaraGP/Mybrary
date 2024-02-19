import express, { Router } from "express";
const router = express.Router();
import Author from '../models/author.js';
import bodyParser from "body-parser";

//all authors route`
router.get('/', async(req,res) =>{ 
    let searchOptions={};
    if(req.query.name !== null && req.query.name !== ""){//here req.query.name is used instaed of req.body.name bcoz name will be sent as query variable
        searchOptions.name =new RegExp(req.query.name , 'i'); //searching for the req.query.name in RegExp 'i' means case insensitive
    }

    try{
        const authors= await Author.find(searchOptions);
        res.render('authors/index',{ // send back the query to the user 
            authors: authors,
            searchOptions: req.query
        });
    }
    catch{
    res.redirect('/');}
});

//new author route
router.get('/new', (req,res)=>{
    res.render('authors/new', {author:new Author()});
});

//create a new author
router.post('/', async (req,res)=>{
    const author =new Author({
        name : req.body.name
    });
    try{
        const newAuthor =await author.save();
        res.redirect('authors');
    } catch{
        res.render('authors/new',{
            author : author,
            errorMessage: 'Error creating Author'
            });
    }
});

// At the end of authors.js
export { router as authorRouter };

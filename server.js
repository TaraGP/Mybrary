  import dotenv from 'dotenv'  ;
  dotenv.config();

  import express from 'express';
  import path from 'path';
  import expressLayouts from 'express-ejs-layouts';
  import mongoose from 'mongoose';
  import {indexRouter} from './routes/index.js';
  import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

  const app=express();
    
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));
  app.set('layout', 'layouts/layout');
  app.use(expressLayouts);
  app.use(express.static('public'));
  
  
  mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
  const db = mongoose.connection;
  db.on('error', error => console.error(error)); //error display
  db.once('open', () => console.log('Connected to Mongoose')); //display it only once
  
  app.use('/', indexRouter);
  
  app.listen(process.env.PORT || 3000);
import mongoose from "mongoose";

const bookSchema =new mongoose.Schema({
 title:{type:String , required: true },  
 description:{type: String, required: false },
 publishDate:{type: Date, required: true },
 pageCount:{type: Number , required: true },
 createdAt:{type: Date , required: true, default: Date.now },
 coverImage:{type: Buffer , required: true },
 coverImageType:{type: String , required: true },
 author:{type:mongoose.Schema.Types.ObjectId , required:true , ref: 'Author'} 
});

bookSchema.virtual('coverImagePath').get(function(){
    //coverImage & coverImageName needs to be coverted into an actual usable source
    if(this.coverImage != null && this.coverImageType != null ){ //both factors exists
        //return the 
        return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`;
    }
});

const Book = mongoose.model('Book', bookSchema);

 export default Book;

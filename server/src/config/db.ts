
import mongoos from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

const mongoURL = process.env.MONGO_URL

if (!mongoURL) {
    throw new Error('Please define the MONGO_URI environment variable in .env');
}
const connectDB =async () :Promise<void>=>{
    try{
        mongoos.set('strictQuery', true);
        await mongoos.connect(mongoURL)
        console.log('Connected to MongoDB');
    }catch(err){
        console.error('MongoDB connection error:', err);
        process.exit(1); 
    } 
}
export default connectDB
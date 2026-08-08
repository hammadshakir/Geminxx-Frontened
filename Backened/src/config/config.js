import dotenv from "dotenv";
dotenv.config()

if (!process.env.MONGO_URI) {
     throw new Error("Mongo uri is not define");
    
}


// if (!process.env.JWT_SECRET) {
//      throw new Error("JWT TOKEN is not define");
    
// }
// if (!process.env.GOOGLE_CLIENT_ID) {
//      throw new Error("GOOGLE CLIENT ID is not define");
    
// }
// if (!process.env.GOOGLE_CLIENT_SECRET) {
//      throw new Error("GOOGLE CLIENT SECRET is not define");
    
// }
// if (!process.env.GOOGLE_REFRESH_TOKEN) {
//      throw new Error("GOOGLE REFRESH TOKEN is not define");
    
// }
// if (!process.env.GOOGLE_USER) {
//      throw new Error("GOOGLE USER is not define");
    
// }

const config = {
    MONGO_URI : process.env.MONGO_URI,
    // JWT_SECRET:process.env.JWT_SECRET,
    //  GOOGLE_CLIENT_ID:process.env.GOOGLE_CLIENT_ID,
    //  GOOGLE_CLIENT_SECRET:process.env.GOOGLE_CLIENT_SECRET,
    //  GOOGLE_REFRESH_TOKEN:process.env.GOOGLE_REFRESH_TOKEN,
    //  GOOGLE_USER:process.env.GOOGLE_USER

}

export default config
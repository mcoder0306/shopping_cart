import mongoose from "mongoose"

export const connection = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.fkuvbcg.mongodb.net/${process.env.DB_NAME}`)
        console.log("database connected")
    } catch (error) {
        console.log("error in connection to database", error)
    }
}
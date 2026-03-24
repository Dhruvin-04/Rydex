import mongoose from "mongoose"

const mongoDBUrl = process.env.MONGODB_URL

if(!mongoDBUrl){
    throw new Error("db url not found")
}

let cached = global.mongooseConn

if(!cached){
    cached = global.mongooseConn = {conn: null, promise: null}
}

const connectDB = async () => {
    if(cached.conn) return cached.conn
    if(!cached.promise){
        cached.promise = mongoose.connect(mongoDBUrl).then(c=>c.connection)
    }

    try {
        const conn = await cached.promise
        return conn
    } catch (error) {
        console.log(error)
    }
}

export default connectDB
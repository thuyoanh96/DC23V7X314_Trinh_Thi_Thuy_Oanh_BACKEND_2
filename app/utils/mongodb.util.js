const { MongoClient } = require("mongodb");

class MongoDB {
    static client = null;

    static connect = async (uri) => {
        if (this.client) return this.client;
        try {
            this.client = await MongoClient.connect(uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log("MongoDB connected successfully!");
            return this.client;
        } catch (error) {
            console.error("MongoDB connection error:", error.message);
            throw error; // Ném lỗi để server xử lý
        }
    };
}
module.exports = MongoDB;
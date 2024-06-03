// const { MongoClient, ObjectId } = require("mongodb");
// const connectionUrl = "mongodb://127.0.0.1:27017";
// const databaseName = "task-manager";

// MongoClient.connect(connectionUrl, { useNewUrlParser: true }, (error, client) => {
//     if (error) {
//         return console.log('error in connection');
//     }
//     const db = client.db(databaseName);
    
//     db.collection("users").deleteMany({
//     }).then(res => console.log(res)).catch(err => console.log(err)); // deleted all the data

//     db.collection("tasks").deleteOne({
//         description: "cleaning"
//     }).then(res => console.log(res)).catch(err => console.log(err));
// })
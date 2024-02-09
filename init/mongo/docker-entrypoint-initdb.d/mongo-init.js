console.log("START");

db = db.getSiblingDB("comp3133_labtest1");

db.createUser({
    user: "mahyargh",
    pwd: "mahyargh",
    roles: [
        {
            role: "readWrite",
            db: "comp3133_labtest1",
        },
    ],
});

db.createCollection("users");

console.log("END");
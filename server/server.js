import express from "express";
import bodyParser from "body-parser"
import pg from "pg"
import md5 from "md5"
import cors from "cors"
/*
//  USED FOR CONNECTING TO RENDER DB
const db = new pg.Client({
    user: "blog_app_db_ogaq_user",
    host: "dpg-d907svernols73eej440-a",
    database: "blog_app_db_ogaq",
    password: "Sn2VPpzWWDrJDj0pF4FNRbzGl3sBcFRy",
    port: 5432
});
*/


//  USED FOR CONNECTING TO LOCAL DB
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "BlogDB",
    password: "*IK(OL8ik9ol",
    port: 5432
});


db.connect();
const app = express();
const port = 5000;
let blogPosts = [];
let currentUser = {username: "", displayname: ""};
let tag = "";

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CHANGE TO ACTUAL URL IN PROD
app.use( cors({
    origin: 'http://localhost:3000'
}));

app.get("/", async (req, res) => {
    if(currentUser["username"] === ""){
        res.json({"err": "No User Logged In"});
    }
    else{
        // get blogposts from db
        let result = null;
        if( tag !== "" ){
            result = await db.query("SELECT * FROM blogs WHERE tag = $1", [tag]);
        }
        else{
            result = await db.query("SELECT * FROM blogs");
        }

        res.json({"posts": result.rows});

        /*
        res.render("index.ejs", {
            posts: result.rows
        });
        */
    }
});

app.get("/signup", (req, res) => {
    res.render("signup.ejs");
});

app.post("/signup", async (req, res) => {
    console.log(req.body);

    let username = req.body.username;
    let user_id = req.body.user_id;
    let password = req.body.password;
    currentUser = {username: "", displayname: ""};

    // hash user_id and password
    user_id = md5(user_id);
    password = md5(password);

    const result = await db.query("SELECT user_id FROM users WHERE user_id = $1", [user_id]);
    // create a new user with this data
    // if user_id isn't used
    if( result.rows.length === 0){
        await db.query("INSERT INTO users VALUES ($1,$2,$3)", [user_id, password, username]);
        
        res.json({"Success": true});
        //res.redirect("/login");
    }
    // else return back to the signup page with an error message
    else{
        res.json({"success": false});

        //res.render("signup.ejs", { err: "true" });
    }
});

app.get("/login", (req, res) => {
    res.render("login.ejs");
});

app.post("/login", async (req, res) => {
    let user_id = md5(req.body.user_id);
    let password = md5(req.body.password);

    const result = await db.query("SELECT * FROM users WHERE user_id = $1 AND password = $2", [user_id,password]);
    
    // check if user_id and password match the database
    // if so, redirect to home page
    if( result.rows.length === 1 &&
        user_id === result.rows[0].user_id &&
        password === result.rows[0].password
    ){
        let username = result.rows[0].name;
        currentUser = {username: user_id, displayname: username};
        
        res.json({"success": true});
        //res.redirect("/");
    }
    // else return to /login with an error
    else{
        res.json({"success": false});
        //res.render("login.ejs", { err: "true" });
    }
});

app.post("/", async (req, res) => {
    //let blog_id = parseInt(req.body.btnEdit, 10);
    
    await db.query("UPDATE blogs SET title = $1, body = $2, tag = $3 WHERE blog_id = $4",
        [req.body.newTitle, req.body.newBody, req.body.new, req.body.id]
    );

    res.json({"success": true});
    //res.redirect("/");
});

app.post("/delete", async (req, res) => {
    let blog_id = parseInt(req.body.btnDel, 10);

    const result = await db.query("SELECT creator_user_id FROM blogs WHERE blog_id = $1", [blog_id]);

    if( result.rows[0].creator_user_id === currentUser.username ){
        await db.query("DELETE FROM blogs WHERE blog_id = $1", [blog_id]);
        res.json({"success": true});
        //res.redirect("/");
    }  
    else{
        res.json({"success": false});
    }
});

app.post("/edit", async (req, res) => {
    let blog_id = req.body.blog_id;

    const post = await db.query("SELECT * FROM blogs WHERE blog_id = $1", [blog_id]);

    if( post.rows[0].creator_user_id === currentUser.username ){
        res.json({"success": true});
        /*
        res.render("edit.ejs", {
            name: post.rows[0].creator_name,
            title: post.rows[0].title,
            content: post.rows[0].body,
            index: blog_id
        });
        */
    }
    else{
        res.json({"success": false});
    }
});

app.post("/create", async (req, res) => {
    let date = new Date().toString();
    date = date.substring(0,date.indexOf("GMT")-1);

    await db.query("INSERT INTO blogs (creator_name, creator_user_id, title, body, date_created, tag) VALUES ($1, $2, $3, $4, $5, $6)",
        [currentUser["displayname"], currentUser["username"], req.body.title, req.body.body, date, req.body.tag]
    );

    res.json({"success": true});
    //res.redirect("/");
});

app.post("/search", (req, res) => {
    tag = req.body["tagFilter"];

    if( tag === "default" ){
        tag = "";
    }

    res.redirect("/");
});

app.get("/account", (req, res) => {
    res.render("account.ejs", { name: currentUser.displayname });
});

app.post("/account", async (req, res) => {
    let currentUserID = md5(req.body["user_id"]);
    let currentPassword = md5(req.body["password"]);
    let newDisplayName = "";
    let newUserID = "";
    let newPassword = "";
    
    const result = await db.query("SELECT * FROM users WHERE user_id = $1 AND password = $2", [currentUserID, currentPassword]);

    if( result.rows.length === 1 ){
        newDisplayName = req.body["newName"];
        newUserID = md5(req.body["newUserID"]);
        newPassword = md5(req.body["newPassword"]);

        await db.query("UPDATE users SET user_id = $1, password = $2, name = $3 WHERE user_id = $4 AND password = $5",
            [newUserID, newPassword, newDisplayName, currentUserID, currentPassword]
        );

        res.redirect("/login");
    }
    else{
        res.render("account.ejs", { name: currentUser.displayname, err: "true" });
    }
});


app.listen(port, () => {
    console.log(`Listening on port ${port}.`);
});
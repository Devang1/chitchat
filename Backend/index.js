import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth2";
import session from "express-session";
import env from "dotenv";
import multer from "multer";
import { Router } from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import{ authenticate } from '@google-cloud/local-auth';
import { google } from 'googleapis';
import setupSocket from "./socket.js";
const app=express();
const testPassword = 'userpassword';
const port=process.env.PORT||3000;
const saltRounds = 10;
const __dirname = dirname(fileURLToPath(import.meta.url));
env.config();
const { Pool } = pg;
app.use(
  cors({
    origin:["http://localhost:5173", "http://localhost:5174"]||process.env.ORIGIN,
    methods:["GET","POST","PUT","PATCH","DELETE"],
    credentials:true,
  })
)
// app.use(cors());
app.use(express.json())
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
const upload = multer({ storage: multer.memoryStorage() });

let db;
if (process.env.DATABASE_URL) {
  // ✅ Neon / Production
  db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
  console.log("Connected to Neon PostgreSQL");
} else {
  // ✅ Local PostgreSQL
  db = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
  });
  console.log("Connected to Local PostgreSQL");
}
db.connect();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/",(req,res)=>{
    res.send("hello");
})
app.get("/api/isAuth",async(req,res)=>{
  if(req.isAuthenticated()){
    const mail=req.user.email;
    const Bdata= await db.query("SELECT * FROM users WHERE email = $1", [
        mail,
      ]);
      const imageBuffer=Bdata.rows[0];
      // const base64Image = imageBuffer.toString("base64");
      // // console.log(base64Image);
      res.send(Bdata.rows[0]);
      // console.log(Bdata.rows[0])
  }else{
   res.send("not authenticated");
  }
})
app.post("/api/getMessages",async(req,res)=>{
  try{
    const user1=req.body.sender;
    const user2=req.body.reciever;
    const messages= await db.query("SELECT * FROM messages WHERE (sender = $1 AND reciever = $2)OR (sender = $2 AND reciever = $1)ORDER BY timestamp ASC;",[user1,user2]);
    res.send(messages.rows);
  }catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
})
app.post("/api/getchannelMessages",async(req,res)=>{
  try{
    const channel=req.body.channel;
    const messages= await db.query("SELECT * FROM messages WHERE reciever=$1 ORDER BY timestamp ASC;",[channel]);
    res.send(messages.rows);
  }catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
})
app.get("/api/image/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query("SELECT image FROM users WHERE id = $1", [id]);
    if (result.rows.length > 0) {
      const imageBuffer = result.rows[0].image; 
      if(imageBuffer!=null){
      res.setHeader("Content-Type", "image/"); 
      res.send(imageBuffer); 
      }else{
        res.send("image not found");
      }

    } else {
      res.status(404).send("Image not found");
    }
  } catch (err) {
    console.error("Error fetching image:", err);
    res.status(500).send("Error fetching image");
  }
});
app.post("/api/profile",upload.single("image"),async(req,res)=>{
  try {
    const first=req.body.first;
    const last=req.body.last;
    const gender=req.body.gender;
    const user = JSON.parse(req.body.userinfo);
    var imageBuffer=null;
    if(req.file!=null){
    imageBuffer = req.file.buffer;
    }
    const userData = await db.query(
      `UPDATE users 
       SET firstname = $1, lastname = $2, image = $3, gender = $4,profilesetup=true
       WHERE email = $5 
       RETURNING *`,
      [first, last, imageBuffer, gender, user.email]
    );
    res.send(userData.rows[0]).status(200);
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
})
app.post("/api/getImages",async(req,res)=>{
  try{
    const user1=req.body.sender;
    const user2=req.body.reciever;
    const images= await db.query("SELECT file_url FROM messages WHERE ((sender = $1 AND reciever = $2)OR (sender = $2 AND reciever = $1)) AND(message_type=$3)ORDER BY timestamp DESC limit 3;",[user1,user2,"file"]);
    res.send(images.rows);
  }catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
})
app.post("/api/getChannelImages",async(req,res)=>{
  try{
    const channel=req.body.channel;
    const images= await db.query("SELECT file_url FROM messages WHERE reciever=$1 AND(message_type=$2)ORDER BY timestamp DESC limit 3 ;",[channel,"file"]);
    res.send(images.rows);
  }catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
})
app.post("/api/deletechannel",async(req,res)=>{
  const channel=req.body.channelId
  await db.query("DELETE FROM channels WHERE channel_id = $1",[channel]);
  await db.query("DELETE FROM channel_members WHERE channel_id = $1",[channel]);
  res.sendStatus(200);
})
app.post("/api/group",async(req,res)=>{
  try{
    const name=req.body.name;
    const admin=req.body.admin;
    const result = await db.query(
      "INSERT INTO channels (name,admin_id) VALUES ($1, $2) RETURNING *",
      [name, admin]
    );
    res.send(result.rows[0]);
  }catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
})
app.post("/api/addmember",async(req,res)=>{
  try{
    const group=req.body.group;
    const member=req.body.member;
    const result = await db.query(
      "INSERT INTO channel_members (channel_id,member_id) VALUES ($1, $2) RETURNING *",
      [group, member]
    );
  }catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
})
app.get("/api/getchannels",async(req,res)=>{
  if(req.isAuthenticated){
  const member = req.query.member;
  const channels = await db.query("select DISTINCT ON (channels.channel_id) channels.* from channels natural join channel_members where  channels.channel_id=channel_members.channel_id and (member_id=$1 or admin_id=$1);", [
    member,
  ]);
  res.send(channels.rows);}
  else{
    console.log("not");
  }
})

//*************************** */ AUTHENTICATION************************************/
app.get(
  "/api/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
app.post("/api/auth/google/", (req, res, next) => {
  passport.authenticate("google", (err, user, info) => {
    if (err) return res.status(500).json({ error: "Internal Server Error" });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    req.logIn(user, (loginErr) => {
      console.log(user)
      if (loginErr) return res.status(500).json({ error: "Login failed" });
      return res.json({ message: "Login successful", user });
    });
  })(req, res, next);
});
app.get("/api/logout", (req, res) => {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.send("logout");
    });
  });
  app.get("/api/contacts",async(req,res)=>{
    if(req.isAuthenticated){
    const email = req.query.email;
    const contacts = await db.query("SELECT * FROM users WHERE email != $1", [
      email,
    ]);
    res.send(contacts.rows);}
    else{
      console.log("not");
    }
  })
  app.post("/api/register",async(req,res)=>{
  const email = req.body.email;
  const password = req.body.password;
  console.log(email)
    try {
      const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);
      if (checkResult.rows.length > 0) {
        res.send("user already exists");
      } else {
        bcrypt.hash(password, saltRounds, async (err, hash) => {
          if (err) {
            console.error("Error hashing password:", err);
          } else {
            const result = await db.query(
              "INSERT INTO users (email,password) VALUES ($1, $2) RETURNING *",
              [email, hash]
            );
            const user = result.rows[0];
            req.login(user, (err) => {
              console.log("success");
              res.redirect("/api/isAuth");
            });
            console.log(req.isAuthenticated())
          }
        });
      }
    } catch (err) {
      console.log(err);
    }
})
app.post("/api/log", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return res.status(500).json({ error: "Internal Server Error" });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    req.logIn(user, (loginErr) => {
      if (loginErr) return res.status(500).json({ error: "Login failed" });
      return res.json({ message: "Login successful", user });
    });
  })(req, res, next);
});

app.post("/api/postfile",async(req,res)=>{
    console.log(req.body);
    const data = await db.query(
      "INSERT INTO messages (sender, reciever, message_type, content, file_url) VALUES($1, $2, $3, $4, $5) RETURNING *",
      [req.body.sender,req.body.receiver, req.body.type, req.body.content, req.body.file]
  );
  console.log(data.rows[0])
})
app.post("/api/postchannelfile",async(req,res)=>{
  const data = await db.query(
    "INSERT INTO messages (sender, reciever, message_type, content, file_url) VALUES($1, $2, $3, $4, $5) RETURNING *",
    [req.body.sender,req.body.channel, req.body.type, req.body.content, req.body.file]
);
console.log(data.rows[0])
})

passport.use(
  "local",
  new Strategy({ usernameField: "email" },async function verify(email, password, cb){
    try {
      const result = await db.query("SELECT * FROM users WHERE email = $1 ", [email,]);
      if (result.rows.length > 0) {
        const user = result.rows[0];
        const storedHashedPassword = user.password;
        bcrypt.compare(password, storedHashedPassword, (err, valid) => {
          if (err) {
            console.error("Error comparing passwords:", err);
            return cb(err);
          } else {
            if (valid) {
              return cb(null, user);

            } else {
              return cb(null, false);
            }
          }
        });
      } else {
        return cb("User not found");
      }
    } catch (err) {
      console.log(err);
    }
  })
);

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5173/profile",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const result = await db.query("SELECT * FROM users WHERE email = $1", [
          profile.email,
        ]);
        if (result.rows.length === 0) {
          const newUser = await db.query(
            "INSERT INTO users (email,password) VALUES ($1, $2) RETURNING *",
            [profile.email, "google"]
          );
          res.send(newUser);
          return cb(null, newUser.rows[0]);
        } else {
          res.send(result);
          return cb(null, result.rows[0]);
        
        }
      } catch (err) {
        return cb(err);
      }
    }
  )
);
passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});
const server=app.listen(port,()=>{
    console.log(`server is running at http://localhost:${port}`);
})
setupSocket(server);
import {Server as socketIOserver} from "socket.io"
import env from "dotenv";
import pg from "pg";
env.config();
const db = new pg.Client({
  user:process.env.PG_USER,
  host:process.env.PG_HOST,
  database:process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT
});
db.connect();
const setupSocket=(server)=>{
    const io=new socketIOserver(server,{
        cors:{
            origin:"https://chitchat3.onrender.com",
            methods:["GET","POST"],
            credentials:true
        }
    })
    const userSocketMap=new Map();
    const disconnect=(socket)=>{
        for(const [userid,socketid] of userSocketMap.entries()){
            if(socketid===socket.id){
                userSocketMap.delete(userid);
                break
            }
        }
    }
    const sendMessage = async (message) => {
        try {
            const senderSocketid = userSocketMap.get(String(message.sender));
            const recieverSocketid = userSocketMap.get(String(message.reciever));
            console.log(message.sender,message.reciever)
    
            const { sender, content, reciever, message_type, file_url } = message;
            const data = await db.query(
                "INSERT INTO messages (sender, reciever, message_type, content, file_url) VALUES($1, $2, $3, $4, $5) RETURNING *",
                [sender, reciever, message_type, content, file_url]
            );
            console.log(data.rows[0])
            if (recieverSocketid) {
                io.to(recieverSocketid).emit("receiveMessage", data.rows[0]);
            }
            if (senderSocketid) {
                io.to(senderSocketid).emit("receiveMessage", data.rows[0]);
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };
    const sendChannelMessage = async (message) => {
        try {
            const { sender, content, channel, message_type, file_url } = message;
            const data = await db.query(
                "INSERT INTO messages (sender, reciever, message_type, content, file_url) VALUES($1, $2, $3, $4, $5) RETURNING *",
                [sender, channel, message_type, content, file_url]
            );
            console.log(data.rows[0])
            const result=await db.query(
                "select member_id,admin_id from channel_members natural join channels where channel_id=$1",
                [channel]
            );
            result.rows.map((member)=>{
                const memberSocketid = userSocketMap.get(String(member.member_id));
                const adminSocketid=userSocketMap.get(String(member.admin_id));
                if (memberSocketid) {
                    io.to(memberSocketid).emit("receiveChannelMessage", data.rows[0]);
                }
                if (adminSocketid) {
                    io.to(adminSocketid).emit("receiveChannelMessage", data.rows[0]);
                }
            })
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };
    
    io.on("connection",(socket)=>{
        const userid=String(socket.handshake.query.userid);
        if(userid){
            userSocketMap.set(userid,socket.id);
            console.log(`user:${userid} connected with ${socket.id}`);
        }else{
            console.log("userid not found");
        }
        socket.on("sendMessage",sendMessage)
        socket.on("send-channel-Message",sendChannelMessage)
        socket.on("disconnect",()=>{disconnect(socket)})
    });
}
export default setupSocket;

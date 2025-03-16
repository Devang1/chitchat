import '../../App.css';
import { useEffect,useState } from "react";
import { useappstore } from "../../store"
import { useNavigate } from "react-router-dom";
import ChatContainer from "./chat-container";
import EmptyChatContainer from "./empty-chat-container";
import ContactsContainer from "./contacts-container";
import GroupCreator from './create-channel';
const Chat = () => {
  const {userinfo} =useappstore();
  const navigate=useNavigate();
  const{check,channel}=useappstore();
  useEffect(()=>{
    const checkKarlo=async()=>{
      if(check==false){
          navigate("/auth");
      }
      else if(check==true&& userinfo.profilesetup==false){
        navigate("/profile")
      }
  }
  checkKarlo();
  },[userinfo,navigate,check]);
  const {selectedChatType} =useappstore();
  const defaultimg=userinfo.gender=="Male"?"https://avatar.iran.liara.run/public/boy?username=Ash":"https://avatar.iran.liara.run/public/girl?username=Ash";
  const imageUrl = userinfo.image? `/api/image/${userinfo.id}`:defaultimg ;
    return (
      <div className="flex h-[100vh] text-white overflow-hidden ">
        <ContactsContainer/>
        {selectedChatType==undefined?channel==true?<GroupCreator/>:(<EmptyChatContainer/>):( 
        <ChatContainer/>)}
      </div>
    );
  }
  
  export default Chat
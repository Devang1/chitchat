
import './App.css'
import {BrowserRouter, Navigate, Route,Routes,useNavigate } from "react-router-dom"
import Auth from "./pages/auth"
import Chat from "./pages/chat"
import Profile from "./pages/profile"
import { useappstore } from './store'
import { useEffect,useState} from 'react'
import axios from "axios";
import PropTypes from "prop-types";


// const ProtectedChatRoute = ({ children }) => {
//   const { userinfo, setUserInfo } = useappstore();
//   const [loading, setLoading] = useState(true);
//   const [redirect, setRedirect] = useState(null);
//   const navigate=useNavigate();

//   // useEffect(() => {
//   //     const checkAuthStatus = async () => {
//   //         // try {
//   //         //     const response = await axios.get('/api/isAuth', {
//   //         //       withCredentials: true, 
//   //         //     });
//   //         //     console.log(response.data);
//   //         //     setUserInfo(response.data);
//   //         //     if (!response.data.authenticated) {
//   //         //         setRedirect("/auth");
//   //         //     } else if (!response.data.profilesetup) {
//   //         //         setRedirect("/profile");
//   //         //     }
//   //         // } catch (error) {
//   //         //     console.error("Authentication check failed:", error);
//   //         //     navigate("/auth");
//   //         // } finally {
//   //         //     setLoading(false);
//   //         // }
//   //         console.log(userinfo);
//   //     };

//   //     checkAuthStatus();
//   // }, [setUserInfo]);}
// }
// ProtectedChatRoute.propTypes = {
//     children: PropTypes.node.isRequired,
//   };
const Chatroute=({children})=>{
 const {userinfo}=useappstore();
  if(userinfo!="not authenticated"){
      return children;
  }else{
    return <Navigate to="/auth"/>;
  }
}
const Profileroute=({children})=>{
  const {userinfo}=useappstore();
  if(userinfo!="not authenticated"){
    // if(userinfo.profilesetup===false){
    //   return children
    // }else{
    //   return <Navigate to="/chat"/>;
    // }
    return children;
  }else{
    return <Navigate to="/auth"/>;
  }
 }
// const Authroute=({children})=>{
//   const {userinfo}=useappstore();
//   if(userinfo!="not authenticated"){
//     if(userinfo.profilesetup!=true){
//       return <Navigate to="/chat"/>
//     }
//   }else{
//     return children;
//   }
// }
Chatroute.propTypes = {
  children: PropTypes.node.isRequired,
};
// Authroute.propTypes = {
//   children: PropTypes.node.isRequired,
// };
Profileroute.propTypes = {
  children: PropTypes.node.isRequired,
};

function App() {
  const {userinfo,setuserinfo}=useappstore();
  useEffect(()=>{
    const getuser=async()=>{
      const BASE_URL =import.meta.env.VITE_API_URL || "http://localhost:3000";
      const user=await axios.get(`${BASE_URL}/api/isAuth`, {
        withCredentials: true, 
      })
      console.log(user.data)
      return user.data;
    }
    if(!userinfo){
      const res= getuser();
      setuserinfo(res);
    }
  },[userinfo,setuserinfo]);
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/auth' element={<Auth/>}/>
      <Route path='/chat' element={<Chatroute><Chat/></Chatroute>}/>
      <Route path='/profile' element={<Profileroute><Profile/></Profileroute>}/>

      <Route path='*' element={<Navigate to="/auth"/>}/>
    </Routes>
    </BrowserRouter>
    
  )
}

export default App

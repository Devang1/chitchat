import {useEffect, useState } from "react";
import './auth.css';
import axios from "axios";
import {useNavigate} from "react-router-dom"
import { useappstore } from "../../store";
import { Toaster, toast } from 'sonner';

const Auth = () => {
    const [log ,setlog]=useState(true);
    const[email,setemail]=useState("");
    const[logerr,setlogerr]=useState(false);
    const[password,setpassword]=useState("");
    const[cpassword,setcpassword]=useState("");
    const{userinfo,setuserinfo}=useappstore();
    const{check,setcheck}=useappstore();
    const navigate=useNavigate();
    useEffect(()=>{
        const checkKarlo=async()=>{
            console.log(check)
            if(check===true && userinfo.profilesetup==true){
                navigate("/chat");
            }
            else if(check==true){
              navigate("/profile");
            }
        }
        checkKarlo();}
        ,[userinfo,navigate,check])
    // useEffect(()=>{
    //     axios.get("http://localhost:3000/isAuth",{ withCredentials: true,}).then((response)=>{
    //             setuserData(response.data);
    //     })
    // })
    console.log(userinfo);
    const passnotmatch = () => {
      event.preventDefault();
      toast.error('Both passwords are not same!', {
        duration: 3000,
        position: 'bottom-right',
        style: {
          background: '#FF5C5C',
          color: '#fff',
        },
      });
    };
    const userexists= () => {
      event.preventDefault();
      toast.error('This email id is already registered!', {
        duration: 3000,
        position: 'bottom-right',
        style: {
          background: '#FF5C5C',
          color: '#fff',
        },
      });
    };
    const nullerror = () => {
      event.preventDefault();
      toast.error('email and password are required!', {
        duration: 3000,
        position: 'bottom-right',
        style: {
          background: '#FF5C5C',
          color: '#fff',
        },
      });
    };
        const fetchUser = async () => {
          try {
             const BASE_URL =import.meta.env.VITE_API_URL || "http://localhost:3000";
            await axios.get(`${BASE_URL}/api/isAuth`, {
              withCredentials: true, 
            }).then((response)=>{
                console.log(response.data);
            if(response.data!="not authenticated"){
                    setuserinfo(response.data);
            }else{
                navigate("/")
            }
        });
          } catch (error) {
            console.error('Error fetching user data:', error);
          } 
        };
    const handleRegistration=async(event)=>{
        event.preventDefault();

        if(email!=""&&password!="" && password===cpassword){
          const BASE_URL =import.meta.env.VITE_API_URL || "http://localhost:3000";
      axios.post(`${BASE_URL}/api/register`,{
            email: email,
            password: password,
          }, {
            headers: { 'Content-Type': 'application/json' },
          }).then((response)=>{
            if(response.data!="user already exists"){
              navigate("/profile");  // Redirect after successful login
              setcheck(true);
              fetchUser()}
          else{
            userexists();
          }
          })
        // setuserinfo(response.data.user);  // Update state
    }else if(password!=cpassword){
      passnotmatch();
    }
    else{
      nullerror();
    }
}
const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const BASE_URL =import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await axios.post(
        `${BASE_URL}/api/log`,  // Ensure correct backend URL
        { email, password },
        { 
          withCredentials: true,  // Allows session cookies
          headers: { "Content-Type": "application/json" }
        }
      );
  
      await setuserinfo(response.data.user);
      navigate("/profile");  // Redirect after successful login
      setcheck(true); 
    } catch (err) {
      console.error("Login failed:", err.response?.data?.error || err.message);
      setlogerr(true);
    }
  };
  

    const handleGoogle=(event)=>{
        event.preventDefault();
        const BASE_URL =import.meta.env.VITE_API_URL || "http://localhost:3000";
        window.location.href = `${BASE_URL}/api/auth/google`;
       console.log( fetchUser());
    }
  return (
    <div className="w-[100vw] h-[100vh] flex items-center justify-center bg-[#121212] relative">
    <div className="wrapper hidden md:block">
      <div><span className="dot"></span></div>
      <div><span className="dot"></span></div>
      <div><span className="dot"></span></div>
      <div><span className="dot"></span></div>
      <div><span className="dot"></span></div>
      <div><span className="dot"></span></div>
      <div><span className="dot"></span></div>
      <div><span className="dot"></span></div>
      <div><span className="dot"></span></div>
      <div><span className="dot"></span></div>
      <div><span className="dot"></span></div>
      <div><span className="dot"></span></div>
      <div><span className="dot"></span></div>
      <div><span className="dot"></span></div>
      <div><span className="dot"></span></div>
    </div>
        <div className="w-[80vw] h-[90vh] flex items-center justify-evenly bg-[#151515] md:w-[80vw] md:h-[80vh] ">
            <img src="message.png" alt="message" className="hidden md:block w-[30vw] z-2" />
            <div className="w-[80vw] h-[70vh] flex flex-col items-center justify-center ">
            <div className="w-[50vw] h-[7vh] flex items-center justify-between rounded-4xl bg-[#2C2C2C] border-[2px] border-[#007BFF] px-2 md:w-[20vw] md:h-[8vh]">
                <button className={log?"text-[3.5vw] font-medium text-[#F5F5F5] bg-[#1975d8] rounded-4xl py-1.5 px-5 flex items-center justify-center md:text-[1.8vw] md:py-[0.02vw] md:px-5 cursor-pointer ":"text-[3vw] font-medium text-[#A0A0A0] flex items-center justify-center py-1.5 px-5 md:text-[1.5vw] md:py-0.5 md:px-5 cursor-pointer"} onClick={()=>setlog(true)}>Login</button>
                <button className={!log?"text-[3.5vw] font-medium text-[#F5F5F5] bg-[#1975d8] rounded-4xl py-1.5 px-5 flex items-center justify-center md:text-[1.8vw] md:py-[0.02vw] md:px-5 cursor-pointer ":"text-[3vw] font-medium text-[#A0A0A0] flex items-center justify-center py-1.5 px-5 md:text-[1.5vw] md:py-0.5 md:px-5 cursor-pointer"}  onClick={()=>setlog(false)}>Signup</button>
            </div>
            {logerr?<h1 className="text-[#E63946] absolute top-50">Email or Password is not correct</h1>:""}
            {log?<>
            <div className="w-[60vw] md:w-[30vw] h-[50vh]  mt-5">
                <h1 className=" text-[6vw] md:text-[2vw] font-medium text-[#007BFF]">Login<img src="chat.png" alt="message" className="md:hidden w-[30vw] inline-block ml-10" /></h1>
                <p className="text-white text-[3vw] md:text-[1vw]">Log in to your account and dive back into the chat!</p>
                <form onSubmit={handleLogin} className="flex flex-col gap-6 mt-4">
                    <input type="email" onChange={(e)=>{setemail(e.target.value)}} name="email" id="email" placeholder="Enter email.." className="md:text-2xl text-blue-100 bg-[#2C2C2C] px-2 py-2 rounded-2xl "/>
                    <input type="text" onChange={(e)=>{setpassword(e.target.value)}} name="password" id="password" placeholder="Enter password.." className="md:text-2xl text-blue-100 bg-[#2C2C2C] px-2 py-2 rounded-2xl "/>
                    <button type="submit" className="text-[3.5vw] w-[20vw] ml-20 font-medium text-[#F5F5F5] bg-[#1975d8] rounded-4xl py-1.5 px-5 flex items-center justify-center md:text-[1.8vw] md:py-0.5 md:px-5 cursor-pointer ">Login</button>
                </form>
                <button onClick={handleGoogle} type="submit" className="text-[3vw] font-medium text-black bg-white rounded-4xl w-[40vw] ml-10 pr-1.5 mt-2 md:ml-16  py-1.5 px-5 flex items-center justify-center md:text-[1.8vw] md:py-0.5 md:px-5 cursor-pointer md:w-[22vw] md:h-[6vh] ">Login with <img src="google.webp" alt="google png" className=" ml-2 w-6 md:w-10" /></button>
            </div>
            </>:<>
            <div className="w-[60vw] md:w-[30vw] h-[50vh]  mt-5 relative">
               <h1 className=" text-[6vw] md:text-[2vw] font-medium text-[#007BFF]">Signup<img src="chat.png" alt="message" className="md:hidden w-[30vw] inline-block ml-10" /></h1>
                <p className="text-white text-[3vw] md:text-[1vw]">Connect. Chat. Share. Anywhere, Anytime!</p>
                <form onSubmit={handleRegistration} className="flex  flex-col gap-6 mt-4">
                    <input type="email" onChange={(e)=>{setemail(e.target.value)}} name="email" id="email" placeholder="Enter email.." className="md:text-2xl text-blue-100 bg-[#2C2C2C] px-2 py-2 rounded-2xl "/>
                    <input type="text" onChange={(e)=>{setpassword(e.target.value)}} name="password" id="password" placeholder="Enter password.." className="md:text-2xl text-blue-100 bg-[#2C2C2C] px-2 py-2 rounded-2xl "/>
                    <input type="text" onChange={(e)=>{setcpassword(e.target.value)}} name="Cpassword" id="Cpassword" placeholder="Confirm password.." className=" mb-0 md:text-2xl text-blue-100 bg-[#2C2C2C] px-2 py-2 rounded-2xl "/>
                    {cpassword!=password?<p className="absolute top-79 text-[#E63946] text-[3vw] left-2 md:text-[1vw] md:top-69">Both passwords must be same</p>:""}
                    <button type="submit" className="text-[3.5vw] font-medium text-[#F5F5F5] bg-[#1975d8] rounded-4xl w-[20vw] ml-17 md:ml-20  py-1.5 px-5 flex items-center justify-center md:text-[1.8vw] md:py-0.5 md:px-5 cursor-pointer ">Signup</button>
                </form>
                <button onClick={handleGoogle} className="text-[3vw] font-medium text-black bg-white rounded-4xl w-[40vw] ml-9 mt-2 md:ml-15  py-1.5 px-5 pr-1.5 flex items-center justify-center md:text-[1.8vw] md:py-0.5 md:px-5 cursor-pointer md:w-[22vw] md:h-[6vh] ">Signup with <img src="google.webp" alt="google png" className=" ml-2 w-6 mr-0 md:w-10" /></button>
            </div>
                </>
                }
            </div>
        </div>
        <Toaster />
    </div>
  )
}

export default Auth

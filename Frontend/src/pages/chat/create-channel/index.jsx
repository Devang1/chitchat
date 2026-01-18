import { useState,useEffect } from "react";
import { useappstore } from "../../../store";
import axios from "axios";
export default function GroupCreator() {
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [allcontacts, setAllcontacts] = useState([]);
  const{channel,setchannel}=useappstore();
  const BASE_URL =import.meta.env.VITE_API_URL || "http://localhost:3000";
  const {userinfo} =useappstore();
  const getcontacts=async()=>{
    const BASE_URL =import.meta.env.VITE_API_URL || "http://localhost:3000";
    const fetched_contacts=await axios.get(`${BASE_URL}/api/contacts`, {
      params: { email:userinfo.email },
      withCredentials: true, 
    })
    setAllcontacts(fetched_contacts.data);
  }
  useEffect(()=>{
    getcontacts()
  },[]);
  const toggleUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreateGroup = () => {
    const BASE_URL =import.meta.env.VITE_API_URL || "http://localhost:3000";
    axios.post(`${BASE_URL}/api/group`,{
      name:groupName ,
      admin: userinfo.id,
    }, {
      headers: { 'Content-Type': 'application/json' },
    }).then((response)=>{
      selectedUsers.map((mem)=>(
      axios.post(`${BASE_URL}/api/addmember`,{
        group:response.data.channel_id,
        member:mem,
      },{
        headers: { 'Content-Type': 'application/json' },
      })))
    })
    setchannel(false);
    setGroupName("");
    setSelectedUsers([]);
  };
  const filteredUsers = allcontacts.filter((user) =>
    user.firstname.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center justify-center bg-gray-900 w-[100vw] h-[100vh] gap-10 ">
    <div className="w-[100vw] h-[100vh] max-w-xl mx-auto p-8 md:space-y-6 flex flex-col gap-5 md:block md:h-[80vh] bg-[#1a1d23] text-white rounded-2xl shadow-lg border border-[#2a2d35] md:absolute md:top-20 md:left-150">
      <h2 className="text-2xl font-bold text-[#00bcd4]">Create a Group</h2>
      <i className="fa-solid fa-xmark text-2xl absolute top-9 right-10 cursor-pointer" onClick={()=>{setchannel(false)}}></i>
      <input
        type="text"
        placeholder="Group Name"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        className="w-full p-3 rounded-lg bg-[#2a2d35] border-transparent focus:ring-2 focus:ring-[#00bcd4] text-white"
      />

      <input
        type="text"
        placeholder="Search Users"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 rounded-lg bg-[#2a2d35] border-transparent focus:ring-2 focus:ring-[#00bcd4] text-white"
      />

      <div className="space-y-4 max-h-60 overflow-y-auto rounded-lg border border-[#2a2d35] p-3">
        {filteredUsers.map((user) => (
          <label
            key={user.id}
            className="flex items-center space-x-4 p-2 hover:bg-[#2a2d35] rounded-lg cursor-pointer transition"
          >
            <input
              type="checkbox"
              checked={selectedUsers.includes(user.id)}
              onChange={() => toggleUser(user.id)}
              className="accent-[#00bcd4]"
            />
            <img src={user.image? `${import.meta.env.VITE_API_URL}/api/image/${user.id}`:user.gender=="Male"?"https://avatar.iran.liara.run/public/boy?username=Ash":"https://avatar.iran.liara.run/public/girl?username=Ash"} alt="User" className="w-10 h-10 rounded-full" />
            <strong className="text-cyan-300 ">{`${user.firstname} ${user.lastname!=null?user.lastname:""}`}</strong>
          </label>
        ))}
      </div>

      <button
        onClick={handleCreateGroup}
        disabled={!groupName || selectedUsers.length === 0}
        className="w-full p-3 bg-[#00bcd4] text-white rounded-lg hover:bg-[#00acc1] disabled:bg-gray-600"
      >
        Create Group
      </button>
    </div>
    </div>
  );
}

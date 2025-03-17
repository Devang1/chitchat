import { useappstore } from "../../store"
import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import "./profile.css";
import axios from "axios";
import { Toaster, toast } from 'sonner'; // Import the Toaster component and toast functions
// import 'sonner/dist/sonner.css';


const Profile = () => {
  // const showSuccess = () => {
  //   toast.success('Profile updated successfully!', {
  //     duration: 3000,
  //     position: 'bottom-right',
  //     style: {
  //       background: '#4CAF50',
  //       color: '#fff',
  //     },
  //   });
  // };
  const nullerror = () => {
    toast.error('Firstname and gender are required!', {
      duration: 3000,
      position: 'bottom-right',
      style: {
        background: '#FF5C5C',
        color: '#fff',
      },
    });
  };
  const sendData =async(event) => {
    event.preventDefault();
    if(first==""||gender==""){
      nullerror()
    }else{
    try {
      const formData = new FormData();
      formData.append("image", selectedFile);  // Attach the file
      formData.append("first", first);
      formData.append("last", last);
      formData.append("gender", gender);
      formData.append("userinfo", JSON.stringify(userinfo));
      const info = await axios.post("/api/profile", formData, {
        withCredentials: true, // Allows session cookies
        headers: {
          "Content-Type": "multipart/form-data", // Important for file uploads
        },
      }); 
      if(info.status==200){
      toast.success("profile updated successfully");
      setuserinfo(info.data);
      navigate("/chat")
    }
    } catch (err) {
      console.log("error",err);
    }
  }
  };
  const {userinfo,setuserinfo,check}=useappstore();
  
  const navigate=useNavigate();
  const [image, setImage] = useState(null);
  const [first, setfirst] = useState('');
  const [last, setlast] = useState('');
  const [gender, setgender] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  useEffect(()=>{
    const checkKarlo=async()=>{
      console.log(check)
      if(check==false){
          navigate("/auth");
      }
  }
  checkKarlo();
  },[userinfo,navigate,check]);
 const  handlenavigate=()=>{
    if(userinfo.profilesetup==true){
      navigate("/chat");
    }else{
      toast.error('Please setup your profile', {
        duration: 3000,
        position: 'bottom-right',
        style: {
          background: '#FF5C5C',
          color: '#fff',
        },
      });
    }
  }
  useEffect(()=>{
    setfirst(userinfo.firstname);
    setlast(userinfo.lastname);
    setgender(userinfo.gender);
    setImage(`/api/image/${userinfo.id}`)
    const imageFile = new File([userinfo.image], "image.png", { type: "image/png" });
    setSelectedFile(imageFile);
    console.log(userinfo);
  },[]);
    return (
      <div className="w-[100vw] h-[100vh] flex flex-col gap-10 items-center justify-center bg-[#121212] relative md:flex-row md:gap-60">
      <button className="cursor-pointer" onClick={handlenavigate}><i className="fa-solid fa-arrow-left text-[#258196] text-3xl absolute top-30 left-10"></i></button>
        <svg className="w-20 absolute top-10 left-10 md:w-40" width="366" height="70" viewBox="0 0 366 70" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M51.816 52.872C52.648 54.728 52.68 56.552 51.912 58.344C51.144 60.072 49.928 61.672 48.264 63.144C46.6 64.616 44.68 65.896 42.504 66.984C40.392 68.072 38.376 68.84 36.456 69.288C34.344 69.736 32.104 69.928 29.736 69.864C27.432 69.864 25.096 69.576 22.728 69C20.424 68.488 18.152 67.72 15.912 66.696C13.736 65.608 11.72 64.296 9.864 62.76C7.624 60.904 5.864 58.696 4.584 56.136C3.368 53.512 2.472 50.728 1.896 47.784C1.32 44.84 1 41.896 0.936 38.952C0.936 35.944 1.032 33.128 1.224 30.504C1.416 28.136 1.896 25.672 2.664 23.112C3.432 20.552 4.488 18.056 5.832 15.624C7.24 13.128 8.904 10.824 10.824 8.712C12.808 6.6 15.112 4.808 17.736 3.336C19.72 2.184 21.928 1.416 24.36 1.032C26.856 0.583998 29.352 0.487997 31.848 0.743998C34.408 0.935999 36.808 1.48 39.048 2.376C41.352 3.208 43.304 4.35999 44.904 5.832C45.928 6.72799 46.984 7.976 48.072 9.576C49.224 11.176 50.056 12.808 50.568 14.472C51.08 16.136 51.08 17.704 50.568 19.176C50.12 20.584 48.84 21.544 46.728 22.056C45.832 22.312 45.032 22.376 44.328 22.248C43.624 22.056 42.984 21.768 42.408 21.384C41.832 20.936 41.288 20.424 40.776 19.848C40.264 19.272 39.784 18.696 39.336 18.12C37.8 16.264 36.008 15.016 33.96 14.376C31.912 13.672 29.864 13.512 27.816 13.896C25.832 14.216 23.944 15.048 22.152 16.392C20.424 17.672 19.08 19.336 18.12 21.384C17.096 23.56 16.264 25.96 15.624 28.584C15.048 31.144 14.728 33.768 14.664 36.456C14.6 39.08 14.824 41.64 15.336 44.136C15.912 46.632 16.872 48.84 18.216 50.76C19.24 52.296 20.488 53.544 21.96 54.504C23.496 55.464 25.128 56.136 26.856 56.52C28.584 56.904 30.312 56.968 32.04 56.712C33.832 56.456 35.56 55.88 37.224 54.984C37.736 54.728 38.28 54.376 38.856 53.928C39.496 53.416 40.136 52.904 40.776 52.392C41.416 51.88 42.056 51.4 42.696 50.952C43.4 50.504 44.136 50.184 44.904 49.992C46.056 49.608 47.304 49.64 48.648 50.088C50.056 50.536 51.112 51.464 51.816 52.872ZM97.6238 50.088C97.6878 51.368 97.7198 52.712 97.7198 54.12C97.7198 55.464 97.6878 56.712 97.6238 57.864C97.5598 59.592 97.4638 61.192 97.3358 62.664C97.2078 64.072 96.9518 65.288 96.5678 66.312C96.1838 67.272 95.5758 68.008 94.7438 68.52C93.9758 68.968 92.8878 69.096 91.4798 68.904C90.0078 68.712 88.9518 68.008 88.3118 66.792C87.6718 65.576 87.2238 64.2 86.9678 62.664C86.7758 61.064 86.7118 59.464 86.7758 57.864C86.8398 56.264 86.8398 55.016 86.7758 54.12C86.7118 52.712 86.6478 51.112 86.5838 49.32C86.5838 47.464 86.3918 45.736 86.0078 44.136C85.6878 42.472 85.1118 41.064 84.2798 39.912C83.4478 38.76 82.1998 38.152 80.5358 38.088C78.4238 37.96 76.7918 38.12 75.6398 38.568C74.5518 39.016 73.7518 39.688 73.2398 40.584C72.7278 41.416 72.4078 42.44 72.2798 43.656C72.2158 44.872 72.0878 46.184 71.8958 47.592L71.7998 51.336V58.344C71.7998 59.496 71.7678 60.712 71.7038 61.992C71.7038 63.208 71.5118 64.328 71.1278 65.352C70.7438 66.376 70.1358 67.24 69.3038 67.944C68.5358 68.648 67.3838 69 65.8478 69C63.9278 69 62.4878 68.392 61.5278 67.176C60.6318 65.896 60.1838 64.328 60.1838 62.472V7.272C60.1838 6.888 60.1838 6.536 60.1838 6.216C60.2478 5.832 60.3118 5.448 60.3758 5.064C60.5038 4.68 60.5998 4.328 60.6638 4.008C60.7278 3.624 60.8238 3.272 60.9518 2.952C61.1438 2.312 61.4638 1.832 61.9118 1.512C62.2318 1.192 62.5518 0.935999 62.8718 0.743998C63.1918 0.551996 63.5438 0.423996 63.9278 0.359997C64.2478 0.295998 64.5998 0.263998 64.9838 0.263998C65.3678 0.199999 65.7518 0.167999 66.1358 0.167999C67.0958 0.167999 68.0238 0.455999 68.9198 1.032C69.3038 1.288 69.6558 1.57599 69.9758 1.89599C70.2958 2.15199 70.5518 2.536 70.7438 3.048C71.2558 4.264 71.5118 5.416 71.5118 6.504C71.5758 6.824 71.6078 7.304 71.6078 7.944C71.6718 8.52 71.7038 9.128 71.7038 9.768C71.7038 10.408 71.7038 11.048 71.7038 11.688C71.7678 12.264 71.7998 12.712 71.7998 13.032V13.512C71.8638 15.56 71.8958 17.64 71.8958 19.752C71.8958 21.864 71.8958 24.008 71.8958 26.184V27.816C74.5838 26.92 77.3998 26.504 80.3438 26.568C83.2878 26.568 85.9118 27.144 88.2158 28.296C90.5838 29.512 92.3758 30.888 93.5918 32.424C94.8718 33.96 95.7998 35.656 96.3758 37.512C96.9518 39.368 97.2718 41.352 97.3358 43.464C97.4638 45.576 97.5598 47.784 97.6238 50.088ZM117.467 32.616C117.467 34.408 117.467 36.424 117.467 38.664C117.531 40.904 117.563 43.24 117.563 45.672C117.563 48.04 117.563 50.408 117.563 52.776C117.563 55.08 117.531 57.224 117.467 59.208C117.403 60.168 117.307 61.224 117.179 62.376C117.051 63.464 116.795 64.488 116.411 65.448C116.027 66.408 115.419 67.208 114.587 67.848C113.819 68.424 112.763 68.68 111.419 68.616C109.435 68.488 107.995 67.624 107.099 66.024C106.267 64.424 105.787 62.184 105.659 59.304C105.659 57.832 105.627 56.136 105.563 54.216C105.563 52.296 105.531 50.344 105.467 48.36C105.467 46.376 105.467 44.456 105.467 42.6C105.467 40.68 105.467 38.952 105.467 37.416C105.467 36.52 105.435 35.432 105.371 34.152C105.371 32.872 105.403 31.56 105.467 30.216C105.531 28.872 105.691 27.592 105.947 26.376C106.203 25.096 106.619 24.04 107.195 23.208C107.643 22.696 108.283 22.312 109.115 22.056C109.947 21.736 110.811 21.576 111.707 21.576C112.667 21.576 113.563 21.736 114.395 22.056C115.291 22.376 115.931 22.824 116.315 23.4C116.571 23.784 116.763 24.328 116.891 25.032C117.019 25.736 117.115 26.536 117.179 27.432C117.307 28.264 117.371 29.16 117.371 30.12C117.435 31.016 117.467 31.848 117.467 32.616ZM113.819 13.224C111.835 13.736 110.171 13.544 108.827 12.648C107.547 11.688 106.747 10.28 106.427 8.424C106.171 7.08 106.267 5.896 106.715 4.872C107.163 3.848 107.835 3.08 108.731 2.568C109.627 1.992 110.651 1.736 111.803 1.8C112.955 1.86399 114.107 2.31199 115.259 3.144C116.347 3.912 117.115 4.808 117.563 5.832C118.075 6.856 118.235 7.848 118.043 8.808C117.915 9.768 117.499 10.664 116.795 11.496C116.091 12.264 115.099 12.84 113.819 13.224ZM166.895 26.664C167.407 27.88 167.439 29.224 166.991 30.696C166.607 32.168 165.871 33.128 164.783 33.576C164.207 33.832 163.439 34.056 162.479 34.248C161.519 34.376 160.463 34.504 159.311 34.632C158.223 34.76 157.135 34.856 156.047 34.92C154.959 34.984 154.031 35.016 153.263 35.016C153.327 36.936 153.391 38.92 153.455 40.968C153.519 42.952 153.583 44.904 153.647 46.824C153.711 48.744 153.743 50.6 153.743 52.392C153.743 54.12 153.711 55.688 153.647 57.096C153.647 58.056 153.647 59.176 153.647 60.456C153.647 61.672 153.551 62.856 153.359 64.008C153.231 65.16 153.007 66.184 152.687 67.08C152.367 67.912 151.887 68.456 151.247 68.712C149.263 69.544 147.439 69.768 145.775 69.384C144.175 69.064 143.023 68.392 142.319 67.368C141.807 66.536 141.423 65.576 141.167 64.488C140.911 63.336 140.719 62.184 140.591 61.032C140.527 59.816 140.495 58.664 140.495 57.576C140.559 56.424 140.591 55.432 140.591 54.6C140.655 51.912 140.687 48.872 140.687 45.48C140.751 42.024 140.783 38.568 140.783 35.112H139.343C138.575 35.112 137.583 35.112 136.367 35.112C135.215 35.048 134.031 34.952 132.815 34.824C131.663 34.632 130.575 34.408 129.551 34.152C128.527 33.832 127.791 33.384 127.343 32.808C126.639 31.976 126.191 31.08 125.999 30.12C125.871 29.16 125.935 28.264 126.191 27.432C126.511 26.536 126.991 25.768 127.631 25.128C128.271 24.424 129.007 23.976 129.839 23.784C130.991 23.464 132.623 23.304 134.734 23.304C136.847 23.24 138.831 23.24 140.687 23.304C140.623 22.664 140.591 22.056 140.591 21.48C140.591 20.84 140.559 20.232 140.495 19.656C140.431 18.888 140.399 17.928 140.399 16.776C140.399 15.56 140.463 14.376 140.591 13.224C140.783 12.008 141.071 10.888 141.455 9.86399C141.839 8.776 142.383 7.944 143.087 7.368C144.047 6.6 145.007 6.184 145.967 6.12C146.991 5.992 147.919 6.12 148.751 6.504C149.647 6.888 150.383 7.464 150.959 8.232C151.599 8.936 152.047 9.736 152.303 10.632C152.495 11.4 152.655 12.328 152.783 13.416C152.911 14.44 152.975 15.528 152.975 16.68C153.039 17.832 153.071 18.984 153.071 20.136C153.071 21.288 153.071 22.344 153.071 23.304H154.031C154.991 23.304 156.111 23.272 157.391 23.208C158.671 23.144 159.919 23.176 161.135 23.304C162.415 23.432 163.567 23.752 164.591 24.264C165.615 24.712 166.383 25.512 166.895 26.664ZM226.004 52.872C226.836 54.728 226.868 56.552 226.1 58.344C225.332 60.072 224.116 61.672 222.452 63.144C220.788 64.616 218.868 65.896 216.692 66.984C214.58 68.072 212.564 68.84 210.644 69.288C208.532 69.736 206.292 69.928 203.924 69.864C201.62 69.864 199.284 69.576 196.916 69C194.612 68.488 192.34 67.72 190.1 66.696C187.924 65.608 185.908 64.296 184.052 62.76C181.812 60.904 180.052 58.696 178.772 56.136C177.556 53.512 176.66 50.728 176.084 47.784C175.508 44.84 175.188 41.896 175.124 38.952C175.124 35.944 175.22 33.128 175.412 30.504C175.604 28.136 176.084 25.672 176.852 23.112C177.62 20.552 178.676 18.056 180.02 15.624C181.428 13.128 183.092 10.824 185.012 8.712C186.996 6.6 189.3 4.808 191.924 3.336C193.908 2.184 196.116 1.416 198.548 1.032C201.044 0.583998 203.54 0.487997 206.036 0.743998C208.596 0.935999 210.996 1.48 213.236 2.376C215.54 3.208 217.492 4.35999 219.092 5.832C220.116 6.72799 221.172 7.976 222.26 9.576C223.412 11.176 224.244 12.808 224.756 14.472C225.268 16.136 225.268 17.704 224.756 19.176C224.308 20.584 223.028 21.544 220.916 22.056C220.02 22.312 219.22 22.376 218.516 22.248C217.812 22.056 217.172 21.768 216.596 21.384C216.02 20.936 215.476 20.424 214.964 19.848C214.452 19.272 213.972 18.696 213.524 18.12C211.988 16.264 210.196 15.016 208.148 14.376C206.1 13.672 204.052 13.512 202.004 13.896C200.02 14.216 198.132 15.048 196.34 16.392C194.612 17.672 193.268 19.336 192.308 21.384C191.284 23.56 190.452 25.96 189.812 28.584C189.236 31.144 188.916 33.768 188.852 36.456C188.788 39.08 189.012 41.64 189.524 44.136C190.1 46.632 191.06 48.84 192.404 50.76C193.428 52.296 194.676 53.544 196.148 54.504C197.684 55.464 199.316 56.136 201.044 56.52C202.772 56.904 204.5 56.968 206.228 56.712C208.02 56.456 209.748 55.88 211.412 54.984C211.924 54.728 212.468 54.376 213.044 53.928C213.684 53.416 214.324 52.904 214.964 52.392C215.604 51.88 216.244 51.4 216.884 50.952C217.588 50.504 218.324 50.184 219.092 49.992C220.244 49.608 221.492 49.64 222.836 50.088C224.244 50.536 225.3 51.464 226.004 52.872ZM271.811 50.088C271.875 51.368 271.907 52.712 271.907 54.12C271.907 55.464 271.875 56.712 271.811 57.864C271.747 59.592 271.651 61.192 271.523 62.664C271.395 64.072 271.139 65.288 270.755 66.312C270.371 67.272 269.763 68.008 268.931 68.52C268.163 68.968 267.075 69.096 265.667 68.904C264.195 68.712 263.139 68.008 262.499 66.792C261.859 65.576 261.411 64.2 261.155 62.664C260.963 61.064 260.899 59.464 260.963 57.864C261.027 56.264 261.027 55.016 260.963 54.12C260.899 52.712 260.835 51.112 260.771 49.32C260.771 47.464 260.579 45.736 260.195 44.136C259.875 42.472 259.299 41.064 258.467 39.912C257.635 38.76 256.387 38.152 254.723 38.088C252.611 37.96 250.979 38.12 249.827 38.568C248.739 39.016 247.939 39.688 247.427 40.584C246.915 41.416 246.595 42.44 246.467 43.656C246.403 44.872 246.275 46.184 246.083 47.592L245.987 51.336V58.344C245.987 59.496 245.955 60.712 245.891 61.992C245.891 63.208 245.699 64.328 245.315 65.352C244.931 66.376 244.323 67.24 243.491 67.944C242.723 68.648 241.571 69 240.035 69C238.115 69 236.675 68.392 235.715 67.176C234.819 65.896 234.371 64.328 234.371 62.472V7.272C234.371 6.888 234.371 6.536 234.371 6.216C234.435 5.832 234.499 5.448 234.563 5.064C234.691 4.68 234.787 4.328 234.851 4.008C234.915 3.624 235.011 3.272 235.139 2.952C235.331 2.312 235.651 1.832 236.099 1.512C236.419 1.192 236.739 0.935999 237.059 0.743998C237.379 0.551996 237.731 0.423996 238.115 0.359997C238.435 0.295998 238.787 0.263998 239.171 0.263998C239.555 0.199999 239.939 0.167999 240.323 0.167999C241.283 0.167999 242.211 0.455999 243.107 1.032C243.491 1.288 243.843 1.57599 244.163 1.89599C244.483 2.15199 244.739 2.536 244.931 3.048C245.443 4.264 245.699 5.416 245.699 6.504C245.763 6.824 245.795 7.304 245.795 7.944C245.859 8.52 245.891 9.128 245.891 9.768C245.891 10.408 245.891 11.048 245.891 11.688C245.955 12.264 245.987 12.712 245.987 13.032V13.512C246.051 15.56 246.083 17.64 246.083 19.752C246.083 21.864 246.083 24.008 246.083 26.184V27.816C248.771 26.92 251.587 26.504 254.531 26.568C257.475 26.568 260.099 27.144 262.403 28.296C264.771 29.512 266.563 30.888 267.779 32.424C269.059 33.96 269.987 35.656 270.563 37.512C271.139 39.368 271.459 41.352 271.523 43.464C271.651 45.576 271.747 47.784 271.811 50.088ZM290.791 28.584C292.711 27.624 294.727 26.952 296.839 26.568C298.951 26.12 301.031 26.024 303.079 26.28C305.191 26.472 307.207 27.016 309.127 27.912C311.047 28.744 312.839 29.96 314.503 31.56C316.167 33.224 317.447 35.048 318.343 37.032C319.239 39.016 319.879 41.224 320.263 43.656C320.519 45.32 320.935 46.856 321.511 48.264C322.087 49.672 322.695 51.08 323.335 52.488C324.039 53.896 324.679 55.304 325.255 56.712C325.895 58.12 326.407 59.592 326.791 61.128C327.111 62.6 326.983 64.04 326.407 65.448C325.895 66.792 324.807 67.624 323.143 67.944C322.183 68.136 321.255 68.072 320.359 67.752C319.527 67.368 318.759 66.856 318.055 66.216C317.351 65.512 316.711 64.776 316.135 64.008C315.623 63.176 315.143 62.408 314.695 61.704C313.223 63.624 311.623 65.128 309.895 66.216C308.167 67.24 306.087 67.912 303.655 68.232C301.607 68.488 299.655 68.552 297.799 68.424C295.943 68.296 293.959 67.944 291.847 67.368C289.095 66.664 286.823 65.448 285.031 63.72C283.303 61.928 281.959 59.88 280.999 57.576C280.103 55.208 279.623 52.68 279.559 49.992C279.495 47.304 279.815 44.648 280.519 42.024C281.415 38.568 282.759 35.752 284.551 33.576C286.343 31.4 288.423 29.736 290.791 28.584ZM293.191 39.816C292.295 40.712 291.591 41.768 291.079 42.984C290.567 44.2 290.247 45.48 290.119 46.824C290.055 48.168 290.183 49.512 290.503 50.856C290.823 52.2 291.335 53.384 292.039 54.408C292.679 55.304 293.767 56.072 295.303 56.712C296.839 57.288 298.439 57.64 300.103 57.768C302.023 57.896 303.687 57.384 305.095 56.232C306.567 55.08 307.655 53.64 308.359 51.912C309.127 50.12 309.479 48.232 309.415 46.248C309.351 44.2 308.807 42.344 307.783 40.68C307.015 39.464 305.991 38.568 304.711 37.992C303.495 37.416 302.183 37.128 300.775 37.128C299.367 37.064 297.959 37.288 296.551 37.8C295.207 38.248 294.087 38.92 293.191 39.816ZM364.426 26.664C364.938 27.88 364.97 29.224 364.522 30.696C364.138 32.168 363.402 33.128 362.314 33.576C361.738 33.832 360.97 34.056 360.01 34.248C359.05 34.376 357.994 34.504 356.842 34.632C355.754 34.76 354.666 34.856 353.578 34.92C352.49 34.984 351.562 35.016 350.794 35.016C350.858 36.936 350.922 38.92 350.986 40.968C351.05 42.952 351.114 44.904 351.178 46.824C351.242 48.744 351.274 50.6 351.274 52.392C351.274 54.12 351.242 55.688 351.178 57.096C351.178 58.056 351.178 59.176 351.178 60.456C351.178 61.672 351.082 62.856 350.89 64.008C350.762 65.16 350.538 66.184 350.218 67.08C349.898 67.912 349.418 68.456 348.778 68.712C346.794 69.544 344.97 69.768 343.306 69.384C341.706 69.064 340.554 68.392 339.85 67.368C339.338 66.536 338.954 65.576 338.698 64.488C338.442 63.336 338.25 62.184 338.122 61.032C338.058 59.816 338.026 58.664 338.026 57.576C338.09 56.424 338.122 55.432 338.122 54.6C338.186 51.912 338.218 48.872 338.218 45.48C338.282 42.024 338.314 38.568 338.314 35.112H336.874C336.106 35.112 335.114 35.112 333.898 35.112C332.746 35.048 331.562 34.952 330.346 34.824C329.194 34.632 328.106 34.408 327.082 34.152C326.058 33.832 325.322 33.384 324.874 32.808C324.17 31.976 323.722 31.08 323.53 30.12C323.402 29.16 323.466 28.264 323.722 27.432C324.042 26.536 324.522 25.768 325.162 25.128C325.802 24.424 326.538 23.976 327.37 23.784C328.522 23.464 330.154 23.304 332.266 23.304C334.378 23.24 336.362 23.24 338.218 23.304C338.154 22.664 338.122 22.056 338.122 21.48C338.122 20.84 338.09 20.232 338.026 19.656C337.962 18.888 337.93 17.928 337.93 16.776C337.93 15.56 337.994 14.376 338.122 13.224C338.314 12.008 338.602 10.888 338.986 9.86399C339.37 8.776 339.914 7.944 340.618 7.368C341.578 6.6 342.538 6.184 343.498 6.12C344.522 5.992 345.45 6.12 346.282 6.504C347.178 6.888 347.914 7.464 348.49 8.232C349.13 8.936 349.578 9.736 349.834 10.632C350.026 11.4 350.186 12.328 350.314 13.416C350.442 14.44 350.506 15.528 350.506 16.68C350.57 17.832 350.602 18.984 350.602 20.136C350.602 21.288 350.602 22.344 350.602 23.304H351.562C352.522 23.304 353.642 23.272 354.922 23.208C356.202 23.144 357.45 23.176 358.666 23.304C359.946 23.432 361.098 23.752 362.122 24.264C363.146 24.712 363.914 25.512 364.426 26.664Z" fill="#5BC6DF"/>
</svg>
        <form action="/" method="post" className="flex flex-col gap-5 md:gap-10 ">
        <Toaster />
        <div className="flex  items-center gap-4">
      <label className="cursor-pointer" htmlFor="image" >
        {image ? (
          <img
            src={image}
            alt="Profile Preview"
            className="w-32 h-32 rounded-full object-cover border-2  border-[#5BC6DF] md:w-42 md:h-42"
          />
        ) : (
          <div className="w-32 h-32 flex items-center justify-center border rounded-full ml-15 md:ml-17 md:w-42 md:h-42 bg-[#253D4C] text-white border-[#5BC6DF] relative">
           <h2 className="absolute top-[50] font-bold "> Upload Image</h2>
          </div>
        )}
        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" name="image" id="image" />
      </label>
      {image && <button className="bg-[#1DA1F2] w-28 h-8  text-xl font-medium text-[#FFFFFF]  rounded-xl" onClick={() => setImage(null)}><i className="fa-solid fa-trash text-[4vw] mr-2 md:text-[1vw]"></i>Remove</button>}
    </div>
          <input type="text" className="bg-[#242424] w-60 h-10 rounded-xl text-[5vw] px-5 py-5 text-[#F5F5F5] md:text-[2vw]    md:w-80"name="firstname" id="firstname" required placeholder="Enter First name" onChange={(e)=>{setfirst(e.target.value)} } value={first}/>
          <input type="text" className="bg-[#242424] w-60 h-10 rounded-xl text-[5vw] px-5 py-5 text-[#F5F5F5] md:text-[2vw] md:w-80"name="lastname" id="lastname" placeholder="Enter Last name" onChange={(e)=>{setlast(e.target.value)}} value={last}/>
      <select className="bg-[#242424] w-60 h-10 rounded-xl text-[5vw] text-[#f5f5f587] md:text-[2vw] md:w-80"  value={gender} onChange={(e) => setgender(e.target.value)}>
        <option value="" disabled hidden>Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>
          <button type="submit" className="bg-[#1DA1F2] w-40 h-10 ml-10 text-xl font-medium text-[#FFFFFF]  rounded-xl md:ml-15 " onClick={sendData}>Save Changes</button>
        </form>
      </div>
    )
  }
  
  export default Profile

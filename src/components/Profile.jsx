import React, { useEffect, useState } from 'react'
import EditProfile from './EditProfile'
import { useSelector } from 'react-redux'
import Loader from './Loader';

const Profile = () => {
  const user = useSelector((store)=> store.user);
  const [showProfile,setShowProfile] = useState(true);

  useEffect(()=>{
    window.scrollTo(0,0);
  },[showProfile])

  return (
      <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      {user ? (<EditProfile user={user} showProfile={showProfile} handleShowProfile={()=> {showProfile ? setShowProfile(false) : setShowProfile(true)}}/>) : <Loader/>}
    </div>
  )
}

export default Profile
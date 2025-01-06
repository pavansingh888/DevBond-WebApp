import React, { useEffect, useState } from 'react'
import EditProfile from './EditProfile'
import { useSelector } from 'react-redux'

const Profile = () => {
  const user = useSelector((store)=> store.user);
  const [showProfile,setShowProfile] = useState(false);

  useEffect(()=>{
    window.scrollTo(0,0);
  },[showProfile])

  return (
    user && (
      <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      <EditProfile user={user} showProfile={showProfile} handleShowProfile={()=> {showProfile ? setShowProfile(false) : setShowProfile(true)}}/>
    </div>
    )
    
  )
}

export default Profile
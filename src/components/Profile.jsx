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
      <div className='flex-grow items-center min-h-screen'>
      <EditProfile user={user} showProfile={showProfile} handleShowProfile={()=> {showProfile ? setShowProfile(false) : setShowProfile(true)}}/>
    </div>
    )
    
  )
}

export default Profile
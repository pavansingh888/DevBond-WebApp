import axios from 'axios'
import React, { useEffect } from 'react'
import { BASE_URL } from '../utils/constants'
import { useDispatch, useSelector } from 'react-redux'
import { addFeed } from '../utils/feedSlice'
import UserCard from './UserCard'

const Feed = () => {
    const feed = useSelector((store)=>store.feed)
    const dispatch = useDispatch();

    const getFeed = async ( ) => {
        if(feed) return;
       try{ const res = await axios.get(BASE_URL+'/feed',{withCredentials:true});
        dispatch(addFeed(res.data.data))
       }catch(error){
        console.log('ERROR fecthing feed: '+ error);
       }
    }

    useEffect(()=>{
        getFeed();  
    },[])

    if(!feed){
      return (
        <div className='min-h-screen'></div>
      )
    }

    if (feed.length <= 0){
      return (
      <div className='min-h-screen'>
         <h1 className="flex justify-center my-10">No new users founds!</h1>);
      </div>
      )
    }
      

  return (
    feed ? <div className='flex-grow flex justify-center'>
        <UserCard user={feed[0]}/>
    </div> : <div className='flex-grow h-screen'>

    </div>
  )
}

export default Feed
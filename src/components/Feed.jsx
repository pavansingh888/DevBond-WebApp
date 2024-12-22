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

  return (
    feed ? <div className='flex-grow flex justify-center'>
        <UserCard user={feed[0]}/>
    </div> : <div className='flex-grow justify-center '>
    </div>
  )
}

export default Feed
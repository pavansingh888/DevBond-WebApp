import axios from 'axios';
import React, { useEffect } from 'react';
import { BASE_URL } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { addFeed } from '../utils/feedSlice';
import UserCard from './UserCard';

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();

  const getFeed = async () => {
    if (feed) return; 
    try {
      const res = await axios.get(BASE_URL + '/feed', { withCredentials: true });
      dispatch(addFeed(res.data.data));
    } catch (error) {
      console.error('ERROR fetching feed: ' + error);
    }
  };

  useEffect(() => {
    getFeed();
  }, []); 

  // if no feed data is available - display loading message or prompt to log in
  if (!feed) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <h1 className="text-lg font-semibold text-gray-600">Login to get started</h1>
      </div>
    );
  }

  // if no users are found in the feed - display a message
  if (feed.length === 0) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <h1 className="text-lg font-semibold text-gray-600">No new users found!</h1>
      </div>
    );
  }

  return (
    <div className="flex-grow flex justify-center items-center py-8 bg-white">
      <UserCard user={feed[0]} />
    </div>
  );
};

export default Feed;

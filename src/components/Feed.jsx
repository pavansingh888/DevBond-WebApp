import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed, removeFeed, resetFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { removeUser } from "../utils/userSlice";
import { removeAllRequests } from "../utils/requestsSlice";
import { removeConnections } from "../utils/connectionsSlice";

const Feed = () => {
  const { users, currentPage, hasMore } = useSelector((store) => store?.feed);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentUserIndex, setCurrentUserIndex] = useState(0); //tracks current profile being viewed
  const [isLoading, setIsLoading] = useState(true);

  const fetchFeedPage = async (page = 1) => {
    try {
      const res = await axios.get(`${BASE_URL}/feed?page=${page}&limit=1`, {
        withCredentials: true,
      });
      dispatch(addFeed({ data: res.data.data, page }));
    } catch (error) {
      // console.error("ERROR fetching feed: " + error);
      if(error.status===401){
        navigate("/login")
        dispatch(removeUser());
        dispatch(removeFeed());
        dispatch(removeAllRequests());
        dispatch(removeConnections());
     }else{
      navigate("/error", {
        state: {
          message: error?.message || "An unexpected error occurred",
          note: "Error fetching feed."
        }
      })
    }
    } finally {
      setIsLoading(false); //marking loading as complete regardless of success or failure
    }
  };

  useEffect(() => {
    fetchFeedPage(1);
  }, [dispatch]);

  // Fetch next page when user reaches the end of current page
  useEffect(() => {
    if (currentUserIndex >= users?.length && hasMore) {
      fetchFeedPage(currentPage + 1);
    }
  }, [currentUserIndex, users?.length, hasMore, currentPage]);

  //naviagting after loading is false
  // useEffect(() => {
  //   if (!isLoading && !users) {
  //     return navigate("/login");
  //   }
  // }, [isLoading, users, navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleNextUser = () => {
    setCurrentUserIndex((prev) => prev + 1);
  };

  if (users?.length === 0 && !hasMore) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md text-center">
        <IoMdCheckmarkCircleOutline className="text-4xl text-blue-500 mx-auto mb-3" />
        <h1 className="text-xl font-semibold text-gray-800">
          No More Profiles Available
        </h1>
        <p className="text-gray-600 mt-2">
          You have interacted with all the profiles. Please check back later for new connections!
        </p>
      </div>
    </div>
    );
  }

  return (
    <div className="flex-grow flex justify-center items-center py-8 bg-slate-200 min-h-screen">
      {isLoading ? (
        <Loader />
      ) : users && users[currentUserIndex] ? (
        <UserCard user={users[currentUserIndex]} onNext={handleNextUser} />
      ) : (
        <div className="min-h-screen flex justify-center items-center bg-slate-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md text-center">
        <IoMdCheckmarkCircleOutline className="text-4xl text-blue-500 mx-auto mb-3" />
        <h1 className="text-xl font-semibold text-gray-800">
          No More Profiles Available
        </h1>
        <p className="text-gray-600 mt-2">
          You have interacted with all the profiles. Please check back later for new connections!
        </p>
      </div>
    </div>
      )}
    </div>
  );
};

export default Feed;

import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import NavBar from "./NavBar";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser, removeUser } from "../utils/userSlice";
import axios from "axios";
import Loader from "./Loader";
import { removeFeed } from "../utils/feedSlice";
import { removeAllRequests } from "../utils/requestsSlice";
import { removeConnections } from "../utils/connectionsSlice";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((store) => store.user);

  const fetchUser = async () => {
    try {
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });
      dispatch(addUser(res.data));
    } catch (error) {
      
      if (error.status === 401) {
        navigate("/login");
        dispatch(removeUser());
        dispatch(removeFeed());
        dispatch(removeAllRequests());
        dispatch(removeConnections());
      } else {
        // console.error(error);
        navigate("/error", {
          state: {
            message: error?.message || "An unexpected error occurred",
            note: "Error getting profile details.",
          },
        });
      }
    }
  };

  useEffect(() => {
    if (!userData) {
      fetchUser();
    }
  }, [userData]);

  return (
    <>
      <NavBar />
      {/* {loading ? <Loader/> : <Outlet className='min-h-screen '/>} */}
      <Outlet className="min-h-screen " />
      <Footer />
    </>
  );
};

export default Body;

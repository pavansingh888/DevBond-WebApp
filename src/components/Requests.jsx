import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeAllRequests, removeRequest } from "../utils/requestsSlice";
import axios from "axios";
import Loader from "./Loader";
import { IoPersonRemoveOutline } from "react-icons/io5";
import { removeUser } from "../utils/userSlice";
import { removeFeed } from "../utils/feedSlice";
import { removeConnections } from "../utils/connectionsSlice";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.requests);
  const [loading,setLoading] = useState(false)
  const fetchRequests = async () => {
    try {
      setLoading(true)
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });
      dispatch(addRequests(res?.data?.data));

    } catch (error) {
      // console.error(error);
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
          note: "Error fetching recieved requests."
        }
      })
    }
    } finally {
      setLoading(false)
    }
  };

  const reviewRequest = async (status, _id) => {
    try {
      setLoading(true)
      await axios.post(
        BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(_id));
    } catch (error) {
      // console.error(error);
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
          note: `Error ${status==="accepted" ? "accepting" : "rejecting"} the request.`
        }
      })
    }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  useEffect(() => {
    if (!requests) {
      fetchRequests();;
    }
  }, []);

  if (loading) {
    return <Loader/>;
  }

  if (requests?.length === 0) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md text-center">
        <IoPersonRemoveOutline className="text-4xl text-red-500 mx-auto mb-3" />
        <h1 className="text-xl font-semibold text-gray-800">
          No More Connection Requests
        </h1>
        <p className="text-gray-600 mt-2">
          You have interacted with all the connection requests. Check back later for new requests!
        </p>
      </div>
    </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-10 min-h-screen px-4 bg-slate-200">
      <h1 className="font-bold text-black text-3xl mb-6 text-center">Connection Requests</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {requests?.map((request) => {
          const { _id, firstName, lastName, photoUrl, age, gender, about } =
            request.fromUserId;
          return (
            <div
              key={_id}
              className="shadow-md rounded-lg p-4 flex flex-col items-center text-center bg-white text-black"
            >
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-300">
                <img
                  alt="User"
                  className="w-full h-full object-cover"
                  src={photoUrl}
                />
              </div>
              <div className="mt-4">
                <h2 className="font-bold text-lg">{`${firstName} ${lastName}`}</h2>
                {age && gender && (
                  <p className="text-sm text-gray-500">{`${age}, ${gender}`}</p>
                )}
                <p className="text-sm text-gray-700 mt-2">{about}</p>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  className="btn btn-sm btn-primary text-white"
                  onClick={() => reviewRequest("accepted", request._id)}
                >
                  Accept
                </button>
                <button
                  className="btn btn-sm btn-error text-gray-100"
                  onClick={() => reviewRequest("rejected", request._id)}
                >
                  Reject
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Requests;

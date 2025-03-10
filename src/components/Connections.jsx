import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnections, removeConnection } from "../utils/connectionsSlice";
import { Link } from "react-router-dom";
import Loader from "./Loader";

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connections);
  const isPremium = useSelector((store)=> store?.user?.isPremium)
  const [loading, setLoading] = useState(false);

  const fetchConnections = async () => {
    setLoading(true);
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res?.data?.data));
    } catch (error) {
      // console.error(error);
      navigate("/error", {
        state: {
          message: error?.message || "An unexpected error occurred",
          note: "Error fetching User connections."
        }
      })
    } finally {
      setLoading(false);
    }
  };
  const handleRemoveConnection = async (connectionId) => {
    try {
      const res = await axios.delete(BASE_URL + "/user/connections/remove/" + connectionId, {
        withCredentials: true,
      });
      
      if(res.status === 200) dispatch(removeConnection(connectionId));
    } catch (error) {
      // console.error(error);
      navigate("/error", {
        state: {
          message: error?.message || "An unexpected error occurred",
          note: "Error removing connection."
        }
      })
    } 
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  useEffect(() => {
    if(!connections) fetchConnections();
  },[]);

  if (loading) {
    return (
      <Loader/>
    );
  }

  if (!connections) {
    return <div className="min-h-screen bg-slate-200"></div>;
  }

  if (connections.length === 0) {
    return (
      <div className="min-h-screen flex justify-center items-center font-semibold text-lg bg-slate-200 text-gray-800 ">
        <h1>No connections found!</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-slate-200">
      <h1 className="font-bold text-black text-3xl my-10">Connections</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 w-full">
        {connections.map((connection) => {
          const { firstName, lastName, photoUrl, age, gender, about, _id } =
            connection;
          return (
            <div
              className="card bg-white text-black shadow-md hover:shadow-lg rounded-lg p-4 flex flex-col items-center justify-around" 
              key={_id}
            >
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-300">
                <img
                  alt="User"
                  className="w-full h-full object-cover"
                  src={photoUrl}
                />
              </div>
              <div className="text-center mt-4">
                <h2 className="font-bold text-lg">{`${firstName} ${lastName}`}</h2>
                {age && gender && (
                  <p className="text-sm text-gray-500">{`${age}, ${gender}`}</p>
                )}
                <p className="text-sm text-gray-700 mt-2">{about}</p>
              </div>
              <div className="flex gap-2 mt-4 ">
                <Link to={isPremium ? `/chat/`+_id : `/premium`}>
                <button className="btn btn-sm btn-success text-white" >
                  {isPremium ? "Message" : "Chat with Premium"}
                </button>
                </Link>
                
                <button className="btn btn-sm btn-error text-gray-100" onClick={()=>handleRemoveConnection(_id)}>
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;

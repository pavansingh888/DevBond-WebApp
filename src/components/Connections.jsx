import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import {addConnections} from "../utils/connectionsSlice";

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connections);

  const fetchConnections = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      console.log(res.data.data);
      dispatch(addConnections(res.data.data));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!connections) {
      fetchConnections();
    }
  }, []);

  if (!connections) {
    return;
  }

  if (connections.length === 0) {
    <div>
      <h1>No connections found.</h1>
    </div>;
  }

  return (<div className="flex flex-col items-center justify-start min-h-screen">
    <h1 className="text-bold text-white text-3xl my-10">Connections</h1>
    {connections.map((connection) => {
      const { firstName, lastName, photoUrl, age, gender, about,_id } =
        connection;
      return (
        <div className=" flex m-1 p-4 rounded-lg bg-base-300 w-1/2 mx-auto" key={_id}>
          <div>
            <img
              alt="photo"
              className="w-20 h-20 rounded-full"
              src={photoUrl}
            />
          </div>
          <div className="text-left mx-4 ">
            <h2 className="font-bold text-xl">
              {firstName + " " + lastName}
            </h2>
            {age && gender && <p>{age + ", " + gender}</p>}
            <p>{about}</p>
          </div>
        </div>
      );
    })}
  </div>);
};

export default Connections;

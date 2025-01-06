import React, { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestsSlice";
import axios from "axios";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.requests);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });
      dispatch(addRequests(res?.data?.data));
    } catch (error) {
      console.error(error);
    }
  };

  const reviewRequest = async (status, _id) => {
    try {
      await axios.post(
        BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(_id));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) {
    return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
  }

  if (requests.length === 0) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <h1 className="text-lg font-medium text-gray-600">No new connection requests found!</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-10 min-h-screen px-4 bg-white">
      <h1 className="font-bold text-black text-3xl mb-6 text-center">Connection Requests</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {requests.map((request) => {
          const { _id, firstName, lastName, photoUrl, age, gender, about } =
            request.fromUserId;
          return (
            <div
              key={_id}
              className="shadow-md rounded-lg p-4 flex flex-col items-center text-center bg-slate-200 text-black"
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

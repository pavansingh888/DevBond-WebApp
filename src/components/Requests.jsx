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
      console.log(res);

      dispatch(addRequests(res?.data?.data));
    } catch (error) {
      console.error(error);
    }
  };

  const reviewRequest = async (status, _id) => {
    try {
      const res = await axios.post(
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
    return <div className="min-h-screen"></div>;
  }

  if (requests.length === 0) {
    return (
    <div className="min-h-screen">
      <h1 className="flex justify-center my-10 text-lg font-medium">
        No new connection request found!
      </h1>
    </div>
    )
  }

  return (
    <div className="flex flex-col items-center my-10 min-h-svh mx-4">
      <h1 className="font-semibold text-white text-3xl text-center">
        Connection Requests
      </h1>
      {requests.map((request) => {
        const { _id, firstName, lastName, photoUrl, age, gender, about } =
          request.fromUserId;
        return (
          <div
            key={_id}
            className=" flex justify-between items-center mt-4 p-2 rounded-lg bg-base-300 w-fit"
          >
            <div>
              <img
                alt="photo"
                className="w-20 h-20 rounded-full object-cover"
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
            <div className="flex  items-center">
              <button
                className="btn btn-error mr-1 mb-1 "
                onClick={() => reviewRequest("rejected",request._id)}
              >
                Reject
              </button>
              <button
                className="btn btn-primary "
                onClick={() => reviewRequest("accepted",request._id)}
              >
                Accept
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Requests;

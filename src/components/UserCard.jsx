import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
// import { removeUserFromFeed } from "../utils/feedSlice";
import { BASE_URL } from "../utils/constants";
import Loader from "./Loader";

const UserCard = ({ user, onNext }) => {
  // console.log(user);
  const { _id, firstName, lastName, age, gender, about, photoUrl } = user;
  const dispatch = useDispatch();
  const [loading,setLoading] = useState(false);

  const handleSendRequest = async (status, userId) => {
    try {
      setLoading(true)
      const res = await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
      );
      // dispatch(removeUserFromFeed(userId));

      // After request is sent, move to next profile
      if (onNext) {
        onNext();
      }
    } catch (error) {
      console.error(error);
      if(error.status===401){
        navigate("/login")
     }else{
      navigate("/error", {
        state: {
          message: error?.message || "An unexpected error occurred",
          note: `Error ${status === 'interested' ? 'sending request to' : 'ignoring'} the user.`
        }
      })
    }
    } finally {
      setLoading(false)
    }
  };

  if (loading) {
    return <Loader/>;
  }
  return (
    <div className="flex flex-col justify-center my-8 mx-8 max-[320px]:mx-4 w-96 max-[470px]:w-72 max-[320px]:w-full">
      <div className="card glass w-full bg-gradient-to-r from-rose-500 to-blue-400 text-white shadow-blue-900 shadow-2xl">
      <figure className="w-full h-96 flex items-center justify-center bg-gray-300 mx-auto">
  <img
    src={photoUrl || "https://geographyandyou.com/images/user-profile.png"}
    alt="photo"
    className="w-full h-full object-cover"
  />
</figure>
        <div className="card-body">
          <h2 className="card-title">{firstName + " " + lastName}</h2>
          {age && gender && <p>{age + ", " + gender}</p>}
          <p className="text-gray-100">{about}</p>
          <div className="card-actions justify-center mt-4">
            <button
              className="btn btn-accent text-white"
              onClick={() => handleSendRequest("ignored", _id)}
            >
              Ignore
            </button>
            <button
              className="btn btn-primary text-white"
              onClick={() => handleSendRequest("interested", _id)}
            >
              Interested
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;

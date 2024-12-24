import axios from "axios";
import React from "react";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import { BASE_URL } from "../utils/constants";

const UserCard = ({user}) => {
     console.log(user);
     const {_id,firstName, lastName, age, gender, about, photoUrl } = user;
     const dispatch = useDispatch();

     const handleSendRequest = async (status, userId) => {
      try {
        const res = await axios.post(BASE_URL + "/request/send/" + status + "/" + userId,
          {},
          { withCredentials: true }
        );
        dispatch(removeUserFromFeed(userId));
      } catch (error) {
        console.error(error);
      }
     }


  return (
    <div className="flex flex-col justify-center my-8 mx-8 max-[320px]:mx-4 w-96 max-[470px]:w-72 max-[320px]:w-full">
      <div className="card glass w-full bg-info-content ">
        <figure>
          <img
            src={photoUrl}
            alt="photo"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{firstName + " " + lastName}</h2>
          {age && gender && <p>{age+", "+gender}</p>}
          <p>{about}</p>
          <div className="card-actions justify-center mt-4">
            <button className="btn btn-accent"  onClick={() => handleSendRequest("ignored", _id)}>Ignore</button>
            <button className="btn btn-primary"  onClick={() => handleSendRequest("interested", _id)}>Interested</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;

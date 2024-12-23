import React from "react";

const UserCard = ({user}) => {
     console.log(user);
     const {firstName, lastName, age, gender, about, photoUrl } = user;
     
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
            <button className="btn btn-accent">Ignore</button>
            <button className="btn btn-primary">Interested</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;

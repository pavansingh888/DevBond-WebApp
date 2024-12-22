import React from "react";

const UserCard = ({user}) => {
     console.log(user);
     const {firstName, lastName, age, gender, about, photoUrl } = user;
     
  return (
    <div>
      <div className="card glass w-96 my-10 bg-info-content">
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

import React, { useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import axios from "axios";
import UserCard from './UserCard';

const EditProfile = ({ user, showProfile, handleShowProfile }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);

  const saveProfile = async () => {
    try {
      if (!isValidString(firstName)) {
        setError("Minimum 3 alphabet only characters required in first name.");
        return;
      }
      if (!isValidString(lastName)) {
        setError("Minimum 3 alphabet only characters required in last name.");
        return;
      }
      if (!isValidUrl(photoUrl)) {
        setError("Please provide a valid photo URL.");
        return;
      }
      if (!isValidAge(age)) {
        setError("Please provide a valid age.");
        return;
      }
      setError("");
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        {
          firstName,
          lastName,
          photoUrl,
          age,
          gender,
          about,
        },
        { withCredentials: true }
      );
      dispatch(addUser(res?.data?.data));
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
      !showProfile && handleShowProfile();
    } catch (error) {
      setError(error);
      console.log(error);
    }
  };

  function isValidString(input) {
    if (
      !input ||
      input.length < 4 ||
      input.length > 50 ||
      !/^[a-zA-Z]+$/.test(input)
    ) {
      return false;
    }
    return true;
  }
  function isValidUrl(input) {
    if (
      !input ||
      input.length < 3 ||
      !/^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})([\/\w .-]*)*\/?$/.test(input) ||
      (!input.startsWith("http://") && !input.startsWith("https://"))
    ) {
      return false;
    }
    return true;
  }
  function isValidAge(input) {
    if (
      input === "" ||
      input === null ||
      isNaN(input) ||
      input <= 17 ||
      input >= 105
    ) {
      return false;
    }
    return true;
  }

  return (
    <>
      <div className="flex justify-center flex-wrap">
        {showProfile && <UserCard user={{firstName,lastName,about,age,gender,photoUrl}}/>}
        <div className="w-96 max-[470px]:w-72 max-[320px]:w-full max-[320px]:mx-4 mx-8 bg-base-300 flex flex-col items-start justify-center py-8 px-8 rounded-xl my-8">
          <h2 className="text-2xl font-bold self-center mb-2 mt-2">
            Edit Profile
          </h2>
          <label className=" flex flex-col items-start gap-1 w-full mt-2">
            First Name :
            <input
              type="text"
              className="input input-bordered  w-full max-w-2xl"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </label>
          <label className=" flex flex-col items-start gap-2 w-full mt-2">
            Last Name :
            <input
              type="text"
              className="input input-bordered  w-full max-w-xs"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </label>
          <label className=" flex flex-col items-start gap-1 w-full mt-2">
            Photo URL :
            <input
              type="text"
              className="input input-bordered  w-full max-w-xs"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
            />
          </label>
          <label className=" flex flex-col items-start gap-1 w-full mt-2">
            Age :
            <input
              type="text"
              className="input input-bordered  w-full max-w-xs"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </label>
          <label className=" flex flex-col items-start gap-1 w-full mt-2">
            Gender :
            <div className="space-x-2 flex items-center">
              <input
                type="radio"
                name="gender"
                value="male"
                className="radio radio-info radio-sm"
                checked={gender === "male"}
                onChange={(e) => setGender(e.target.value)}
              />{" "}
              &nbsp; Male
              <input
                type="radio"
                name="gender"
                value="female"
                checked={gender === "female"}
                className="radio radio-info radio-sm"
                onChange={(e) => setGender(e.target.value)}
              />
              &nbsp; Female
              <input
                type="radio"
                name="gender"
                value="others"
                checked={gender === "others"}
                className="radio radio-info radio-sm"
                onChange={(e) => setGender(e.target.value)}
              />
              &nbsp; others
            </div>
          </label>
          <label className=" flex flex-col items-start gap-1 w-full mt-2">
            About :
            <textarea
              type="text"
              className="textarea textarea-md w-full"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
            ></textarea>
          </label>
          {error && <p className="text-error py-2">{error}</p>}
          <div className="mt-4 flex justify-evenly w-full flex-wrap">
            <button className="btn btn-secondary my-1" onClick={saveProfile}>
              Save Profile
            </button>
            <button className="btn btn-info my-1" onClick={handleShowProfile}>
              {showProfile ? "Hide Profile" : "My Profile"}
            </button>
          </div>
        </div>
      </div>
      {showToast && (
        <div className="toast toast-top toast-center z-50">
          <div className="alert alert-success">
            <span>Profile saved successfully!</span>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;

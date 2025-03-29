import React, { useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser, removeUser } from "../utils/userSlice";
import axios from "axios";
import UserCard from './UserCard';
import { removeFeed } from "../utils/feedSlice";
import { removeAllRequests } from "../utils/requestsSlice";
import { removeConnections } from "../utils/connectionsSlice";

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
        setError("Minimum 3 to maximum 50 alphabet only characters required in first name.");
        return;
      }
      if (!isValidString(lastName)) {
        setError("Minimum 3 to maximum 50 alphabet only characters required in last name.");
        return;
      }
      if (!isValidPhotoUrl(photoUrl)) {
        setError("Please provide a valid photo URL. URLs must end with .jpg, .jpeg, .png, .gif, .webp, or .svg.");
        return;
      }
      if (!isValidAge(age)) {
        setError("Age must be a number between 18 and 120.");
        return;
      }
      if (!isValidGender(gender)) {
        setError("Gender must be one of: male, female, others.");
        return;
      }
      if (!isValidAbout(about)) {
        setError("About section cannot exceed 500 characters.");
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
      console.log(error);
      if (error.status === 401) {
        navigate("/login");
        dispatch(removeUser());
        dispatch(removeFeed());
        dispatch(removeAllRequests());
        dispatch(removeConnections());
      } else {
      setError(error.response.data);
      }
    }
  };

  function isValidString(input) {
    
    
    if (
      !input ||
      input.length < 3 ||
      input.length > 50 ||
      !/^[a-zA-Z\s]+$/.test(input)
    ) {console.log("isValid", input);
      return false;
    }
    return true;
  }
  function isValidPhotoUrl(url) {
    // First check if it's a valid URL
    try {
      new URL(url);
    } catch (e) {
      return false;
    }
    
    // Check if URL ends with common image extensions
    const validImageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
    const lowercaseUrl = url.toLowerCase();
    
    return validImageExtensions.some(ext => lowercaseUrl.endsWith(ext)) || 
           // Check for image URLs that might not have extension in the path
           /\.(jpg|jpeg|png|gif|bmp|webp|svg)($|\?)/i.test(url);
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
  function isValidGender(input) {
    if (!["male", "female", "others"].includes(input.toLowerCase())) {
      return false;
    }
    return true;
  }
  function isValidAbout(input) {
    if (about.length > 500) {
      return false;
    }
    return true;
  }

  return (
    <>
  <div className="container mx-auto py-8 text-gray-700 bg-slate-200">
    <div className="flex flex-wrap justify-center gap-8">
      {showProfile && (
        <UserCard user={{ firstName, lastName, about, age, gender, photoUrl }} />
      )}
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Edit Profile</h2>
        <form className="space-y-4">
          {/* First Name */}
          <div className="form-control">
            <label className="label text-sm font-medium text-gray-500">First Name:</label>
            <input
              type="text"
              className="input input-bordered w-full focus:outline-none focus:ring focus:ring-blue-300 bg-gray-200"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name"
            />
          </div>
          {/* Last Name */}
          <div className="form-control">
            <label className="label text-sm font-medium text-gray-500">Last Name:</label>
            <input
              type="text"
              className="input input-bordered w-full focus:outline-none focus:ring focus:ring-blue-300 bg-gray-200"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your last name"
            />
          </div>
          {/* Photo URL */}
          <div className="form-control">
            <label className="label text-sm font-medium text-gray-500">Photo URL:</label>
            <input
              type="text"
              className="input input-bordered w-full focus:outline-none focus:ring focus:ring-blue-300 bg-gray-200"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="Enter the photo URL"
            />
          </div>
          {/* Age */}
          <div className="form-control">
            <label className="label text-sm font-medium text-gray-500">Age:</label>
            <input
              type="number"
              className="input input-bordered  py w-full focus:outline-none focus:ring focus:ring-blue-300 bg-gray-200 appearance-none overflow-hidden"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter your age"
            />
          </div>
          {/* Gender */}
          <div className="form-control">
            <label className="label text-sm font-medium text-gray-500">Gender:</label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={gender === "male"}
                  className="radio radio-info"
                  onChange={(e) => setGender(e.target.value)}
                />
                <span className="ml-2">Male</span>
              </label>
              <label className="flex items-center text-gray-500">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={gender === "female"}
                  className="radio radio-info"
                  onChange={(e) => setGender(e.target.value)}
                />
                <span className="ml-2">Female</span>
              </label>
              <label className="flex items-center text-gray-500">
                <input
                  type="radio"
                  name="gender"
                  value="others"
                  checked={gender === "others"}
                  className="radio radio-info"
                  onChange={(e) => setGender(e.target.value)}
                />
                <span className="ml-2">Other</span>
              </label>
            </div>
          </div>
          {/* About */}
          <div className="form-control">
            <label className="label text-sm font-medium">About:</label>
            <textarea
              className="textarea textarea-bordered w-full bg-gray-200 focus:outline-none focus:ring focus:ring-blue-300"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="Write something about yourself"
            ></textarea>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {/* Buttons */}
          <div className="flex flex-col items-center space-y-4 ">
            <button
              type="button"
              className="btn btn-primary text-white w-full"
              onClick={saveProfile}
            >
              Save Profile
            </button>
            <button
              type="button"
              className="btn btn-secondary text-white w-full"
              onClick={handleShowProfile}
            >
              {showProfile ? "Hide Profile" : "My Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  {showToast && (
    <div className="toast toast-top toast-center z-50">
      <div className="alert alert-success shadow-lg">
        <span>Profile saved successfully!</span>
      </div>
    </div>
  )}
</>

  );
};

export default EditProfile;

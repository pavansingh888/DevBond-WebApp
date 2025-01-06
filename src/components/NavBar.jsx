import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import axios from "axios";

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());

      return navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="navbar bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-white sticky top-0 z-50 shadow-lg">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost text-2xl normal-case font-bold">
            #DEVBOND
          </Link>
        </div>
        <div className="flex gap-4 items-center ">
          {user && (
            <p className="hidden sm:block text-sm font-semibold">
              Welcome, <span className="text-yellow-300">{user.firstName}</span>
            </p>
          )}
          {user && (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar hover:bg-blue-500"
              >
                <div className="w-10 rounded-full border-2 border-white">
                  <img
                    alt="User Avatar"
                    src={user.photoUrl}
                    className="object-cover"
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-white text-black rounded-box mt-3 w-52 p-2 shadow-lg"
              >
                <li>
                  <Link to="/profile" className="flex items-center gap-2">
                    <span class="material-symbols-outlined">person</span>{" "}
                    Profile
                  </Link>
                </li>
                <li>
                  <Link to="/connections" className="flex items-center gap-2">
                    {" "}
                    <span class="material-symbols-outlined">group</span>
                    Connections
                  </Link>
                </li>
                <li>
                  <Link to="/requests" className="flex items-center gap-2">
                    {" "}
                    <span class="material-symbols-outlined">person_add</span>
                    Requests
                  </Link>
                </li>
                <li>
                  <a
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-500 hover:bg-red-100"
                  >
                    <span class="material-symbols-outlined">logout</span>Logout
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NavBar;

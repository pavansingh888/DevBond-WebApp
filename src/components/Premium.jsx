import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateIsPremium } from "../utils/userSlice";
import Loader from "./Loader";

const Premium = () => {
  const isUserPremium = useSelector(store => store?.user?.isPremium);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const verifyPremiumUser = async () => {
    const res = await axios.get(BASE_URL + "/premium/verify", {
      withCredentials: true,
    });

    console.log(res.data.isPremium);
    
    if (res.data.isPremium) {
      dispatch(updateIsPremium(res.data.isPremium));
    }
  };

  const handleBuyClick = async (type) => {
    const order = await axios.post(
      BASE_URL + "/payment/create",
      {
        membershipType: type,
      },
      { withCredentials: true }
    );
   
    const { amount, keyId, currency, notes, orderId } = order.data;

    const options = {
      key: keyId,
      amount,
      currency,
      name: "DevBond",
      description: "Connect with developers, Let's make Dev-Bonds",
      order_id: orderId,
      prefill: {
        name: notes.firstName + " " + notes.lastName,
        email: notes.emailId,
        contact: "9999999999",
      },
      theme: {
        color: "#F37254",
      },
      handler: verifyPremiumUser,
    };
    
    //It should open up dialog box of razorpay
    const rzp = new window.Razorpay(options); //this Razorpay will come from the script that we've added, we need to write window. here in react code to access it, since RZP object will be attached to the window object
    //options are required to open checkout dialog box
    rzp.open(); //point where dialog box is opened
  }


  // if (loading) {
  //   return (
  //     <Loader/>
  //   );
  // }

  return isUserPremium ? 
  (<div className="min-h-screen bg-gradient-to-r from-blue-600 to-yellow-400 text-white flex flex-col items-center px-6 py-10">
    <h1 className="text-4xl font-bold mb-4">Welcome, Premium User!</h1>
    <p className="text-lg text-center mb-6 max-w-3xl">
      Thank you for subscribing to our premium membership. You now have access to exclusive features like chatting eligibility, a verified blue tick, and more!
    </p>
    <ul className="list-disc list-inside text-left text-lg max-w-xl mb-8">
      <li>Chat with your connections seamlessly.</li>
      <li>Show off your verified profile with a blue tick.</li>
      <li>Enjoy priority customer support and an ad-free experience.</li>
    </ul>
    <div className="flex flex-col items-center w-full">
      <p className="text-2xl font-semibold mb-6">Explore Your Premium Benefits</p>
      <button
        onClick={() => navigate("/connections")}
        className="btn btn-primary text-lg px-8  rounded-lg shadow-md hover:bg-green-500 transition duration-300 bg-green-400"
      >
        Go to Connections
      </button>
    </div>
    <img
      src="/assets/premium.jpg"
      alt="Premium User"
      className="mt-10 max-w-lg w-full rounded-xl"
    />
  </div>)
  : 
  (<div className="min-h-screen bg-gradient-to-r from-gray-700 to-gray-300 text-white flex flex-col items-center px-6 py-10">
      <h1 className="text-4xl font-bold mb-4">Go Premium</h1>
      <p className="text-lg text-center mb-6 max-w-3xl">
        Upgrade to our Premium Membership and unlock exclusive features:
      </p>
      <ul className="list-disc list-inside text-left text-lg max-w-xl mb-8">
        <li>Chat with your connections and make meaningful interactions.</li>
        <li>Get a verified blue tick on your profile for added credibility.</li>
        <li>Unlimited access to premium users in your network.</li>
        <li>Priority customer support for all your queries.</li>
        <li>Ad-free experience for a smoother journey.</li>
      </ul>
      <div className="flex flex-col items-center justify-center w-full">
        <p className="text-2xl font-semibold mb-6">₹499 / Month</p>
        <button
          onClick= {()=>{handleBuyClick("premium")}}
          className="btn btn-primary text-lg px-8 rounded-lg shadow-md hover:bg-primary-focus transition duration-300 "
        >
          Pay Now
        </button>
      </div>
      <img
        src="/assets/premium.jpg"
        alt="Premium Membership"
        className="mt-10 max-w-lg w-full rounded-xl"
      />
    </div>)
};

export default Premium;

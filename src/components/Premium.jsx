import React from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Premium = () => {

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
      
    };
    
    //It should open up dialog box of razorpay
    const rzp = new window.Razorpay(options); //this Razorpay will come from the script that we've added, we need to write window. here in react code to access it, since RZP object will be attached to the window object
    //options are required to open checkout dialog box
    rzp.open(); //point where dialog bax is opened
  }


  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900 to-blue-500 text-white flex flex-col items-center px-6 py-10">
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
    </div>
  );
};

export default Premium;

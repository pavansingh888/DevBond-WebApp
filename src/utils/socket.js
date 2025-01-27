import io from "socket.io-client";
import { BASE_URL } from "./constants";

//this function will create a connection and returns us the socket object where we can send events, emit events, join a chat , we can send messages
export const createSocketConnection = () => {
    //this io fn is called using a URL, we give it a URL where we need to connect ie backend URL
    //this config will work on our local system but on our production, it will need some configuration for production.
  if(location.hostname === "localhost"){
        return io(BASE_URL);
  } else{
    return io("/", {
      path:"/api/socket.io",
    })
    // return io("/api", {
    //   path:"/api/socket.io",
    // })  this is wrong
  }

} 
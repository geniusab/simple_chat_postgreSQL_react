import { useEffect } from "react";

import socketIOClient from "socket.io-client";
import {
  setFriendsOnline,
  setFriendOffline,
  setFriendOnline,
  setSocket,
  receivedMessage,
  senderTyping,
} from "./../../../features/chat/chatSlice";

export const socket = (() => {
  return socketIOClient.connect("http://localhost:3001");
})();

function useSocket(user, dispatch) {
  useEffect(() => {
    // const socket = socketIOClient.connect("http://localhost:3001"); //socketConnect();
    // dispatch(setSocket(socket));
    socket.emit("join", user);

    socket.on("typing", (sender) => {
      console.log("Event: ", sender);
      dispatch(senderTyping(sender));
    });

    socket.on("friends", (friends) => {
      // console.log("friends: ", friends);
      dispatch(setFriendsOnline(friends));
    });

    socket.on("online", (user) => {
      console.log("online: ", user);
      dispatch(setFriendOnline(user));
      // dispatch(setSocket(user));
    });

    socket.on("offline", (user) => {
      console.log("offline: ", user);
      dispatch(setFriendOffline(user));
    });

    socket.on("received", (message) => {
      console.log("received2: ", message);
      dispatch(receivedMessage({ message, userId: user.id }));
    });
  }, [dispatch]);
}

export default useSocket;

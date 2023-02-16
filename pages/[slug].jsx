import Message from "@/components/message";
import { auth, db } from "@/utils/firebase";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiSend } from "react-icons/fi";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

export default function Details() {
  const router = useRouter();
  const routeData = router.query;
  //Comment input
  const [message, setMessage] = useState("");
  //All messages
  const [allMessages, setAllMessages] = useState([]);

  //Submitting a comment/message
  const submitMessage = async () => {
    //Check if the user is logged in (firebase)
    if (!auth.currentUser) return router.push("/auth/login");
    if (!message) {
      toast.error("Message empty, please leave a message 😁", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return;
    }
    //Referencing the post(massage) that the user is on
    const docRef = doc(db, "posts", routeData.id);
    await updateDoc(docRef, {
      //Firebase arrayUnion will create a comments array
      comments: arrayUnion({
        message,
        avatar: auth.currentUser.photoURL,
        userName: auth.currentUser.displayName,
        time: Timestamp.now(),
      }),
    });
    //Form reset
    setMessage("");
  };

  //Getting comments
  const getComments = async () => {
    const docRef = doc(db, "posts", routeData.id);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      setAllMessages(snapshot.data().comments);
    });
    return unsubscribe;
  };

  useEffect(() => {
    if (!router.isReady) return;
    getComments();
  }, [router.isReady]);

  return (
    <div>
      <Message {...routeData}></Message>
      <div className="my-4">
        <div className="flex">
          <input
            onChange={(e) => setMessage(e.target.value)}
            type="text"
            value={message}
            placeholder="What do you think?"
            className="bg-gray-800 w-full p-2 text-white text-sm rounded-l-lg"
          />
          <button
            onClick={submitMessage}
            className="text-xl text-white bg-cyan-500 rounded-r-lg pr-2 pl-1 "
          >
            <FiSend />
          </button>
        </div>
        <div className="py-6">
          <h2 className="font-bold">Comments</h2>
          {/* Check if allMessages is null */}
          {allMessages &&
            allMessages.map((message) => (
              <div
                className="bg-white p-4 my-4 border-2 rounded-lg"
                key={message.time}
              >
                <div className="flex items-center gap-2 mb-4">
                  {!message.avatar ? (
                    <button className="w-12 aspect-square text-white text-lg font-medium rounded-full bg-cyan-500">
                      D
                    </button>
                  ) : (
                    <img
                      className="w-10 rounded-full"
                      src={message.avatar}
                      alt="users avatar"
                    />
                  )}
                  {/* Checks if the user is a Demo or Registered */}
                  <h2>{!message.userName ? "Demo" : message.userName}</h2>
                </div>
                <h2>{message.message}</h2>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

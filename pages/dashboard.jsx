import { auth, db } from "@/utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import Message from "@/components/message";
import { BsTrash2Fill } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
import Link from "next/link";

export default function Dashboard() {
  const logOut = () => auth.signOut();
  const route = useRouter();
  const [user, loading] = useAuthState(auth);
  const [post, setPost] = useState([]);
  // Checking if user is looged in
  const getData = async () => {
    if (loading) return;
    //No User logged in redirect to login page
    if (!user) return route.push("/auth/login");
    //Showing logged in users post in dashboard
    const collectionRef = collection(db, "posts");
    const postQuery = query(collectionRef, where("user", "==", user.uid));
    //Taking the realtime data of the users post
    const unsubcribe = onSnapshot(postQuery, (snapshot) => {
      setPost(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return unsubcribe;
  };
  //Deleteing post
  const deletePost = async (id) => {
    //Getting the post to delete
    const docRef = doc(db, "posts", id);
    await deleteDoc(docRef);
  };

  //Run getData everytime user/loading changes
  useEffect(() => {
    getData();
  }, [user, loading]);

  return (
    <div>
      <h1>Your post</h1>
      <div>
        {post.map((post) => {
          return (
            <Message {...post} key={post.id}>
              <div className="flex gap-4">
                <button className="text-amber-600 flex items-center justify-center gap-2 py-2 text-sm">
                  <BsTrash2Fill
                    onClick={() => deletePost(post.id)}
                    className="text-2xl"
                  />
                  Delete
                </button>
                {/* Editing the post with Link/pathname(so we can pass data)*/}
                <Link href={{ pathname: "/post", query: post }}>
                  <button className="text-violet-700 flex items-center justify-center gap-2 py-2 text-sm">
                    <AiFillEdit className="text-2xl" />
                    Edit
                  </button>
                </Link>
              </div>
            </Message>
          );
        })}
      </div>
      <button
        className="font-medium text-white bg-gray-800 py-2 px-4 rounded-xl my-6"
        onClick={logOut}
      >
        Sign out
      </button>
    </div>
  );
}

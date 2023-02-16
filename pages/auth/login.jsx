import { FcGoogle } from "react-icons/fc";
import { BsDisplayFill } from "react-icons/bs";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInAnonymously,
} from "firebase/auth";
import { auth } from "@/utils/firebase";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";
import { toast } from "react-toastify";

export default function Login() {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);
  //Google Sign in
  const goggleProvider = new GoogleAuthProvider();
  const GoogleLogin = async () => {
    try {
      const res = await signInWithPopup(auth, goggleProvider);
      route.push("/");
    } catch (error) {
      if (error.code === "auth/popup-closed-by-user") {
        console.log("Popup closed by user");
      } else {
        console.log(error);
      }
    }
  };

  // Demo Sign in
  const AnonymousLogin = async () => {
    try {
      await signInAnonymously(auth);
      route.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      route.push("/");
      toast.success("Logged in", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
    } else {
      route.push("/auth/login");
    }
  }, [user]);

  return (
    <div className="shadow-xl mt-32 p-10 text-gray-700 rounded-lg">
      <h2 className="text-2xl font-medium">Login</h2>
      <div className="py-4">
        <h3 className="py-4">Sign in with one of the providers</h3>
        <button
          onClick={GoogleLogin}
          className="text-white bg-gray-700 w-full font-meduim rounded-lg flex align-middle p-4 gap-2"
        >
          <FcGoogle className="text-2xl " /> Sign in with Google
        </button>
      </div>
      <div className="py-4">
        <h4 className="py-4">Demo</h4>
        <button
          onClick={AnonymousLogin}
          className="text-white bg-gray-700 w-full font-meduim rounded-lg flex align-middle p-4 gap-2"
        >
          <BsDisplayFill className="text-2xl " /> Demo User
        </button>
      </div>
    </div>
  );
}

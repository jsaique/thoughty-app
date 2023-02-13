import { auth } from "@/utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const logOut = () => auth.signOut();
  const route = useRouter();
  const [user, loading] = useAuthState(auth);
  // Checking if user is looged in
  const getData = async () => {
    if (loading) return;
    //No User logged in redirect to login page
    if (!user) return route.push("/auth/login");
  };
  //Get users data
  useEffect(() => {
    getData();
  }, [user, loading]);

  return (
    <div>
      <h1>Your post</h1>
      <div>Post</div>
      <button onClick={logOut}>Sign out</button>
    </div>
  );
}

import Link from "next/link";
import { auth } from "@/utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { BsDisplayFill } from "react-icons/bs";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";

export default function Nav() {
  const [user, loading] = useAuthState(auth);
  return (
    <div>
      <nav className="flex justify-between items-center py-10">
        <Tippy animation={"scale"} content={"My Feed"}>
          <Link href="/">
            <button className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-violet-600">
              Thoughty
            </button>
          </Link>
        </Tippy>
        <ul className="flex items-center gap-10">
          {!user && (
            <Link href={"/auth/login"}>
              <button className="py-2 px-4 text-sm bg-violet-700 text-white rounded-lg font-medium ml-8">
                Login
              </button>
            </Link>
          )}
          {user && (
            <div className="flex items-center gap-6">
              <Tippy animation={"scale"} content={"Post your thoughts"}>
                <Link href="/post">
                  <button className="font-medium bg-violet-700 text-white py-2 px-4 rounded-md text-base">
                    Post
                  </button>
                </Link>
              </Tippy>
              <Tippy animation={"scale"} content={"My post"}>
                <Link href="/dashboard">
                  {!user.photoURL ? (
                    <button className="w-12 aspect-square text-white text-lg font-medium rounded-full bg-violet-700">
                      D
                    </button>
                  ) : (
                    <img
                      className="w-10 rounded-full cursor-pointer"
                      src={user.photoURL}
                      alt={user.displayName}
                    />
                  )}
                </Link>
              </Tippy>
            </div>
          )}
        </ul>
      </nav>
    </div>
  );
}

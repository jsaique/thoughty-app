import { Children } from "react";
import { BsDisplayFill } from "react-icons/bs";

export default function Message({ children, avatar, username, description }) {
  return (
    <div className="bg-white p-8 border-b-2 rounded-lg">
      <div className="flex items-center gap-2">
        {!avatar ? (
          <BsDisplayFill />
        ) : (
          <img src={avatar} alt={username} className="w-10 rounded-full" />
        )}
        <h2>{!username ? "Demo" : username}</h2>
      </div>
      <div className="py-4">
        <p>{description}</p>
      </div>
      {children}
    </div>
  );
}

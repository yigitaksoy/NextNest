import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);
  return (
    <div className="navbar fixed bg-black p-5">
      <div className="flex-1">
        <p className="text-md btn-ghost btn normal-case text-white">NextNest</p>
      </div>
      <div className="flex-none text-white">
        Logout
        <button
          className="btn-ghost btn-square btn"
          onClick={() => signOut(auth)}
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5 text-white" />
        </button>
      </div>
    </div>
  );
};

export default Navbar;

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
        <p className="btn-ghost btn text-lg font-bold normal-case text-sky-400">
          NextNest
        </p>
      </div>
      <div className="mx-auto text-lg text-gray-300">
        <button
          className="btn-ghost btn-square btn mx-auto flex"
          onClick={() => signOut(auth)}
        >
          <div className="mr-10 flex items-center">
            <p className="mr-2">Logout</p>
            <ArrowRightOnRectangleIcon className="h-5 w-5 text-gray-300" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default Navbar;

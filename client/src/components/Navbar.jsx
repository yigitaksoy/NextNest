import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import NextNest from "../assets/images/nextnest-white.png";

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);
  return (
    <div className="navbar fixed z-50 bg-black p-5">
      <div className="flex-1">
        <img src={NextNest} alt="nextnest-logo" className="w-22 h-10" />
      </div>
      <div className="mx-auto text-lg text-white">
        <button
          className="btn-ghost btn-square btn mx-auto flex"
          onClick={() => signOut(auth)}
        >
          <div className="mr-10 flex items-center">
            <p className="mr-2 font-nove text-white hover:text-sky-300">
              Logout
            </p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Navbar;

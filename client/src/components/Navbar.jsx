import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import NextNest from "../assets/images/nextnest-white.png";
import Avatar from "../assets/images/avatar.png";

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);
  return (
    <div className="navbar sticky top-0 z-50 bg-black p-5">
      <div className="flex-1">
        <Link to="/">
          <img src={NextNest} alt="nextnest-logo" className="w-22 h-10" />
        </Link>
      </div>
      <div className="dropdown dropdown-end cursor-pointer font-degular">
        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
          <div className="w-10 rounded-full">
            {currentUser && currentUser.photoURL ? (
              <img src={currentUser.photoURL} alt="User" />
            ) : (
              <img src={Avatar} className="" alt="Avatar" />
            )}
          </div>
        </label>
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-black text-white rounded-box w-52"
        >
          <li>
            <button
              className="justify-between hover:bg-zinc-800"
              onClick={() => signOut(auth)}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;

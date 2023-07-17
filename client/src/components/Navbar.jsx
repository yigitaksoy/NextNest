import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import NextNest from "../assets/images/nextnest-white.png";
import Avatar from "../assets/images/avatar.png";

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    if (!isDropdownOpen) {
      checkSubscriptionStatus();
    }
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSubscriptionToggle = async (event) => {
    const newStatus = event.target.checked;
    try {
      const idToken = await currentUser.getIdToken();
      const url =
        import.meta.env.MODE === "production"
          ? import.meta.env.VITE_NEXTNEST_API_SUBSCRIPTION
          : "http://localhost:3000/user/subscription";

      const response = await axios.post(
        url,
        {
          action: "toggle",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
        },
      );

      if (response.status === 200) {
        setSubscriptionStatus(response.data.subscription);
        // Show toast
        const toastMessage = response.data.subscription
          ? "Successfully subscribed!"
          : "Successfully unsubscribed!";
        toast.success(toastMessage);
      } else {
        toast.error("Error updating subscription!");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error updating subscription!");
    }
  };

  const checkSubscriptionStatus = async () => {
    try {
      const idToken = await currentUser.getIdToken();
      const url =
        import.meta.env.MODE === "production"
          ? import.meta.env.VITE_NEXTNEST_API_SUBSCRIPTION
          : "http://localhost:3000/user/subscription";

      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (response.status === 200) {
        // Set the state for subscription
        setSubscriptionStatus(response.data.subscription);
      } else {
        console.error("Failed to fetch subscription data");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      checkSubscriptionStatus();
    }
  }, [currentUser]);
  return (
    <div className="navbar sticky top-0 z-50 bg-black p-5">
      <Toaster
        toastOptions={{
          success: {
            style: {
              background: "#57ef97",
            },
            iconTheme: {
              primary: "green",
              secondary: "white",
            },
          },
          error: {
            style: {
              background: "red",
              color: "white",
            },
          },
        }}
      />
      <div className="flex-1">
        <Link to="/">
          <img src={NextNest} alt="nextnest-logo" className="w-22 h-10" />
        </Link>
      </div>
      <div className="dropdown dropdown-end cursor-pointer font-degular hover:ring-sky-300">
        <label
          tabIndex={0}
          className="btn btn-ghost btn-circle avatar focus-within:bg-sky-300 hover:ring-sky-300 hover:ring-4 hover:ring-inset focus-within:ring-1 focus:bg-sky-300 focus-within:ring-inset focus-within:ring-sky-300"
          onClick={toggleDropdown}
        >
          <div className="w-10 rounded-full">
            {currentUser && currentUser.photoURL ? (
              <img src={currentUser.photoURL} alt="User" />
            ) : (
              <img src={Avatar} className="" alt="Avatar" />
            )}
          </div>
        </label>
        {isDropdownOpen && (
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-black text-white rounded-box w-52"
          >
            <li>
              <div className="flex">
                <div className=" text-white font-medium mr-2">Subscription</div>
                <label
                  htmlFor="subscription"
                  className="flex items-center cursor-pointer"
                >
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="subscription"
                      className="sr-only"
                      checked={subscriptionStatus}
                      onChange={handleSubscriptionToggle}
                      disabled={isLoading}
                    />
                    <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                    <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
                  </div>
                </label>
              </div>
            </li>
            <li>
              <button
                className="justify-between hover:bg-zinc-800"
                onClick={() => {
                  signOut(auth).then(() => {
                    navigate("/login", { replace: true });
                  });
                }}
              >
                Logout
              </button>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default Navbar;

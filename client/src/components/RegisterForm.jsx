import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "../utils/firebase";
import axios from "axios";
import { doc, setDoc, getDoc } from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const RegisterForm = ({
  handleSubmit,
  handleChange,
  setConfirmPassword,
  passwordsMatch,
}) => {
  const navigate = useNavigate();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const togglePasswordVisibility = () =>
    setIsPasswordVisible((prevState) => !prevState);

  const googleSignUp = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const user = result.user;
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (!userDocSnapshot.exists()) {
          // User document does not exist, create it
          await setDoc(userDocRef, {
            uid: user.uid,
            email: user.email,
          });

          // Make a POST request to the server-side /register route
          const response = await axios.post(
            import.meta.env.MODE === "production"
              ? import.meta.env.VITE_NEXTNEST_API_REGISTER
              : "http://localhost:3000/user/register",
            {
              uid: user.uid,
              email: user.email,
            },
          );

          navigate("/search");
        } else {
          // User document already exists, no need to create it again
          navigate("/search");
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };
  return (
    <div
      id="register-form"
      className="w-full rounded-lg bg-white sm:max-w-md md:mt-0 shadow-searchBar xl:p-0"
    >
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
      <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
        <h1 className="text-center font-marker text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
          Create an account
        </h1>
        <form
          method="POST"
          className="space-y-2 md:space-y-4"
          onSubmit={handleSubmit}
        >
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-black text-gray-900"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="input-shadow input block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-custom-black focus:border-sky-300 focus:outline-none focus:ring-0 sm:text-sm"
              placeholder="name@email.com"
              required
            />
          </div>
          <div className="relative">
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-black text-gray-900 "
            >
              Password
            </label>
            <input
              type={isPasswordVisible ? "text" : "password"}
              name="password"
              id="password"
              placeholder="••••••••"
              className={`input-shadow input block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-custom-black focus:border-sky-300 focus:outline-none focus:ring-0 sm:text-sm ${
                !passwordsMatch ? " focus:text-red-500" : ""
              }`}
              pattern=".{8,}"
              title="8 characters minimum"
              required
              onChange={handleChange}
            />
            <div className="absolute inset-y-0 right-0 mt-3 mr-5 text-gray-600 flex items-center">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  togglePasswordVisibility();
                }}
              >
                {isPasswordVisible ? (
                  <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>
            <p className="text-xs text-neutral-700">
              Passwords must be min. 8 characters
            </p>
          </div>
          <div className="relative">
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-black text-gray-900 "
            >
              Confirm Password
            </label>
            <input
              type={isPasswordVisible ? "text" : "password"}
              name="confirmPassword"
              id="confirmPassword"
              placeholder="••••••••"
              className={`input-shadow input block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-custom-black focus:border-sky-300 focus:outline-none focus:ring-0 sm:text-sm ${
                !passwordsMatch ? "focus:text-red-500" : ""
              }`}
              required
              pattern=".{8,}"
              title="8 characters minimum"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {!passwordsMatch ? (
              <p className="text-xs text-red-500">Passwords do not match!</p>
            ) : (
              ""
            )}
          </div>

          <button
            type="submit"
            className="form-button w-full rounded-lg bg-custom-yellow px-5 py-2.5 text-center font-marker text-sm font-medium text-white focus:outline-none focus:ring-4"
          >
            Sign up
          </button>
          <p className="text-sm font-light text-gray-500 ">
            Already have an account?
            <Link to="/login" className="font-black text-black hover:underline">
              Log in
            </Link>
          </p>
          <div className="my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300">
            <p className="mx-4 mb-0 text-center font-semibold ">or</p>
          </div>
          <div className="flex flex-col space-y-4">
            <button
              onClick={googleSignUp}
              className="form-button group flex items-center justify-center space-x-2 rounded-md border px-4 py-2 font-marker"
            >
              <svg
                className="h-5 w-5 fill-current text-gray-800 group-hover:text-white"
                viewBox="0 0 533.5 544.3"
              >
                <path
                  d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z"
                  fill="#4285f4"
                />
                <path
                  d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z"
                  fill="#34a853"
                />
                <path
                  d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z"
                  fill="#fbbc04"
                />
                <path
                  d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z"
                  fill="#ea4335"
                />
              </svg>
              <span className="font-degular text-sm font-medium text-gray-800 group-hover:text-white">
                Sign up with Google
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;

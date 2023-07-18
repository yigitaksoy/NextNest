import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utils/firebase";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import RegisterForm from "../components/RegisterForm";
import NextNest from "../assets/images/nextnest-white-shadow.png";

const Register = () => {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [confirmEmail, setConfirmEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setConfirmEmail(value);
    } else if (name === "password") {
      setUserPassword(value);
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userPassword === confirmPassword) {
      try {
        const { value: email } = e.target[0];
        const { value: password } = e.target[1];

        // Create user in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );

        // Make a POST request to the server-side /register route
        const response = await axios.post(
          import.meta.env.MODE === "production"
            ? import.meta.env.VITE_NEXTNEST_API_REGISTER
            : "http://localhost:3000/user/register",
          {
            uid: userCredential.user.uid,
            email,
          },
        );
        navigate("/search");
      } catch (error) {
        if (error.code === "auth/email-already-in-use") {
          toast.error("This email address is already in use.");
        } else if (error.code === "auth/invalid-email") {
          toast.error("Invalid email address");
        } else {
          toast.error(error.message);
        }
      }
    } else {
      setPasswordsMatch(false);
    }
  };

  useEffect(() => {
    setPasswordsMatch(userPassword === confirmPassword);
  }, [userPassword, confirmPassword]);

  return (
    <section className="h-screen bg-sky-300 font-degular lg:h-screen">
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
      <div className="mx-auto flex flex-col items-center justify-center px-6 py-8  md:h-screen lg:py-0">
        <Link to="/" className="mb-6">
          <img src={NextNest} alt="nextnest-logo" className="w-22 h-10" />
        </Link>
        <RegisterForm
          handleSubmit={handleSubmit}
          setConfirmPassword={setConfirmPassword}
          passwordsMatch={passwordsMatch}
          handleChange={handleChange}
        />
      </div>
    </section>
  );
};

export default Register;

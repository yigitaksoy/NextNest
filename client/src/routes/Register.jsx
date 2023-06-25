import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utils/firebase";
import axios from "axios";
import RegisterForm from "../components/RegisterForm";
import NextNest from "../assets/images/nextnest-black.png";

const Register = () => {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [confirmEmail, setConfirmEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [err, setErr] = useState(false);

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
          password
        );

        // Make a POST request to the server-side /register route
        const response = await axios.post(
          import.meta.env.MODE === "production"
            ? import.meta.env.VITE_NEXTNEST_API_REGISTER
            : "http://localhost:3000/user/register",
          {
            uid: userCredential.user.uid,
            email,
          }
        );

        navigate("/home");
      } catch (error) {
        console.log(error);
        if (error.code === "auth/email-already-in-use") {
          setErr("This email address is already in use.");
        } else {
          setErr(error.message);
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
    <section className="h-screen bg-sky-300 font-degular lg:h-full">
      <div className="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-auto md:py-3.5">
        <Link to="/" className="mb-6">
          <img src={NextNest} alt="nextnest-logo" className="w-22 h-10" />
        </Link>
        <RegisterForm
          handleSubmit={handleSubmit}
          setConfirmPassword={setConfirmPassword}
          passwordsMatch={passwordsMatch}
          handleChange={handleChange}
          err={err}
        />
        <div className="mt-5 text-center font-black text-black transition duration-100 hover:text-white">
          <Link to="/">Go back to the homepage</Link>
        </div>
      </div>
    </section>
  );
};

export default Register;

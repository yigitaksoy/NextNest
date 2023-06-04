import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../utils/firebase";
import { doc, setDoc, collection } from "firebase/firestore";
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

        const res = await createUserWithEmailAndPassword(auth, email, password);

        // Create user document in the "users" collection
        await setDoc(doc(db, "users", res.user.uid), {
          uid: res.user.uid,
          email,
        });

        // Create userSearch document in the "users" collection
        await setDoc(
          doc(db, "users", res.user.uid, "userSearch", res.user.uid),
          {}
        );

        // Automatically create the "userListings" collection for the new user
        const userListingRef = collection(
          db,
          "users",
          res.user.uid,
          "userListings"
        );
        await setDoc(doc(userListingRef, res.user.uid), {
          userRef: doc(db, "users", res.user.uid).path,
        });

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
    <section className="h-screen bg-sky-400 font-degular lg:h-full">
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

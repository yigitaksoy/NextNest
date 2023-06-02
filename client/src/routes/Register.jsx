import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../utils/firebase";
import { doc, setDoc, collection } from "firebase/firestore";
import RegisterForm from "../components/RegisterForm";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

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

        // Automatically create the "userListing" collection for the new user
        const userListingRef = collection(
          db,
          "users",
          res.user.uid,
          "userListing"
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
    <section className="font-fontInforma h-auto bg-sky-400">
      <div className="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-auto md:py-3.5">
        <Link
          to="/"
          className="font-fontNove mb-6 flex items-center text-2xl font-semibold text-gray-900"
        >
          <h3 className="font-fontNove flex items-center justify-center">
            <span className="mr-2">Next Nest</span>
            <ChatBubbleLeftRightIcon className="h-6 w-6 text-center" />
          </h3>
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

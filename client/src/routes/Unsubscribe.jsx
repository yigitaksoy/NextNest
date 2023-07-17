import { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import NextNest from "../assets/images/nextnest-white-shadow.png";

const Unsubscribe = () => {
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const updateSubscription = async () => {
      try {
        const idToken = await currentUser.getIdToken();
        const url =
          import.meta.env.MODE === "production"
            ? import.meta.env.VITE_NEXTNEST_API_SUBSCRIPTION
            : "http://localhost:3000/user/subscription";

        const response = await axios.post(
          url,
          {
            action: "unsubscribe",
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
          },
        );

        if (response.status === 200) {
          console.log("Successfully unsubscribed");
        } else {
          console.error("Failed to unsubscribe");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    if (currentUser) {
      updateSubscription();
    }
  }, [currentUser]);

  return (
    <section className="h-screen bg-gray-100 font-degular md:pt-10">
      <div className="mx-auto flex flex-col items-center justify-center px-6 py-8  lg:py-0">
        <div className="items-center mb-20">
          <Link to="/" className="mb-6">
            <img src={NextNest} alt="nextnest-logo" className="w-22 h-12" />
          </Link>
        </div>
        <div
          id="form-success"
          className="w-full rounded-lg shadow-searchBar sm:max-w-md md:mt-0 xl:p-0 bg-white"
        >
          <div className="rounded-tl-3xl rounded-tr-3xl bg-sky-100 border-2 border-b-black">
            <h1 className="p-4 text-center font-marker text-xl font-black text-black md:text-2xl ">
              Unsubscribed 👋
            </h1>
          </div>
          <div className="p-2 sm:p-8 md:p-5 md:space-y-6">
            <div className="space-y-4 text-black md:space-y-6">
              <div>
                <p className="text-center py-5">
                  You have successfully <span className="">unsubscribed </span>
                  from receiving new listings!
                </p>
                <p className="text-center py-2">
                  <span className="font-heavy">Accidental click? </span> Not a
                  problem! You can always re-subscribe again by making a new{" "}
                  <Link
                    to="/search"
                    className="underline font-heavy cursor-pointer"
                  >
                    search
                  </Link>
                  .
                </p>
                <div className="pt-10">
                  <p className="text-center pb-2">
                    Thank you for using{" "}
                    <span className="font-nove text-sm">NextNest</span>
                    <span className="text-sm"> ♥️</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Unsubscribe;

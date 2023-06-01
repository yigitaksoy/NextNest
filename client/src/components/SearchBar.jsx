import { useState, useEffect } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db, auth } from "../utils/firebase";
import axios from "axios";
import { MapIcon } from "@heroicons/react/24/outline";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";

const SearchBar = () => {
  const [formData, setFormData] = useState({
    listingType: "",
    location: "",
    minPrice: "",
    maxPrice: "",
    minSize: "",
    minBedrooms: "",
    email: "",
  });

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    console.log("Form Data:", formData);
  }, [formData]);

  useEffect(() => {
    const fetchSearchCriteria = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const searchCriteriaRef = doc(db, "userSearch", user.uid);
          const snapshot = await getDoc(searchCriteriaRef);
          if (snapshot.exists()) {
            const data = snapshot.data();
            setFormData((prevData) => ({ ...prevData, ...data }));
          }
        }
      } catch (error) {
        console.error("Error fetching search criteria:", error);
      }
    };

    fetchSearchCriteria();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Save search criteria to Firestore
      const user = auth.currentUser;
      const searchCriteriaRef = doc(db, "userSearch", user.uid);
      await setDoc(searchCriteriaRef, formData);

      console.log("Request Payload:", {
        ...formData,
        toEmail: formData.email,
      });

      const response = await axios.get(
        import.meta.env.MODE === "production"
          ? import.meta.env.VITE_NEXTNEST_API
          : "http://localhost:3000/api/scrape-listings",
        {
          params: {
            ...formData,
            toEmail: formData.email,
          },
        }
      );

      console.log(response);
      console.log("Email sent:", response.data);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  return (
    <div className="">
      <div className="container mx-auto flex h-screen items-center justify-center p-2 md:p-0">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 rounded-3xl border-4 border-sky-400 bg-gray-100 p-6 shadow-lg">
            <div className="flex flex-shrink-0">
              <button className="bg-transparent p-2" type="button">
                <input
                  className="hidden"
                  type="radio"
                  id="forRent"
                  value="huur"
                  name="listingType"
                  onChange={handleChange}
                  checked={formData.listingType === "huur"}
                  required
                />
                <label
                  className="btn border-2 bg-transparent px-5 py-2.5 text-black"
                  htmlFor="forRent"
                >
                  For Rent
                </label>
              </button>
              <button className="p-2" type="button">
                <input
                  className="hidden"
                  type="radio"
                  id="forSale"
                  value="koop"
                  name="listingType"
                  onChange={handleChange}
                  checked={formData.listingType === "koop"}
                  required
                />
                <label
                  className="btn border-2 bg-transparent px-5 py-2.5 text-black"
                  htmlFor="forSale"
                >
                  For Sale
                </label>
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="p-2">
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <MapIcon className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    className="input block w-full rounded-lg border p-2.5 pl-10 text-sm"
                    placeholder="City, neighborhood, address, etc."
                    value={formData.location}
                    name="location"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 p-2">
                <div className="relative flex items-center">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <p>From</p>
                  </div>
                  <input
                    type="number"
                    id="minPrice"
                    className="input block w-full rounded-lg border p-2.5 pl-16 text-sm"
                    placeholder="Price From"
                    value={formData.minPrice}
                    name="minPrice"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="relative flex items-center">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <p>To</p>
                  </div>
                  <input
                    type="number"
                    id="maxPrice"
                    className="input block w-full rounded-lg border p-2.5 pl-10 text-sm"
                    placeholder="Limit"
                    value={formData.maxPrice}
                    name="maxPrice"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 p-2">
              <div className="flex justify-between">
                <div className="relative flex w-full items-center">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <EnvelopeIcon className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="email"
                    id="maxPrice"
                    className="input block w-full rounded-lg border p-2.5 pl-10 text-sm"
                    placeholder="E-mail"
                    value={formData.email}
                    name="email"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <button className="btn w-full rounded-md border bg-gray-800 p-2 text-white lg:w-1/4">
                Search & Send
                <PaperAirplaneIcon className=" h-5 w-5 text-white" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;

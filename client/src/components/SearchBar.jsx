import { useState, useEffect } from "react";
import { auth } from "../utils/firebase";
import axios from "axios";
import {
  MapIcon,
  PaperAirplaneIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

const SearchBar = () => {
  const [formData, setFormData] = useState({
    listingType: "",
    location: "",
    minPrice: "",
    maxPrice: "",
    minSize: "",
    minBedrooms: "",
    email: "",
    buurt: "",
  });

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    const fetchSearchCriteria = async () => {
      try {
        const user = auth.currentUser;
        const idToken = await user.getIdToken();

        if (user) {
          const response = await axios.get(
            import.meta.env.MODE === "production"
              ? import.meta.env.VITE_NEXTNEST_API_USER
              : "http://localhost:3000/user/search",
            {
              headers: {
                Authorization: `Bearer ${idToken}`,
              },
            }
          );

          const searchCriteria = response.data;
          setFormData((prevData) => ({ ...prevData, ...searchCriteria }));
        }
      } catch (error) {
        console.error("Error fetching search criteria:", error);
      }
    };

    fetchSearchCriteria();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Form Data:", formData);

    try {
      // Save search criteria to MongoDB
      const user = auth.currentUser;
      const idToken = await user.getIdToken(); // Get the user token

      const saveSearchResponse = await axios.post(
        import.meta.env.MODE === "production"
          ? import.meta.env.VITE_NEXTNEST_API_USER
          : "http://localhost:3000/user/search",
        formData,
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      console.log("Search Payload:", saveSearchResponse);
      console.log("Search criteria saved:", saveSearchResponse.data);

      try {
        //Make API call to scrape listings and send email
        const scrapeListingsResponse = await axios.get(
          import.meta.env.MODE === "production"
            ? import.meta.env.VITE_NEXTNEST_API
            : "http://localhost:3000/api/scrape-listings",
          {
            params: formData,
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          }
        );
        console.log("Email sent:", scrapeListingsResponse.data);
      } catch (error) {
        console.error("Error sending listing data:", error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="font-fontDegular">
      <div className="container mx-auto flex h-screen items-center justify-center p-2 md:p-0 lg:w-2/3">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-2 rounded-3xl bg-gray-100 p-6">
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
              <div className="p-2">
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <MapIcon className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    className="input block w-full rounded-lg border p-2.5 pl-10 text-sm"
                    placeholder="Neighborhood"
                    value={formData.buurt}
                    name="buurt"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
              <div className="grid grid-cols-2 gap-2 p-2">
                <div className="relative flex items-center">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"></div>
                  <input
                    type="number"
                    id="minSize"
                    className="input block w-full rounded-lg border p-2.5 pl-16 text-sm"
                    placeholder="Size"
                    value={formData.minSize}
                    name="minSize"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="relative flex items-center">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"></div>
                  <input
                    type="number"
                    id="minBedrooms"
                    className="input block w-full rounded-lg border p-2.5 pl-10 text-sm"
                    placeholder="Bedrooms"
                    value={formData.minBedrooms}
                    name="minBedrooms"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 p-2"></div>
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
                <PaperAirplaneIcon className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;

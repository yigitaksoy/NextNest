import { useState, useEffect } from "react";
import { auth } from "../utils/firebase";
import axios from "axios";
import ListingTypeInput from "./ListingTypeInput";
import LocationInput from "./LocationInput";
import PriceInput from "./PriceInput";
import SizeAndRoomsInput from "./SizeAndRoomsInput";
import EmailInput from "./EmailInput";

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
        <form onSubmit={handleSubmit} className="w-screen" id="searchbar">
          <div className="grid grid-cols-1 rounded-xl  bg-gray-50 p-6  md:gap-2">
            <ListingTypeInput handleChange={handleChange} formData={formData} />
            <LocationInput handleChange={handleChange} formData={formData} />
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
              <PriceInput handleChange={handleChange} formData={formData} />
              <SizeAndRoomsInput
                handleChange={handleChange}
                formData={formData}
              />
            </div>
            <EmailInput handleChange={handleChange} formData={formData} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;

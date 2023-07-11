import { useState, useEffect, useRef } from "react";
import { auth } from "../utils/firebase";
import axios from "axios";
import { motion } from "framer-motion";
import ListingTypeInput from "./ListingTypeInput";
import LocationInput from "./LocationInput";
import PriceInput from "./PriceInput";
import SizeAndRoomsInput from "./SizeAndRoomsInput";
import EmailInput from "./EmailInput";
import FormSuccess from "./FormSuccess";

const SearchBar = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState(null);
  const form = useRef(null);
  const [isAmsterdam, setIsAmsterdam] = useState(false);
  const [formData, setFormData] = useState({
    listingType: "",
    location: "",
    minPrice: "",
    maxPrice: "",
    minSize: "",
    minBedrooms: "",
    email: "",
    neighbourhood: [],
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
            },
          );

          const searchCriteria = response.data;
          let neighbourhood;
          if (Array.isArray(searchCriteria.neighbourhood)) {
            neighbourhood = searchCriteria.neighbourhood;
          } else if (typeof searchCriteria.neighbourhood === "string") {
            neighbourhood = [searchCriteria.neighbourhood];
          } else {
            neighbourhood = [];
          }

          setFormData((prevData) => ({ ...prevData, ...searchCriteria }));

          // After setting form data, check if location is Amsterdam and update `isAmsterdam`
          const isCityAmsterdam = searchCriteria.location === "amsterdam";
          setIsAmsterdam(isCityAmsterdam);
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
        },
      );

      console.log("Search Payload:", saveSearchResponse);
      console.log("Search criteria saved:", saveSearchResponse.data);
      setFormSubmitted(true);

      try {
        let tempFormData = { ...formData };

        // Join the neighbourhood array into a string with commas
        tempFormData.neighbourhood = Array.isArray(tempFormData.neighbourhood)
          ? tempFormData.neighbourhood.map((object) => object.value).join(",")
          : "";

        //Make API call to scrape listings and send email
        const scrapeListingsResponse = await axios.get(
          import.meta.env.MODE === "production"
            ? import.meta.env.VITE_NEXTNEST_API
            : "http://localhost:3000/api/scrape-listings",
          {
            params: tempFormData,
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          },
        );
        console.log("Email sent:", scrapeListingsResponse.data);
      } catch (error) {
        console.error("Error sending listing data:", error);
      }
    } catch (error) {
      setFormError(true);
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (formSubmitted && form.current) {
      setTimeout(() => {
        setFormSubmitted(false);
      }, 3000);
    }
  }, [formSubmitted]);

  return (
    <div className="pb-28 font-degular">
      <div className="container mx-auto flex items-center justify-center p-2 md:mt-40 md:p-0 lg:mt-28 lg:w-2/3">
        {formSubmitted ? (
          <FormSuccess />
        ) : (
          <form
            onSubmit={handleSubmit}
            className="w-screen bg-white md:shadow-searchBar"
            id="searchbar"
          >
            {formError && (
              <motion.p
                transition={{ duration: 0.3, delay: 0.3 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-md text-center font-degular text-[#e63946]"
              >
                Something went wrong! Please try again later.
              </motion.p>
            )}
            <div className="grid grid-cols-1 rounded-xl bg-white md:gap-2 md:p-6">
              <ListingTypeInput
                handleChange={handleChange}
                formData={formData}
              />
              <LocationInput
                handleChange={handleChange}
                formData={formData}
                isAmsterdam={isAmsterdam}
                setIsAmsterdam={setIsAmsterdam}
              />
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
        )}
      </div>
    </div>
  );
};

export default SearchBar;

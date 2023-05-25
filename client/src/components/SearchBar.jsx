import { useState } from "react";
import axios from "axios";

const SearchBar = () => {
  const [formData, setFormData] = useState({
    listingType: "",
    location: "",
    minPrice: "",
    maxPrice: "",
    minSize: "",
    minBedrooms: "",
    maxAge: "",
    email: "",
  });

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));

    console.log("Form Data:", formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Request Payload:", {
      ...formData,
      toEmail: formData.email,
    });

    try {
      const response = await axios.get(
        "http://localhost:3000/api/scrape-listings",
        {
          params: {
            ...formData,
            toEmail: formData.email,
          },
        }
      );

      console.log("Request Payload:", {
        ...formData,
        toEmail: formData.email,
      });
      console.log(response);
      console.log("Email sent:", response.data);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  return (
    <div className="h-screen w-screen items-center justify-center">
      <form className="flex flex-row items-center" onSubmit={handleSubmit}>
        {/* Listing Type */}
        <div>
          <select
            name="listingType"
            className="select-info select w-full max-w-xs"
            value={formData.listingType}
            onChange={handleChange}
            required
          >
            <option disabled value="">
              Listing Type
            </option>
            <option value="huur">huur</option>
            <option value="koop">koop</option>
          </select>
          {/* Location */}
          <input
            type="text"
            name="location"
            placeholder="City, neighborhood, address, etc. "
            className="input-bordered input w-full max-w-xs"
            value={formData.location}
            onChange={handleChange}
            required
          ></input>
          {/* Min Price */}
          <input
            type="text"
            name="minPrice"
            placeholder="Min Price"
            className="input-bordered input w-full max-w-xs"
            value={formData.minPrice}
            onChange={handleChange}
            required
          />
          {/* Max Price */}
          <input
            type="text"
            name="maxPrice"
            placeholder="Max Price"
            className="input-bordered input w-full max-w-xs"
            value={formData.maxPrice}
            onChange={handleChange}
            required
          />
          {/* Min Size */}
          <input
            type="text"
            name="minSize"
            placeholder="Min Size"
            className="input-bordered input w-full max-w-xs"
            value={formData.minSize}
            onChange={handleChange}
            required
          />
          {/* Min Bedrooms */}
          <input
            type="number"
            name="minBedrooms"
            placeholder="Min Bedrooms"
            className="input-bordered input-info input w-full max-w-xs"
            value={formData.minBedrooms}
            onChange={handleChange}
            required
          />
          {/* Max Age */}
          <input
            type="text"
            name="maxAge"
            placeholder="Max Age"
            className="input-bordered input w-full max-w-xs"
            value={formData.maxAge}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input-bordered input w-full max-w-xs"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn">
          Send
        </button>
      </form>
    </div>
  );
};

export default SearchBar;

const ListingTypeInput = ({ handleChange, formData }) => {
  return (
    <div className="flex flex-shrink-0 font-marker">
      <div className="relative bg-transparent p-2" id="listing-button">
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
          className="btn cursor-pointer border-none bg-transparent px-5 py-2.5 text-black"
          htmlFor="forRent"
        >
          For Rent
        </label>
      </div>

      <button className="bg-transparent p-2" type="button" id="listing-button">
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
  );
};

export default ListingTypeInput;

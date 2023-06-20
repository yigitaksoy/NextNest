import Select from "react-select";
import priceRental from "../data/priceRental.json";
import priceSale from "../data/priceSale.json";

const PriceInput = ({ handleChange, formData }) => {
  const { listingType, minPrice, maxPrice } = formData;

  const options = listingType
    ? listingType === "huur"
      ? priceRental
      : priceSale
    : [];

  const selectedMinPrice = options.find((option) => option.value === minPrice);
  const selectedMaxPrice = options.find((option) => option.value === maxPrice);

  const handleMinPriceChange = (selectedOption) => {
    const event = {
      target: {
        name: "minPrice",
        value: selectedOption ? selectedOption.value : "",
      },
    };
    handleChange(event);
  };

  const handleMaxPriceChange = (selectedOption) => {
    const event = {
      target: {
        name: "maxPrice",
        value: selectedOption ? selectedOption.value : "",
      },
    };
    handleChange(event);
  };

  const maxPriceOptions =
    minPrice && listingType
      ? options.filter((option) => Number(option.value) >= Number(minPrice))
      : options;

  const minPriceOptions =
    maxPrice && listingType
      ? options.filter((option) => Number(option.value) <= Number(maxPrice))
      : options;

  return (
    <div className="grid grid-cols-1 gap-4 p-2 md:grid-cols-2 md:gap-2">
      <div className="relative flex items-center">
        <Select
          id="minPrice"
          options={listingType ? minPriceOptions : []}
          value={selectedMinPrice}
          isClearable
          isSearchable={false}
          placeholder="Min Price"
          noOptionsMessage={() => "Please select listing type"}
          classNames={{
            control: () => "p-1.5 text-sm rounded-xl",
          }}
          className="search-input w-full"
          styles={{
            input: (base) => ({
              ...base,
              "input:focus": {
                boxShadow: "none",
              },
            }),
            control: (base, state) => ({
              ...base,
              border: state.isFocused ? 0 : 0,
              boxShadow: state.isFocused ? 0 : 0,
              "&:hover": {
                border: state.isFocused ? 0 : 0,
              },
            }),
          }}
          theme={(theme) => ({
            ...theme,
            borderRadius: "1",
            colors: {
              ...theme.colors,
              primary25: "#7dd3fc",
              primary: "black",
            },
          })}
          onChange={handleMinPriceChange}
          required
        />
      </div>
      <div className="relative flex items-center">
        <Select
          id="maxPrice"
          options={listingType ? maxPriceOptions : []}
          value={selectedMaxPrice}
          isClearable
          isSearchable={false}
          placeholder="Max Price"
          className="search-input w-full"
          noOptionsMessage={() => "Please select listing type"}
          classNames={{
            control: () => "p-1.5 text-sm rounded-xl",
          }}
          styles={{
            input: (base) => ({
              ...base,
              "input:focus": {
                boxShadow: "none",
              },
            }),
            control: (base, state) => ({
              ...base,
              border: state.isFocused ? 0 : 0,
              boxShadow: state.isFocused ? 0 : 0,
              "&:hover": {
                border: state.isFocused ? 0 : 0,
              },
            }),
          }}
          theme={(theme) => ({
            ...theme,
            borderRadius: "1",
            colors: {
              ...theme.colors,
              primary25: "#7dd3fc",
              primary: "black",
            },
          })}
          onChange={handleMaxPriceChange}
          required
        />
      </div>
    </div>
  );
};

export default PriceInput;

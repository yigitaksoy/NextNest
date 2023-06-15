import Select from "react-select";
import priceRental from "../data/priceRental.json";
import priceSale from "../data/priceSale.json";

const PriceInput = ({ handleChange, formData }) => {
  const { listingType, minPrice, maxPrice } = formData;

  const options = listingType === "huur" ? priceRental : priceSale;

  const minPriceOptions = options;
  const maxPriceOptions = options.filter((option) => option.value >= minPrice);

  const selectedMinPrice = minPriceOptions.find(
    (option) => option.value === minPrice
  );
  const selectedMaxPrice = maxPriceOptions.find(
    (option) => option.value === maxPrice
  );

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
  return (
    <div className="grid grid-cols-2 gap-2 p-2">
      <div className="relative flex items-center">
        <Select
          id="minPrice"
          options={minPriceOptions}
          value={selectedMinPrice}
          isClearable
          isSearchable={false}
          placeholder="Min Price"
          classNames={{
            control: () => "p-1.5 text-sm rounded-lg",
          }}
          className="w-full"
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
          id="minPrice"
          options={maxPriceOptions}
          value={selectedMaxPrice}
          isClearable
          isSearchable={false}
          placeholder="Max Price"
          className="w-full"
          classNames={{
            control: () => "p-1.5 text-sm rounded-lg",
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

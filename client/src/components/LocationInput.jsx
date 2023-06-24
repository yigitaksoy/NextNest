import Select from "react-select";
import municipalities from "../data/municipalities.json";
import neighbourhoods from "../data/neighbourhoods.json";

const LocationInput = ({ handleChange, formData }) => {
  const locationOptions = municipalities;
  const neighbourhoodOptions = neighbourhoods;

  const selectedLocation = locationOptions.find(
    (option) => option.value === formData.location
  );

  const selectedNeighbourhood = neighbourhoodOptions.find(
    (option) => option.value === formData.neighbourhood
  );

  const handleNeighbourhoodChange = (selectedNeighbourhood) => {
    const event = {
      target: {
        name: "neighbourhood",
        value: selectedNeighbourhood ? selectedNeighbourhood.value : "",
      },
    };
    handleChange(event);
  };

  const handleLocationChange = (selectedLocation) => {
    const event = {
      target: {
        name: "location",
        value: selectedLocation ? selectedLocation.value : "",
      },
    };
    handleChange(event);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
      <div className="p-2">
        <div className="relative">
          <Select
            id="location"
            options={locationOptions}
            value={selectedLocation}
            isClearable
            placeholder="City, neighborhood, address, etc."
            noOptionsMessage={() => "Nothing to show"}
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
            onChange={handleLocationChange}
            required
          />
        </div>
      </div>
      <div className="p-2">
        <div className="relative">
          <Select
            id="neighbourhood"
            options={neighbourhoodOptions}
            value={selectedNeighbourhood}
            isClearable
            placeholder="Neighbourhoods"
            noOptionsMessage={() => "Nothing to show"}
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
            onChange={handleNeighbourhoodChange}
          />
        </div>
      </div>
    </div>
  );
};

export default LocationInput;

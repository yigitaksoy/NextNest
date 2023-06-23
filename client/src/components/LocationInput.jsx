import Select from "react-select";
import municipalities from "../data/municipalities.json";
import { MapIcon } from "@heroicons/react/24/outline";

const LocationInput = ({ handleChange, formData }) => {
  const locationOptions = municipalities;

  const selectedLocation = locationOptions.find(
    (option) => option.value === formData.location
  );

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
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MapIcon className="h-5 w-5 text-gray-500" />
          </div>

          <input
            type="text"
            className="search-input input block w-full rounded-lg border border-transparent  p-2.5 pl-10 text-sm focus:border-sky-300 focus:outline-none focus:ring-0"
            placeholder="Neighbourhood - coming soon!"
            value={formData.buurt}
            name="buurt"
            onChange={handleChange}
            disabled
          />
        </div>
      </div>
    </div>
  );
};

export default LocationInput;

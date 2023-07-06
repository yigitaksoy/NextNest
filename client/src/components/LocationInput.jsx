import { useState } from "react";
import Select from "react-select";
import municipalities from "../data/municipalities.json";
import neighbourhoods from "../data/neighbourhoods.json";

const LocationInput = ({ handleChange, formData }) => {
  const locationOptions = municipalities;
  const neighbourhoodOptions = neighbourhoods;
  const [isAmsterdam, setIsAmsterdam] = useState(false);
  const [isAllSelected, setIsAllSelected] = useState(false);

  const selectedLocation = locationOptions.find(
    (option) => option.value === formData.location
  );

  const selectedNeighbourhood = Array.isArray(formData.neighbourhood)
    ? neighbourhoodOptions.filter((option) =>
        formData.neighbourhood.map((n) => n.value).includes(option.value)
      )
    : [];

  const handleNeighbourhoodChange = (selectedNeighbourhoods) => {
    // If empty array is passed, clear the neighbourhood selection
    if (selectedNeighbourhoods.length === 0) {
      const event = {
        target: {
          name: "neighbourhood",
          value: [],
        },
      };
      handleChange(event);
      return;
    }

    // Check if "All Neighborhoods" is selected
    const allSelected = selectedNeighbourhoods.find(
      (option) => option.value === ""
    );

    // If "All Neighborhoods" is selected, set isAllSelected to true
    if (allSelected) {
      setIsAllSelected(true);
      selectedNeighbourhoods = [allSelected];
    } else {
      setIsAllSelected(false);
    }

    const event = {
      target: {
        name: "neighbourhood",
        value: selectedNeighbourhoods || [],
      },
    };
    handleChange(event);
  };

  const options = isAllSelected
    ? [{ value: "", label: "All Neighborhoods" }]
    : neighbourhoodOptions;

  const handleLocationChange = (selectedLocation) => {
    const event = {
      target: {
        name: "location",
        value: selectedLocation ? selectedLocation.value : "",
      },
    };

    // Check if selected city is Amsterdam
    const isCityAmsterdam =
      selectedLocation && selectedLocation.value === "amsterdam";
    setIsAmsterdam(isCityAmsterdam);

    // If city is not Amsterdam, clear the neighbourhood selection
    if (!isCityAmsterdam) {
      handleNeighbourhoodChange([]);
    }

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
            placeholder="Cities & Municipalities"
            noOptionsMessage={() => "Nothing to show"}
            classNames={{
              control: () => "p-1.5 text-sm rounded-xl",
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
                border: state.isFocused
                  ? "2px solid #7dd3fc"
                  : "2px solid black",
                boxShadow: state.isFocused ? "0px 0px .5px #7dd3fc" : "none",
                "&:hover": {
                  border: "2px solid #7dd3fc",
                },
              }),
              menu: (base) => ({
                ...base,
                border: "2px solid black",
                borderRadius: "7px",
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
            options={options}
            value={selectedNeighbourhood}
            isClearable
            isMulti
            closeMenuOnSelect={false}
            blurInputOnSelect={false}
            placeholder="Neighborhoods - Amsterdam only"
            isDisabled={!isAmsterdam}
            onChange={handleNeighbourhoodChange}
            noOptionsMessage={() =>
              isAllSelected ? null : "Neighborhood not found"
            }
            classNames={{
              control: () => "p-1.5 text-sm rounded-xl",
            }}
            className=" w-full"
            styles={{
              input: (base) => ({
                ...base,
                "input:focus": {
                  boxShadow: "none",
                },
              }),
              control: (base, state) => ({
                ...base,
                border: state.isFocused
                  ? "2px solid #7dd3fc"
                  : "2px solid black",
                boxShadow: state.isFocused ? "0px 0px .5px #7dd3fc" : "none",
                "&:hover": {
                  border: "2px solid #7dd3fc",
                },
              }),
              menu: (base) => ({
                ...base,
                border: "2px solid black",
                borderRadius: "7px",
              }),
              multiValue: (base) => ({
                ...base,
                backgroundColor: "black",
                color: "white",
                borderRadius: "5px",
                fontWeight: "700",
              }),
              multiValueLabel: (base) => ({
                ...base,
                color: "white",
              }),
              multiValueRemove: (styles, { data }) => ({
                ...styles,
                color: data.color,
                ":hover": {
                  backgroundColor: "#ff81cc",
                  color: "black",
                  borderRadius: "0px 5px 5px 0px",
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
          />
        </div>
      </div>
    </div>
  );
};

export default LocationInput;

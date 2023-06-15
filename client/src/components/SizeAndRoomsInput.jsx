import Select from "react-select";
import surface from "../data/surface.json";

const SizeAndRoomsInput = ({ handleChange, formData }) => {
  const options = surface;
  const selectedSurface = options.find(
    (option) => option.value === formData.minSize
  );

  const handleSurfaceChange = (selectedOption) => {
    const event = {
      target: {
        name: "minSize",
        value: selectedOption ? selectedOption.value : "",
      },
    };
    handleChange(event);
  };
  return (
    <div className="grid grid-cols-2 gap-2 p-2">
      <div className="relative flex items-center">
        <Select
          id="minSize"
          options={options}
          value={selectedSurface}
          isClearable
          isSearchable={false}
          placeholder="Surface"
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
          onChange={handleSurfaceChange}
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
  );
};

export default SizeAndRoomsInput;

import Select from "react-select";
import surface from "../data/surface.json";
import rooms from "../data/rooms.json";

const SizeAndRoomsInput = ({ handleChange, formData }) => {
  const surfaceOptions = surface;
  const roomOptions = rooms;

  const selectedSurface = surfaceOptions.find(
    (option) => option.value === formData.minSize
  );
  const selectedRoom = roomOptions.find(
    (option) => option.value === formData.minBedrooms
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

  const handleRoomChange = (selectedOption) => {
    const event = {
      target: {
        name: "minBedrooms",
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
          options={surfaceOptions}
          value={selectedSurface}
          isClearable
          isSearchable={false}
          placeholder="Surface"
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
              border: state.isFocused ? "2px solid #7dd3fc" : "2px solid black",
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
          onChange={handleSurfaceChange}
          required
        />
      </div>
      <div className="relative flex items-center">
        <Select
          id="minBedrooms"
          options={roomOptions}
          value={selectedRoom}
          isClearable
          isSearchable={false}
          placeholder="Rooms"
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
              border: state.isFocused ? "2px solid #7dd3fc" : "2px solid black",
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
          onChange={handleRoomChange}
          required
        />
      </div>
    </div>
  );
};

export default SizeAndRoomsInput;

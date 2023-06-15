const SizeAndRoomsInput = ({ handleChange, formData }) => {
  return (
    <div className="grid grid-cols-2 gap-2 p-2">
      <div className="relative flex items-center">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"></div>
        <input
          type="number"
          id="minSize"
          className="input block w-full rounded-lg border p-2.5 pl-16 text-sm"
          placeholder="Size"
          value={formData.minSize}
          name="minSize"
          onChange={handleChange}
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

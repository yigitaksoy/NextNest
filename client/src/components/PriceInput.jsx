const PriceInput = ({ handleChange, formData }) => {
  return (
    <div className="grid grid-cols-2 gap-2 p-2">
      <div className="relative flex items-center">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <p>From</p>
        </div>
        <input
          type="number"
          id="minPrice"
          className="input block w-full rounded-lg border p-2.5 pl-16 text-sm"
          placeholder="Price From"
          value={formData.minPrice}
          name="minPrice"
          onChange={handleChange}
          required
        />
      </div>
      <div className="relative flex items-center">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <p>To</p>
        </div>
        <input
          type="number"
          id="maxPrice"
          className="input block w-full rounded-lg border p-2.5 pl-10 text-sm"
          placeholder="Limit"
          value={formData.maxPrice}
          name="maxPrice"
          onChange={handleChange}
          required
        />
      </div>
    </div>
  );
};

export default PriceInput;

import { MapIcon } from "@heroicons/react/24/outline";

const LocationInput = ({ handleChange, formData }) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="p-2">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MapIcon className="h-5 w-5 text-gray-500" />
          </div>
          <input
            type="text"
            className="input block w-full rounded-lg border border-transparent p-2.5 pl-10 text-sm focus:border-transparent focus:ring-0"
            placeholder="City, neighborhood, address, etc."
            value={formData.location}
            name="location"
            onChange={handleChange}
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
            className="input block w-full rounded-lg border border-transparent p-2.5 pl-10 text-sm focus:border-transparent focus:ring-0"
            placeholder="Neighborhood"
            value={formData.buurt}
            name="buurt"
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};

export default LocationInput;

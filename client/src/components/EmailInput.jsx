import { EnvelopeIcon } from "@heroicons/react/24/outline";

const EmailInput = ({ handleChange, formData }) => {
  return (
    <div className="grid grid-cols-1 p-2">
      <div className="flex justify-between">
        <div className="relative flex w-full items-center">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <EnvelopeIcon className="h-5 w-5 text-gray-500" />
          </div>
          <input
            type="email"
            id="maxPrice"
            className="input block w-full rounded-lg border p-2.5 pl-10 text-sm"
            placeholder="E-mail"
            value={formData.email}
            name="email"
            onChange={handleChange}
            required
          />
        </div>
      </div>
    </div>
  );
};

export default EmailInput;

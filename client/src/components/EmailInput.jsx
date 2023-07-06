import { EnvelopeIcon } from "@heroicons/react/24/outline";

const EmailInput = ({ handleChange, formData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-2">
      <div className="p-2">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <EnvelopeIcon className="h-5 w-5 text-gray-500" />
          </div>
          <input
            type="email"
            id="maxPrice"
            className="search-input text-md input block w-full rounded-lg border border-transparent p-2.5 pl-10 hover:border-sky-300 focus:border-sky-300 focus:outline-none focus:ring-0"
            placeholder="E-mail"
            value={formData.email}
            name="email"
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className="p-2 md:flex md:justify-end">
        <div className="relative">
          <button
            id="send-button"
            className="btn mt-2 w-full rounded-xl border bg-custom-green p-2 font-marker text-lg text-custom-black hover:bg-custom-black hover:text-white  md:mt-0 md:w-auto"
          >
            Search & Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailInput;

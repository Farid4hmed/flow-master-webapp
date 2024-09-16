import React from "react";
import SendIcon from "@/app/Icons/SendIcon";


interface FormData {
  onSubmit: (query: string) => void;
  disabled: any;
  query: any;
  setQuery: any;
}

const Form: React.FC<FormData> = ({ onSubmit, disabled, query, setQuery }) => {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery("")
    onSubmit(query);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex justify-center items-center sm:px-10 px-5 sm:mb-4 mb-1">
      <div id="div" className="relative flex items-center rounded-full border-gray-200 sm:py-0 py-1 w-full">
        <input
          id="input"
          type="text"
          value={query}
          placeholder="Express that what you want to design..."
          onChange={e => {setQuery(e.target.value)}}
          className="appearance-none bg-[#F3F5F4] border-none w-full rounded-full text-gray-700 py-4 px-10 md:pl-4 pl-2 leading-tight focus:outline-none"
          required
          disabled={disabled}
        />
        <button
          id="button"
          type="submit"
          className="absolute right-0 mr-3 focus:outline-none"
        >
          <SendIcon />
        </button>
      </div>
    </form>
  );
};

export default Form;
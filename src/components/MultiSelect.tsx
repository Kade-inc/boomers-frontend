import { useState } from "react";
import DomainTopic from "../entities/DomainTopic";

interface MultiSelectProps {
  options: DomainTopic[];
  selected: DomainTopic[];
  onChange: (selected: DomainTopic[]) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selected,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const toggleOption = (option: DomainTopic) => {
    const isSelected = selected.some((item) => item._id === option._id);
    if (isSelected) {
      onChange(selected.filter((item) => item._id !== option._id));
    } else {
      onChange([...selected, option]);
    }
  };

  const filteredOptions = options.filter((option) =>
    option.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="relative w-[143px]">
      {/* Dropdown Button with Arrow Icon */}
      <div
        className="border border-gray-300 p-1 rounded cursor-pointer text-[14px] flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>
          {selected.length === 0
            ? "Topics"
            : selected.map((s) => s.name).join(", ")}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute z-10 border mt-1 p-2 w-full max-h-60 overflow-auto text-base-content bg-base-100">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search topics"
            className="w-full p-1 border mb-2 text-[14px] bg-transparent"
          />
          {filteredOptions.map((option) => (
            <label key={option._id} className="block text-[14px]">
              <input
                type="checkbox"
                checked={selected.some((item) => item._id === option._id)}
                onChange={() => toggleOption(option)}
              />
              <span className="ml-1">{option.name}</span>
            </label>
          ))}
          {filteredOptions.length === 0 && (
            <p className="text-[12px] text-base-content">No topics found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;

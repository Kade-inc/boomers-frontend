import { useState, useRef, useEffect } from "react";
import DomainTopic from "../entities/DomainTopic";

interface MultiSelectProps {
  options: DomainTopic[];
  selected: DomainTopic[];
  onChange: (selected: DomainTopic[]) => void;
  parentContainerWidth?: string;
  inputStyles?: string;
  disabled?: boolean;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selected,
  onChange,
  parentContainerWidth,
  inputStyles,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    <div
      ref={dropdownRef}
      className={`relative ${parentContainerWidth ? parentContainerWidth : "w-[143px]"} `}
    >
      {/* Dropdown Button with Arrow Icon */}
      <div
        className={`${inputStyles ?? "border border-gray-300 p-1 rounded cursor-pointer text-[14px] flex justify-between items-center"} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className="font-body truncate flex-1 mr-2">
          {selected.length === 0
            ? "Topics"
            : selected.map((s) => s.name).join(", ")}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 transition-transform duration-200 flex-shrink-0 ${isOpen ? "rotate-180" : ""}`}
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
      {isOpen && !disabled && (
        <div className="absolute z-10 border mt-1 w-full max-h-60 text-base-content bg-base-100">
          {/* Fixed Search Input */}
          <div className="p-2 border-b bg-base-100 sticky top-0 z-20">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search topics"
              className="w-full p-1 border text-[14px] bg-transparent font-body"
            />
          </div>
          {/* Scrollable Options */}
          <div className="p-2 max-h-48 overflow-auto">
            {filteredOptions.map((option) => (
              <label key={option._id} className="block text-[14px]">
                <input
                  type="checkbox"
                  checked={selected.some((item) => item._id === option._id)}
                  onChange={() => toggleOption(option)}
                />
                <span className="ml-1 font-body">{option.name}</span>
              </label>
            ))}
            {filteredOptions.length === 0 && (
              <p className="text-[12px] text-base-content">No topics found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelect;

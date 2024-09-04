import TeamCard from "../components/TeamCard";

const TeamsPage = () => {
  return (
    <div className="h-screen text-darkgrey">
      <p className="font-normal text-[20px] ">Text</p>

      <div className="flex gap-2 flex-wrap">
        <p>Filters:</p>
        <select className="max-w-xs bg-transparent border border-1 w-[143px] p-1 style={{ borderColor: 'rgba(204, 205, 207, 1)' }} text-[14px]">
          <option disabled selected>
            Domain
          </option>
          <option>Game of Thrones</option>
          <option>Lost</option>
        </select>
        <select className="max-w-xs bg-transparent border p-1 border-1 w-[143px] style={{ borderColor: 'rgba(204, 205, 207, 1)' }} text-[14px]">
          <option disabled selected>
            Sub domain
          </option>
          <option>Game of Thrones</option>
          <option>Lost</option>
        </select>
        <select className="max-w-xs bg-transparent border p-1 border-1 w-[143px] style={{ borderColor: 'rgba(204, 205, 207, 1)' }} text-[14px]">
          <option disabled selected>
            Topics
          </option>
          <option>Game of Thrones</option>
          <option>Lost</option>
        </select>
        <button className="w-[143px] text-[14px] p-1 text-white bg-red-600">
          Clear all
        </button>
      </div>
      <div className="mt-6 flex flex-wrap gap-3 m-auto">
        <TeamCard />
        <TeamCard />
        <TeamCard />
      </div>
    </div>
  );
};

export default TeamsPage;

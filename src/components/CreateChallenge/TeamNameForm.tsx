import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Team from "../../entities/Team";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface FormInputs {
  name: string;
}

interface TeamNameFormProps {
  teams: Team[];
  handleTeamChange: (team: Team, stepComplete: boolean) => void;
  selectedTeam: Team | undefined;
  goToNextStep: () => void;
}

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name should have a minimum of 3 characters")
    .max(30, "Name can be a max of 30 characters"),
});

function TeamNameForm({
  teams,
  selectedTeam,
  handleTeamChange,
  goToNextStep,
}: TeamNameFormProps) {
  const {
    register,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: selectedTeam?.name || "",
    },
  });

  const navigate = useNavigate();
  const [selectedTeamName, setSelectedTeamName] = useState(
    selectedTeam?.name || "",
  );

  useEffect(() => {
    if (selectedTeam) {
      setSelectedTeamName(selectedTeam.name);
      handleTeamChange(selectedTeam, true);
    }
  }, [selectedTeam]);

  // Handle selection change and call handleTeamChange only when selection changes
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newTeamName = event.target.value;
    setSelectedTeamName(newTeamName);

    const newSelectedTeam = teams.find((team) => team.name === newTeamName);
    if (newSelectedTeam) {
      handleTeamChange(newSelectedTeam, true);
    }
  };

  return (
    <>
      {teams.length === 0 && (
        <>
          <div className="flex flex-col justify-center items-center mt-[200px]">
            <p className="font-body text-base-content">
              You do not own any teams. Create a team first and try again.
            </p>
            <button
              className="btn bg-yellow text-darkgrey border-none hover:bg-yellow font-medium mt-8 px-8 text-[16px] font-body rounded-md"
              onClick={() => navigate("/create-team")}
            >
              Create Team
            </button>
          </div>
        </>
      )}
      {teams.length > 0 && (
        <>
          <form className="w-[80%] font-body">
            <div className="mb-6">
              <label
                className="block text-base-content mb-[1%] text-[18px]"
                htmlFor="team"
              >
                Select a Team
                {errors.name && (
                  <span className="text-error text-[13px] ml-[5px]">
                    required*
                  </span>
                )}
              </label>
              <select
                className="select w-full border border-base-content focus:outline-none rounded-md placeholder-gray-100 mt-[5px] bg-transparent font-normal"
                {...register("name")}
                value={selectedTeamName}
                onChange={handleSelectChange}
                id="name"
              >
                <option value="" disabled>
                  Team
                </option>
                {teams.map((team) => (
                  <option key={team._id} value={team.name}>
                    {team.name}
                  </option>
                ))}
              </select>
              {errors.name && (
                <p className="text-white text-[12px] font-body bg-error pl-3 py-2 rounded-md mt-2">
                  {errors.name?.message}
                </p>
              )}
            </div>
          </form>
          <div className="mt-4">
            <button
              onClick={goToNextStep}
              disabled={!selectedTeamName}
              className="btn px-12 bg-yellow text-darkgrey rounded disabled:opacity-50 text-[16px] hover:bg-yellow font-normal"
            >
              Next
            </button>
          </div>
        </>
      )}
    </>
  );
}

export default TeamNameForm;

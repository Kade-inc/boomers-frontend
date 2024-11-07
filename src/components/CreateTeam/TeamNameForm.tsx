import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";


interface FormInputs {
    name: string;
  }

  
const schema = z
  .object({
    name: z.string()
    .trim()
    .min(3, "Name should have a minimum of 3 characters")
    .max(30, "Name can be a max of 30 characters"),
  })


type FormData = z.infer<typeof schema>;

function TeamNameForm() {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitted },
        watch,
        control,
      } = useForm<FormInputs>({
        resolver: zodResolver(schema),
        defaultValues: {
          name: "",
        },
      });

      const onSubmit = () => {

      }
  return (
    <>
        <form className="w-[80%]" onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-6">
                    <label
                      className="block text-base-content mb-[1%] text-[18px]"
                      htmlFor="name"
                    >
                      Team Name
                      {errors.name && (
                        <span className="text-error text-[13px] ml-[5px]">
                          required*
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      placeholder="Team Name"
                      className="input w-full border border-base-content focus:outline-none bg-transparent rounded-md placeholder-gray-300 mt-[5px]"
                      style={{ backgroundColor: "transparent" }}
                      {...register("name")}
                      id="name"
                    />
                    {errors.name && (
                      <p className="text-white text-[12px] font-body bg-error pl-3 py-2 rounded-md mt-2">
                        {errors.name?.message}
                      </p>
                    )}
                  </div></form>
    </>
  )
}

export default TeamNameForm
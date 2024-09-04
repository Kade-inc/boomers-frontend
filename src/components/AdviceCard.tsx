interface AdviceCardProps {
  className: string;
}
const AdviceCard = ({ className }: AdviceCardProps) => {
  return (
    <div
      className={`container mx-auto gap-5 w-[230px] h-[200px] px-4 flex flex-col items-center justify-center bg-darkgrey rounded-[5px] ${className}`}
    >
      <div className="text-center text-white text-[13px] font-semibold font-body">
        Today’s advice
      </div>
      <div className="text-center text-white text-[13px] font-regular font-body">
        The best time to start is now. Remember everything you’ve learnt and
        keep going.
      </div>
      <div className="w-52 h-[21px] flex justify-center bg-yellow rounded-[50px] text-center">
        <button className="text-center text-darkgrey text-[9px] font-medium font-body">
          With ❤️ From Advice Slip Json API
        </button>
      </div>
    </div>
  );
};
export default AdviceCard;

import elipse from "../assets/Ellipse 103.svg";

const MemberCard = () => {
  return (
    <div className="card w-[166px] h-[166px] bg-white">
      <div className="card-body flex flex-col justify-center items-center">
        <img className="h-[81px] w-[81px]" src={elipse} alt="elipse" />
        <p>Silver Bullets</p>
      </div>
    </div>
  );
};

export default MemberCard;

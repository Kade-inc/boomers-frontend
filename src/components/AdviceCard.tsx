const AdviceCard = () => {
    return (
    <div className="container mx-auto gap-5 max-w-[293px] h-[194px] p-[10px] left-[1095px] flex flex-col items-center justify-center bg-darkgrey rounded-[5px]">
        <div className="w-[173px] h-[23px] text-center text-white text-lg font-semibold font-body">Today’s advice</div>
        <div className="w-[219px] h-[90px] text-center text-white text-[15px] font-medium font-body">The best time to start is now. Remember everything you’ve learnt and keep going.</div>
        <div className="w-52 h-[21px] flex justify-center bg-yellow rounded-[50px] text-center">
            <button className="text-center text-darkgrey text-[10px] font-medium font-body">With ❤️ From Advice Slip Json API</button>
        </div>
    </div>
    );
}
export default AdviceCard;

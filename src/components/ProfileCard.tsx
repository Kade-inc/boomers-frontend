const ProfileCard = () => {
    
    return (
        <div className="bg-yellow flex absolute flex-col mx-auto p-[10px] w-[293px] h-[245px] rounded-[5px] left-[1089px] top-[110px] items-center justify-center gap-3 shadow-md">
            <div className="rounded-full w-[120px] h-[120px]">
               <img src="src\assets\Mask-group.png" alt="profile Picture" className="w-full rounded-full object-cover"/>
            </div>
            <div className="w-[115px] h-[20px] text-darkgrey font-body font-[600] text-[16px] leading-[19.5px] text-center"><h1>paul_dreamer</h1></div>
            <button className="bg-darkgrey w-[114px] h-[25px] rounded-[3px] text-white font-body font-[500] text-[12px] leading-[14.63px] text-center">Edit Profile</button>
        </div>
        
    )
}

export default ProfileCard;
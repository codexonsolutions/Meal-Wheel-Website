import Image from "next/image";
export default function Logo(){
    return(
        <div className="flex items-center">
            <div className="w-10 h-10 flex items-center justify-center">
              <Image 
                src="/mealwheel.svg" 
                alt="Meal Wheel" 
                width={24} 
                height={24}
              />
            </div>
            <div className="flex items-center">
              <span className="text-xl font-semibold">
                Meal Wheel
              </span>
            </div>
          </div>
    )
}
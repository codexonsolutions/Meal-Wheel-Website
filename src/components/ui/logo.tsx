import Image from "next/image";
export default function Logo({ color }: { color?: string }) {
  return (
    <div className="flex items-center gap-[10px]">
      <div className="flex items-center justify-center">
        <Image
          src={color === "white" ? "/mealwheel-white.svg" : "/mealwheel.svg"}
          style={{
            color: "white",
          }}
          alt="Meal Wheel"
          width={50}
          height={50}
        />
      </div>
      <div className="flex items-center">
        <span className="text-xl font-semibold">Meal Wheel</span>
      </div>
    </div>
  );
}

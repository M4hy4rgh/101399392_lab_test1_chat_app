import React from "react";
import ParticlesComponent from "../components/ParticlesComponent";

export default function Error() {
  return (
    <div>
      <div className="container mx-auto min-h-screen min-w-full flex justify-center items-center">
        <ParticlesComponent />
          <div className=" flex flex-col justify-center items-center text-center text-4xl bg-white/40 z-20 border-4 rounded-xl border-slate-700 py-24 px-56">
            <h1 className="text-[#282828] ">404 Error</h1>
            <h3 className="text-[#282828] ">Page not found</h3>
        </div>
      </div>
    </div>
  );
}

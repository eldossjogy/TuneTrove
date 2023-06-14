import React from "react";

interface BarGraphProps {
  data: { [key: number]: number };
}

const BarGraph: React.FC<BarGraphProps> = ({ data }) => {
  const barData = Object.entries(data).map(([label, value]) => ({
    label: label.toString(),
    value,
  }));

  const max = Math.max(...Object.values(data));

  return (
    <div className="container mx-auto mt-8">
    <h1 className="mb-4 text-2xl font-bold">Score Distribution</h1>
  
    {/* Div for small screens */}
    <div className="sm:hidden">
      <div className="flex flex-col items-start sm:flex-row sm:items-end">
        {barData.map((bar, index) => {
          const normalizedValue = (bar.value / max) * 100;
          const scaledValue = (normalizedValue / 100) * 200;
  
          return (
            <div key={index} className="mb-2 flex items-center">
              <div className="mr-2 w-12 text-right text-white sm:w-auto">
                {bar.value ? bar.value : ""}
              </div>
              <div
                className="rounded bg-green-500"
                style={{ width: `${scaledValue}px`, height: "20px" }}
              ></div>
              <div className="ml-2 text-white">{bar.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  
    {/* Div for medium screens */}
    <div className="hidden md:block">
      <div className="flex items-end">
        {barData.map((bar, index) => {
          const normalizedValue = (bar.value / max) * 100;
          const scaledValue = (normalizedValue / 100) * 200;
  
          return (
            <div key={index} className="flex-1 p-4">
              <div className="mt-2 text-center text-white">
                {bar.value ? bar.value : ""}
              </div>
              <div
                className="rounded bg-green-500"
                style={{ height: `${scaledValue}px` }}
              ></div>
              <div className="mt-2 text-center text-white">{bar.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
  
  );
};

export default BarGraph;

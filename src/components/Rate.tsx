export default function Rate() {
  return (
    <div className="rounded-md bg-stone-800 p-2">
      <p className="font-bold">Rating:</p>
      <div className="flex items-center justify-center text-2xl">
        <div className="flex items-center mr-10">
          <input
            type="number"
            name=""
            id=""
            max={10}
            min={0}
            defaultValue={9}
            className="w-12 bg-transparent text-right "
          />
          <span className="text-xl mt-5">/</span>
          <span className="text-xl mt-10">10</span>
        </div>
      </div>
      <div>
        <p className="text-md font-bold">First time rated:</p>
        <p className="text-gray-400">209123093 at 91023</p>
        <p className="text-md font-bold">Last time rated:</p>
        <p className="text-gray-400">209123093 at 91023</p>
      </div>
      <div className="flex justify-between">
        <button
          type="submit"
          className="mt-2 rounded  px-2 py-1 font-bold text-white bg-green-500"
        >
          Save
        </button>
        <button
          type="submit"
          className="mt-2 rounded px-2 py-1 font-bold text-white bg-red-500"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

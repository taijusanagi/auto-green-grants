import { useState } from "react";

export default function Home() {
  const [role, setRole] = useState("sponsor");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(true);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-800 via-gray-850 to-gray-900 font-poppins">
      <header className="sticky top-0 z-50 flex justify-end items-center w-full p-4">
        <button className="px-6 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition-transform transform hover:scale-105">
          Connect Wallet
        </button>
      </header>

      <div className="flex-grow flex flex-col justify-center items-center">
        <div className="mb-6 flex justify-end items-center w-full max-w-xl px-4">
          <nav className="flex space-x-4 text-white">
            <button
              className={`px-4 py-2 ${
                role === "sponsor" ? "text-purple-600 font-semibold border-b-2 border-purple-600" : ""
              }`}
              onClick={() => setRole("sponsor")}
            >
              Sponsors
            </button>
            <button
              className={`px-4 py-2 ${
                role === "applicant" ? "text-purple-600 font-semibold border-b-2 border-purple-600" : ""
              }`}
              onClick={() => setRole("applicant")}
            >
              Applicants
            </button>
          </nav>
        </div>

        <div className="bg-transparent backdrop-blur-lg p-10 rounded-lg shadow-xl w-full max-w-xl mx-auto space-y-6">
          {role === "applicant" && (
            <>
              <h1 className="text-4xl font-semibold mb-6 text-white">Apply for a Grant</h1>
              {/* Applicant form goes here */}
            </>
          )}

          {role === "sponsor" && (
            <>
              <h1 className="text-4xl font-semibold mb-6 text-white">Offer a Grant</h1>
              <div className="space-y-6">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-4 rounded-lg bg-gray-800 text-white border border-gray-700 transition-shadow focus:ring-2 focus:ring-purple-600 focus:outline-none"
                  placeholder="Grant Title"
                />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-4 rounded-lg bg-gray-800 text-white border border-gray-700 transition-shadow focus:ring-2 focus:ring-purple-600 focus:outline-none"
                  placeholder="Grant Description"
                ></textarea>
                <button className="w-full p-4 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-transform transform hover:scale-105">
                  Submit
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed z-50 top-0 left-0 w-full h-full flex justify-center items-center">
          <div className="bg-black bg-opacity-50 absolute w-full h-full" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-transparent backdrop-blur-lg p-6 rounded-lg shadow-2xl w-full max-w-md z-10 space-y-4">
            <h2 className="text-2xl font-semibold text-white">Modal Title</h2>
            <p className="text-white">This is your modal content. Add any information or actions you'd like here.</p>
            <button
              className="w-full p-2 rounded-md bg-purple-600 text-white hover:bg-purple-700"
              onClick={() => setIsModalOpen(false)}
            >
              Close Modal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

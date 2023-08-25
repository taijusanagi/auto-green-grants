/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";

export default function Home() {
  const [role, setRole] = useState<"sponsor" | "applicant">("sponsor");

  const [sponsorAction, setSponsorAction] = useState<
    "default" | "createGrant" | "reviewApplication" | "reviewSubmission"
  >("default");
  const [applicantAction, setApplicantAction] = useState<"default" | "applyForGrant" | "peerReview" | "submitToGrant">(
    "default"
  );

  const [grantName, setGrantName] = useState("");
  const [grantDescription, setGrantDescription] = useState("");
  const [grantId, setGrantId] = useState("");

  const [teamName, setTeamName] = useState("");
  const [teamMembers, setTeamMembers] = useState([""]);
  const [teamDescription, setTeamDescription] = useState("");
  const [applicationId, setApplicationId] = useState("");

  const [selectedTeamMember, setSelectedTeamMember] = useState("");
  const [reviewDescription, setReviewDescription] = useState("");

  const [referenceURL, setReferenceURL] = useState("");
  const [peerReviews, setPeerReviews] = useState([
    { reviewerName: "John Doe", description: "This is a great submission!" },
    { reviewerName: "Jane Smith", description: "Looks good, but needs some edits." },
  ]);

  const [submissionId, setSubmissionId] = useState("");

  const addTeamMember = () => {
    setTeamMembers([...teamMembers, ""]);
  };

  const updateTeamMember = (index: number, value: string) => {
    const newTeamMembers = [...teamMembers];
    newTeamMembers[index] = value;
    setTeamMembers(newTeamMembers);
  };

  const removeTeamMember = (index: number) => {
    const newTeamMembers = [...teamMembers];
    newTeamMembers.splice(index, 1);
    setTeamMembers(newTeamMembers);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalDescription, setModalDescription] = useState("");

  const moveToSponsor = () => {
    setSponsorAction("default");
    setRole("sponsor");
  };

  const moveToApplicant = () => {
    setApplicantAction("default");
    setRole("applicant");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    if (role == "sponsor") {
      if (sponsorAction == "createGrant" || sponsorAction == "reviewApplication") {
        moveToApplicant();
      } else {
        moveToSponsor();
      }
    }

    if (role == "applicant") {
      if (applicantAction == "applyForGrant" || applicantAction == "submitToGrant") {
        moveToSponsor();
      } else {
        moveToApplicant();
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-800 via-gray-850 to-gray-900 font-poppins">
      <header className="sticky top-0 z-50 flex justify-end items-center w-full p-4">
        <button className="px-6 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700">Connect Wallet</button>
      </header>

      <div className="flex-grow flex flex-col justify-center items-center py-12">
        <div className="mb-6 flex justify-end items-center w-full max-w-xl px-4">
          <nav className="flex space-x-4 text-white">
            <button
              className={`px-4 py-2 ${
                role === "sponsor" ? "text-purple-600 font-semibold border-b-2 border-purple-600" : ""
              }`}
              onClick={moveToSponsor}
            >
              Sponsors
            </button>
            <button
              className={`px-4 py-2 ${
                role === "applicant" ? "text-purple-600 font-semibold border-b-2 border-purple-600" : ""
              }`}
              onClick={moveToApplicant}
            >
              Applicants
            </button>
          </nav>
        </div>

        <div className="bg-transparent backdrop-blur-lg p-10 rounded-lg shadow-xl w-full max-w-xl mx-auto space-y-6">
          {role === "sponsor" && (
            <>
              {sponsorAction === "default" && (
                <>
                  <h1 className="text-4xl font-semibold mb-6 text-white">Sponsor Dashboard</h1>
                  <div className="space-y-6">
                    <button
                      className="w-full p-4 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
                      onClick={() => setSponsorAction("createGrant")}
                    >
                      Create Grant
                    </button>

                    <div>
                      <input
                        value={applicationId}
                        onChange={(e) => setApplicationId(e.target.value)}
                        className="w-full p-4 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-purple-600 focus:outline-none mb-2"
                        placeholder="Application ID"
                      />
                      <button
                        className="w-full p-4 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
                        onClick={() => setSponsorAction("reviewApplication")}
                      >
                        Review Application
                      </button>
                    </div>

                    <div>
                      <input
                        value={submissionId}
                        onChange={(e) => setSubmissionId(e.target.value)}
                        className="w-full p-4 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-purple-600 focus:outline-none mb-2"
                        placeholder="Submission ID"
                      />
                      <button
                        className="w-full p-4 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
                        onClick={() => setSponsorAction("reviewSubmission")}
                      >
                        Review Submission
                      </button>
                    </div>
                  </div>
                </>
              )}

              {sponsorAction === "createGrant" && (
                <>
                  <button className="mb-6 text-white" onClick={() => setSponsorAction("default")}>
                    ← Back
                  </button>
                  <h1 className="text-4xl font-semibold mb-6 text-white">Create Grant</h1>
                  <div className="space-y-6">
                    <input
                      value={grantName}
                      onChange={(e) => setGrantName(e.target.value)}
                      className="w-full p-4 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-purple-600 focus:outline-none"
                      placeholder="Grant Title"
                    />
                    <textarea
                      value={grantDescription}
                      onChange={(e) => setGrantDescription(e.target.value)}
                      className="w-full p-4 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-purple-600 focus:outline-none"
                      placeholder="Grant Description"
                      rows={5}
                    ></textarea>
                    <button
                      className="w-full p-4 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
                      onClick={() => {
                        const grantId = "grantId";
                        setGrantId(grantId);
                        setModalTitle("Grant Created");
                        setModalDescription("Your grant has been created successfully!");
                        setIsModalOpen(true);
                      }}
                    >
                      Create
                    </button>
                  </div>
                </>
              )}

              {sponsorAction === "reviewApplication" && (
                <>
                  <button className="mb-6 text-white" onClick={() => setSponsorAction("default")}>
                    ← Back
                  </button>
                  <h1 className="text-4xl font-semibold mb-6 text-white">Review Application</h1>

                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-white">Team Name:</h2>
                    <p className="text-white">{teamName}</p>

                    <h2 className="text-2xl font-semibold text-white">Team Members:</h2>
                    <ul>
                      {teamMembers.map((member, index) => (
                        <li key={index} className="text-white">
                          {member}
                        </li>
                      ))}
                    </ul>

                    <h2 className="text-2xl font-semibold text-white">Team Description:</h2>
                    <p className="text-white">{teamDescription}</p>

                    <button
                      className="w-full p-4 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
                      onClick={() => {
                        setModalTitle("Application Reviewed");
                        setModalDescription("You've successfully reviewed the application!");
                        setIsModalOpen(true);
                      }}
                    >
                      Confirm Review
                    </button>
                  </div>
                </>
              )}

              {sponsorAction === "reviewSubmission" && (
                <>
                  <button className="mb-6 text-white" onClick={() => setSponsorAction("default")}>
                    ← Back
                  </button>
                  <h1 className="text-4xl font-semibold mb-6 text-white">Review Submission</h1>

                  {/* Review Submission Details */}
                  <div className="space-y-6">
                    {/* Display Team Name */}
                    <div className="space-y-2">
                      <h2 className="text-xl text-white">Team Name:</h2>
                      <p className="text-white">{teamName}</p>
                    </div>

                    {/* Display All Team Members */}
                    <div className="space-y-2">
                      <h2 className="text-xl text-white">Team Members:</h2>
                      <ul className="list-disc pl-5">
                        {teamMembers.map((member, index) => (
                          <li key={index} className="text-white">
                            {member}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Display Team Description */}
                    <div className="space-y-2">
                      <h2 className="text-xl text-white">Team Description:</h2>
                      <p className="text-white">{teamDescription}</p>
                    </div>

                    {/* Display Reference URL */}
                    <div className="space-y-2">
                      <h2 className="text-xl text-white">Reference URL:</h2>
                      <a
                        href={referenceURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 underline"
                      >
                        {referenceURL}
                      </a>
                    </div>

                    {/* Display List of Peer Reviews */}
                    <div className="space-y-2">
                      <h2 className="text-xl text-white">Peer Reviews:</h2>
                      <ul className="list-disc pl-5">
                        {peerReviews.map((review, index) => (
                          <li key={index} className="text-white">
                            <strong>{review.reviewerName}:</strong> {review.description}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Approve Button */}
                    <button
                      className="w-full p-4 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
                      onClick={() => {
                        // Handle approval logic here.
                        setModalTitle("Submission Approved");
                        setModalDescription("The submission has been approved successfully!");
                        setIsModalOpen(true);
                      }}
                    >
                      Approve
                    </button>
                  </div>
                </>
              )}
            </>
          )}

          {role === "applicant" && (
            <>
              {applicantAction === "default" && (
                <div className="space-y-6">
                  <h1 className="text-4xl font-semibold mb-6 text-white">Applicant Dashboard</h1>
                  <input
                    value={grantId}
                    onChange={(e) => setGrantId(e.target.value)}
                    placeholder="Enter Grant ID"
                    className="w-full p-4 rounded-lg bg-gray-800 text-white border border-gray-700 transition-shadow focus:ring-2 focus:ring-purple-600 focus:outline-none"
                  />
                  <button
                    className="w-full p-4 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
                    onClick={() => setApplicantAction("applyForGrant")}
                  >
                    Apply for Grant
                  </button>

                  <input
                    value={applicationId}
                    onChange={(e) => setApplicationId(e.target.value)}
                    className="w-full p-4 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-purple-600 focus:outline-none mb-2"
                    placeholder="Application ID"
                  />

                  <button
                    className="w-full p-4 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
                    onClick={() => setApplicantAction("peerReview")}
                  >
                    Peer Review
                  </button>

                  <button
                    className="w-full p-4 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
                    onClick={() => setApplicantAction("submitToGrant")}
                  >
                    Submit to Grant
                  </button>
                </div>
              )}

              {applicantAction === "applyForGrant" && (
                <>
                  <button className="mb-6 text-white" onClick={() => setApplicantAction("default")}>
                    ← Back
                  </button>
                  <h1 className="text-4xl font-semibold mb-6 text-white">Apply for Grant ID: {grantId}</h1>
                  <div className="space-y-6">
                    <input
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      placeholder="Team Name"
                      className="w-full p-4 rounded-lg bg-gray-800 text-white border border-gray-700 transition-shadow focus:ring-2 focus:ring-purple-600 focus:outline-none"
                    />

                    <div className="space-y-4">
                      {teamMembers.map((member, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            value={member}
                            onChange={(e) => updateTeamMember(index, e.target.value)}
                            placeholder={`Member ${index + 1} Name`}
                            className="flex-grow p-4 rounded-lg bg-gray-800 text-white border border-gray-700 transition-shadow focus:ring-2 focus:ring-purple-600 focus:outline-none"
                          />
                          {teamMembers.length > 1 && (
                            <button className="text-red-500 hover:text-red-600" onClick={() => removeTeamMember(index)}>
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
                      <button className="text-purple-600 hover:underline" onClick={addTeamMember}>
                        + Add Member
                      </button>
                    </div>

                    <textarea
                      value={teamDescription}
                      onChange={(e) => setTeamDescription(e.target.value)}
                      placeholder="Team Description"
                      className="w-full p-4 rounded-lg bg-gray-800 text-white border border-gray-700 transition-shadow focus:ring-2 focus:ring-purple-600 focus:outline-none"
                      rows={5}
                    ></textarea>

                    <button
                      className="w-full p-4 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
                      onClick={() => {
                        const applicationId = "applicationId";
                        setApplicationId(applicationId);
                        setModalTitle("Application Submitted");
                        setModalDescription("Your application has been submitted successfully!");
                        setIsModalOpen(true);
                      }}
                    >
                      Submit Application
                    </button>
                  </div>
                </>
              )}
              {applicantAction === "peerReview" && (
                <>
                  <button className="mb-6 text-white" onClick={() => setApplicantAction("default")}>
                    ← Back
                  </button>
                  <h1 className="text-4xl font-semibold mb-6 text-white">Peer Review</h1>

                  {/* Peer Review Form */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-white mb-2">Select Team Member:</label>
                      <select
                        value={selectedTeamMember}
                        onChange={(e) => setSelectedTeamMember(e.target.value)}
                        className="w-full p-4 rounded-lg bg-gray-800 text-white border border-gray-700 transition-shadow focus:ring-2 focus:ring-purple-600 focus:outline-none"
                      >
                        <option value="" disabled>
                          Select a team member
                        </option>
                        {/* Assuming you have a list of team members, render them here */}
                        {teamMembers.map((member) => (
                          <option key={member} value={member}>
                            {member}
                          </option>
                        ))}
                      </select>
                    </div>

                    <input
                      value={reviewDescription}
                      onChange={(e) => setReviewDescription(e.target.value)}
                      placeholder="Review Description"
                      className="w-full p-4 rounded-lg bg-gray-800 text-white border border-gray-700 transition-shadow focus:ring-2 focus:ring-purple-600 focus:outline-none"
                    />

                    <button
                      className="w-full p-4 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
                      onClick={() => {
                        // Here, you'd usually send the review data to your backend or process it accordingly.
                        // For now, we'll just display a modal saying the review was submitted.
                        setModalTitle("Review Submitted");
                        setModalDescription("Your review has been submitted successfully!");
                        setIsModalOpen(true);
                      }}
                    >
                      Submit Review
                    </button>
                  </div>
                </>
              )}

              {applicantAction === "submitToGrant" && (
                <>
                  <button className="mb-6 text-white" onClick={() => setApplicantAction("default")}>
                    ← Back
                  </button>
                  <h1 className="text-4xl font-semibold mb-6 text-white">Submit to Grant ID: {grantId}</h1>

                  {/* Submit to Grant Form */}
                  <div className="space-y-6">
                    <input
                      value={referenceURL}
                      onChange={(e) => setReferenceURL(e.target.value)}
                      placeholder="Reference URL"
                      className="w-full p-4 rounded-lg bg-gray-800 text-white border border-gray-700 transition-shadow focus:ring-2 focus:ring-purple-600 focus:outline-none"
                    />

                    <button
                      className="w-full p-4 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
                      onClick={() => {
                        const submissionId = "submissionId";
                        setSubmissionId(submissionId);
                        setModalTitle("Submission Complete");
                        setModalDescription("Your reference has been submitted successfully!");
                        setIsModalOpen(true);
                      }}
                    >
                      Submit
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed z-50 top-0 left-0 w-full h-full flex justify-center items-center">
          <div className="bg-black bg-opacity-75 absolute w-full h-full" onClick={closeModal}></div>
          <div className="bg-transparent backdrop-blur-lg p-6 rounded-lg shadow-2xl w-full max-w-md z-10 space-y-4">
            <h2 className="text-2xl font-semibold text-white">{modalTitle}</h2>
            <p className="text-white">{modalDescription}</p>
            <button className="w-full p-2 rounded-md bg-purple-600 text-white hover:bg-purple-700" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

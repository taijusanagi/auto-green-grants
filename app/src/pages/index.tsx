/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAllo } from "@/hooks/useAllo";
import { useCarbonOffset } from "@/hooks/useCarbonOffset";
import { useToast } from "@/hooks/useToast";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { useDebug } from "@/hooks/useDebug";
import { utils } from "@/lib/allo";
import { useHyperCert } from "@/hooks/useHyperCert";
import { Web3Storage } from "web3.storage";
import { defaultImage } from "@/lib/hypercert";

const web3StorageClient = new Web3Storage({ token: process.env.NEXT_PUBLIC_WEB3_STORAGE_API_KEY || "" });

const symbolToAddress = {
  ETH: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  USDC: "0x2f3A40A3db8a7e3D09B0adfEfbCe4f6F81927557",
  BAT: "0x70cBa46d2e933030E2f274AE58c951C800548AeF",
} as any;

const addressToSymbol = {
  "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE": "ETH",
  "0x2f3A40A3db8a7e3D09B0adfEfbCe4f6F81927557": "USCD",
  "0x70cBa46d2e933030E2f274AE58c951C800548AeF": "BAT",
} as any;

export default function Home() {
  const {
    alloCoreContract,
    alloRegistryContract,
    directGrantsSimpleStrategy,
    deployDirectGrantsSimpleStrategy,
    attachDirectGrantsSimpleStrategy,
  } = useAllo();
  const { carbonOffset } = useCarbonOffset();
  const { hyperCert } = useHyperCert();

  const { address: userAddress } = useAccount();

  const { debug, isDebugStarted, logs } = useDebug();
  const { toast, showToast } = useToast();

  const [role, setRole] = useState<"sponsor" | "applicant">("sponsor");

  const [sponsorAction, setSponsorAction] = useState<
    "default" | "createGrant" | "reviewApplication" | "reviewSubmission"
  >("default");
  const [applicantAction, setApplicantAction] = useState<"default" | "applyForGrant" | "peerReview" | "submitToGrant">(
    "default",
  );

  const [grantName, setGrantName] = useState("Grant Name");
  const [grantDescription, setGrantDescription] = useState("Grant Description");
  const [grantToken, setGrantToken] = useState("ETH");
  const [grantAmount, setGrantAmount] = useState("0.001");
  const [grantStrategy, setGrantStrategy] = useState("DirectGrantsSimpleStrategy");
  const [isCarbonOffsetEnabled, setIsCarbonOffsetEnabled] = useState(true);

  const [grantId, setGrantId] = useState("");

  const [teamName, setTeamName] = useState("Team Name");
  const [teamDescription, setTeamDescription] = useState("Team Description");
  const [teamMembers, setTeamMembers] = useState([""]);
  const [dripAddress, setDripAddress] = useState("");
  const [applicantId, setApplicantId] = useState("");

  const [applicationId, setApplicationId] = useState("");
  const [isApplicationReviewed, setIsApplicationReviewed] = useState(false);
  const [referenceURL, setReferenceURL] = useState("http://localhost:3000");
  const [milestoneId, setMilestoneId] = useState(0);
  const [submissionId, setSubmissionId] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmissionReviewed, setIsSubmissionReviewed] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalDescription, setModalDescription] = useState("");

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

  useEffect(() => {
    if (!alloCoreContract || !alloRegistryContract || !grantId) {
      return;
    }
    alloCoreContract
      .getPool(grantId)
      .then((pool) => {
        setGrantToken(addressToSymbol[pool.token]);
        const directGrantsSimpleStrategy = attachDirectGrantsSimpleStrategy(pool.strategy);
        // Assume all metadata is stored with protocol 1 == ipfs, and has metadata.json in root
        fetch(`https://${pool.metadata.pointer}.ipfs.dweb.link/metadata.json`)
          .then(async (data) => {
            const { grantName, grantDescription, grantAmount } = await data.json();
            if (grantName) {
              setGrantName(grantName);
            }
            if (grantDescription) {
              setGrantDescription(grantDescription);
            }
            if (grantAmount) {
              setGrantAmount(grantAmount);
            }
            if (isCarbonOffsetEnabled !== undefined) {
              setIsCarbonOffsetEnabled(isCarbonOffsetEnabled);
            }
          })
          .catch((e) => {
            console.log(e.message);
          });
        if (!applicantId) {
          return;
        }
        directGrantsSimpleStrategy
          .getRecipient(applicantId)
          .then((recipient) => {
            fetch(`https://${recipient.metadata.pointer}.ipfs.dweb.link/metadata.json`)
              .then(async (res) => {
                const data = await res.json();
                const { teamName, teamDescription, teamMembers } = data;
                if (teamName) {
                  setTeamName(teamName);
                }
                if (teamDescription) {
                  setTeamDescription(teamDescription);
                }
                if (teamMembers) {
                  setTeamMembers(teamMembers);
                }
                console.log("data", data);
              })
              .catch((e) => {
                console.log(e.message);
              });
          })
          .catch((e) => {
            console.log(e.message);
          });
        directGrantsSimpleStrategy
          .getRecipientStatus(applicantId)
          .then((status) => {
            setIsApplicationReviewed(status === utils.STATUS.ACCEPTED);
          })
          .catch((e) => {
            console.log(e.message);
          });
        directGrantsSimpleStrategy
          .getMilestones(applicantId)
          .then((milestones) => {
            if (milestones.length > 0) {
              setIsSubmitted(milestones[0].milestoneStatus === utils.STATUS.PENDING);
              setIsSubmissionReviewed(milestones[0].milestoneStatus === utils.STATUS.ACCEPTED);
              fetch(`https://${milestones[0].metadata.pointer}.ipfs.dweb.link/metadata.json`)
                .then(async (res) => {
                  const data = await res.json();
                  const { referenceURL } = data;
                  if (referenceURL) {
                    setReferenceURL(referenceURL);
                  }
                })
                .catch((e) => {
                  console.log(e.message);
                });
            }
          })
          .catch((e) => {
            console.log(e.message);
          });
      })
      .catch((e) => {
        console.log(e.message);
      });
  }, [alloCoreContract, grantId, applicantId]);

  useEffect(() => {
    if (!applicationId) {
      return;
    }
    const [grantId, applicantId] = applicationId.split(":");
    if (!grantId || !applicantId) {
      return;
    }
    setGrantId(grantId);
    setApplicantId(applicantId);
  }, [applicationId]);

  useEffect(() => {
    if (!submissionId) {
      return;
    }
    const [grantId, applicantId, milestoneId] = submissionId.split(":");
    if (!grantId || !applicantId || !milestoneId) {
      return;
    }
    setApplicationId(`${grantId}:${applicantId}`);
    setMilestoneId(Number(milestoneId));
  }, [submissionId]);

  useEffect(() => {
    if (isDebugStarted || isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto"; // or 'visible' if you want
    }
    return () => {
      document.body.style.overflow = "auto"; // reset on unmount
    };
  }, [isDebugStarted, isModalOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-700 to-gray-950 font-poppins">
      {isDebugStarted && (
        <div className="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-50 flex flex-col items-center justify-center z-50">
          <div className="max-w-3xl w-full bg-black p-4 rounded-lg shadow-2xl break-all">
            <div className="flex justify-between items-center text-white text-sm align-left mb-2">
              {"Logs"} <FaSpinner className="text-white text-sm animate-spin" />
            </div>
            {logs.map((log, i) => {
              return (
                <p key={`log_${i}`} className="text-green-600 text-xs align-left">
                  {`>> ${log}`}
                </p>
              );
            })}
          </div>
        </div>
      )}
      {toast && (
        <div
          className={`fixed top-4 right-4 w-80 bg-red-800 text-white p-4 rounded-lg shadow-2xl z-50 text-xs break-all`}
        >
          {toast.message.length > 200 ? toast.message.substring(0, 200) : toast.message}
        </div>
      )}
      <div className="flex justify-end items-center w-full p-4">
        <ConnectButton />
      </div>
      <div className="flex flex-col justify-center items-center py-12">
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
        <div className="bg-transparent backdrop-blur-lg p-10 rounded-lg shadow-2xl w-full max-w-xl mx-auto space-y-6">
          {role === "sponsor" && (
            <>
              {sponsorAction === "default" && (
                <>
                  <div className="space-y-6">
                    <h1 className="text-4xl font-semibold mb-6 text-white">Sponsor Dashboard</h1>
                    <div>
                      <button
                        className="w-full px-6 py-3 rounded-lg bg-purple-600 text-white disabled:opacity-25 disabled:cursor-not-allowed enabled:hover:bg-purple-700"
                        onClick={() => setSponsorAction("createGrant")}
                      >
                        Create Grant 🌱
                      </button>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xl font-semibold text-white">Application ID</p>
                      <input
                        value={applicationId}
                        onChange={(e) => setApplicationId(e.target.value)}
                        className="w-full p-4 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-purple-600 focus:outline-none text-sm"
                        placeholder="Application ID"
                      />
                      <button
                        className="w-full px-6 py-3 rounded-lg bg-purple-600 text-white disabled:opacity-25 disabled:cursor-not-allowed enabled:hover:bg-purple-700"
                        onClick={() => setSponsorAction("reviewApplication")}
                        disabled={!applicationId || isApplicationReviewed}
                      >
                        {!isApplicationReviewed ? "Review Application" : "Already Reviewed"}
                      </button>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xl font-semibold text-white">Submission ID</p>
                      <input
                        value={submissionId}
                        onChange={(e) => setSubmissionId(e.target.value)}
                        className="w-full p-4 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-purple-600 focus:outline-none text-sm"
                        placeholder="Submission ID"
                      />
                      <button
                        className="w-full px-6 py-3 rounded-lg bg-purple-600 text-white disabled:opacity-25 disabled:cursor-not-allowed enabled:hover:bg-purple-700"
                        onClick={() => setSponsorAction("reviewSubmission")}
                        disabled={!submissionId || !isSubmitted || isSubmissionReviewed}
                      >
                        {!isSubmissionReviewed ? "Review Submission" : "Already Reviewed"}
                      </button>
                    </div>
                  </div>
                </>
              )}
              {sponsorAction === "createGrant" && (
                <>
                  <button className="mb-2 text-white" onClick={() => setSponsorAction("default")}>
                    ← Back
                  </button>
                  <h1 className="text-4xl font-semibold mb-6 text-white">Create Grant 🌱</h1>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <p className="text-xl font-semibold text-white">Name</p>
                      <input
                        value={grantName}
                        onChange={(e) => setGrantName(e.target.value)}
                        className="w-full p-4 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-purple-600 focus:outline-none text-sm"
                        placeholder="Name"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xl font-semibold text-white">Descrtiption</p>
                      <textarea
                        value={grantDescription}
                        onChange={(e) => setGrantDescription(e.target.value)}
                        className="w-full p-4 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-purple-600 focus:outline-none text-sm"
                        placeholder="Description"
                        rows={5}
                      ></textarea>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xl font-semibold text-white">Token</p>
                      <select
                        value={grantToken}
                        onChange={(e) => setGrantToken(e.target.value)}
                        className="w-full p-4 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-purple-600 focus:outline-none text-sm"
                      >
                        {Object.keys(symbolToAddress).map((symbol) => (
                          <option key={symbol} value={symbol}>
                            {symbol}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xl font-semibold text-white">Amount</p>
                      <input
                        value={grantAmount}
                        onChange={(e) => setGrantAmount(e.target.value)}
                        className="w-full p-4 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-purple-600 focus:outline-none text-sm"
                        placeholder="Amount"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xl font-semibold text-white">Strategy</p>
                      <input
                        value={grantStrategy}
                        onChange={(e) => setGrantStrategy(e.target.value)}
                        className="w-full p-4 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-purple-600 focus:outline-none text-sm"
                        placeholder="Strategy"
                        disabled={true}
                      />
                    </div>
                    <div className="space-y-2 mt-4">
                      <label className="flex items-center space-x-3 text-white text-sm">
                        <input
                          type="checkbox"
                          checked={isCarbonOffsetEnabled}
                          onChange={() => setIsCarbonOffsetEnabled(!isCarbonOffsetEnabled)}
                          className="form-checkbox bg-gray-800 border border-gray-700 focus:ring-purple-600 rounded"
                        />
                        <span>Enable 10% Carbon Offset 🌱</span>
                      </label>
                    </div>
                    <button
                      className="w-full px-6 py-3 rounded-lg bg-purple-600 text-white disabled:opacity-25 disabled:cursor-not-allowed enabled:hover:bg-purple-700"
                      disabled={!isCarbonOffsetEnabled}
                      onClick={async () => {
                        if (!userAddress || !alloCoreContract || !alloRegistryContract) {
                          showToast({
                            message: "Please connect your wallet and ensure it is set to the Goerli testnet.",
                          });
                          return;
                        }

                        try {
                          if (grantToken !== "ETH") {
                            throw new Error("Only ETH is integrated for demo due to testnet limitations, sorry!");
                          }
                          debug.start();
                          debug.log(`Sponsor: ${userAddress}`);
                          debug.log("Sponsor: createProfile");
                          const createProfileMetadtaCID = await web3StorageClient.put([
                            new File(
                              [
                                new Blob([JSON.stringify({ name: "Pool Creator Profile" })], {
                                  type: "application/json",
                                }),
                              ],
                              "metadata.json",
                            ),
                          ]);
                          debug.log("createProfileMetadtaCID", createProfileMetadtaCID);
                          // use random nance for easy demo
                          const randomNonce = ethers.utils.randomBytes(32);
                          const createSponsorProfileTx = await alloRegistryContract.createProfile(
                            randomNonce,
                            "Pool Creator Profile",
                            {
                              protocol: 1,
                              pointer: createProfileMetadtaCID,
                            },
                            userAddress,
                            [],
                          );
                          debug.log("createSponsorProfileTx.hash", createSponsorProfileTx.hash);

                          const createSponsorProfileReceipt = await createSponsorProfileTx.wait();
                          const sponsorProfileId =
                            createSponsorProfileReceipt.events?.[createSponsorProfileReceipt.events.length - 1].args
                              ?.profileId;
                          const sponsorAlloAnchorAddress =
                            createSponsorProfileReceipt.events?.[createSponsorProfileReceipt.events.length - 1].args
                              ?.anchor;

                          debug.log("sponsorProfileId", sponsorProfileId);
                          debug.log("sponsorAlloAnchorAddress", sponsorAlloAnchorAddress);

                          debug.log("Sponsor: deploy DirectGrantsSimpleStrategy");
                          const directGrantsSimpleStrategy = await deployDirectGrantsSimpleStrategy();

                          debug.log("Sponsor: createPoolWithCustomStrategy");
                          const createPoolMetadtaCID = await web3StorageClient.put([
                            new File(
                              [
                                new Blob(
                                  [JSON.stringify({ grantName, grantDescription, grantAmount, isCarbonOffsetEnabled })],
                                  {
                                    type: "application/json",
                                  },
                                ),
                              ],
                              "metadata.json",
                            ),
                          ]);
                          debug.log("createPoolMetadtaCID", createPoolMetadtaCID);
                          const createPoolTx = await alloCoreContract.createPoolWithCustomStrategy(
                            sponsorProfileId,
                            directGrantsSimpleStrategy.address,
                            // Encode data for (bool _registryGating, bool _metadataRequired, bool _grantAmountRequired)
                            ethers.utils.defaultAbiCoder.encode(["bool", "bool", "bool"], [true, true, false]),
                            symbolToAddress[grantToken],
                            ethers.utils.parseEther(grantAmount),
                            { protocol: 1, pointer: createPoolMetadtaCID },
                            [],
                            { value: ethers.utils.parseEther(grantAmount) },
                          );
                          debug.log("createPoolTx.hash", createPoolTx.hash);

                          const createPoolRecipt = await createPoolTx.wait();
                          const grantId = createPoolRecipt.events?.[createPoolRecipt.events.length - 1].args?.poolId;
                          debug.log("grantId", grantId);
                          setGrantId(grantId);
                          setModalTitle("Grant Created");
                          setModalDescription("Your grant has been created successfully!");
                          setIsModalOpen(true);
                        } catch (e: any) {
                          showToast({ message: e.message });
                        } finally {
                          debug.end();
                        }
                      }}
                    >
                      Create
                    </button>
                  </div>
                </>
              )}
              {sponsorAction === "reviewApplication" && (
                <>
                  <button className="mb-2 text-white" onClick={() => setSponsorAction("default")}>
                    ← Back
                  </button>
                  <h1 className="text-4xl font-semibold mb-6 text-white">Review Application</h1>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h2 className="text-xl font-semibold text-white">Grant Name</h2>
                      <p className="text-sm text-white">{grantName}</p>
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-xl font-semibold text-white">Grant Description</h2>
                      <p className="text-sm text-white">{grantDescription}</p>
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-xl font-semibold text-white">Grant Amount</h2>
                      <p className="text-sm text-white">
                        {grantAmount} {grantToken}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-xl font-semibold text-white">Grant Strategy</h2>
                      <p className="text-sm text-white">{grantStrategy}</p>
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-xl font-semibold text-white">10% Carbon Offset Enabled 🌱</h2>
                      <p className="text-sm text-white">{isCarbonOffsetEnabled.toString()}</p>
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-xl font-semibold text-white">Team Name</h2>
                      <p className="text-sm text-white">{teamName}</p>
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-xl font-semibold text-white">Team Description</h2>
                      <p className="text-sm text-white">{teamDescription}</p>
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-sm text-xl font-semibold text-white">Team Members</h2>
                      <ul>
                        {teamMembers.map((member, index) => (
                          <li key={index} className="text-sm text-white">
                            {member}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button
                      className="w-full px-6 py-3 rounded-lg bg-purple-600 text-white disabled:opacity-25 disabled:cursor-not-allowed enabled:hover:bg-purple-700"
                      onClick={async () => {
                        if (!userAddress || !alloCoreContract || !alloRegistryContract) {
                          showToast({
                            message: "Please connect your wallet and ensure it is set to the Goerli testnet.",
                          });
                          return;
                        }
                        try {
                          debug.start();
                          debug.log(`Sponsor: ${userAddress}`);
                          debug.log("Sponsor: allocate");
                          const [grantId, recipientId] = applicationId.split(":");
                          const allocateTx = await alloCoreContract.allocate(
                            grantId,
                            // Encode for (address recipientId, InternalRecipientStatus recipientStatus, uint256 grantAmount)
                            ethers.utils.defaultAbiCoder.encode(
                              ["address", "uint256", "uint256"],
                              [recipientId, utils.STATUS.ACCEPTED, ethers.utils.parseEther(grantAmount)],
                            ),
                          );
                          debug.log("allocateTx.hash", allocateTx.hash);
                          await allocateTx.wait();
                          setIsApplicationReviewed(true);
                          setModalTitle("Application Confirmed");
                          setModalDescription("You've successfully confirmed the application!");
                          setIsModalOpen(true);
                        } catch (e: any) {
                          showToast({ message: e.message });
                        } finally {
                          debug.end();
                        }
                      }}
                    >
                      Confirm Application
                    </button>
                  </div>
                </>
              )}
              {sponsorAction === "reviewSubmission" && (
                <>
                  <button className="mb-2 text-white" onClick={() => setSponsorAction("default")}>
                    ← Back
                  </button>
                  <h1 className="text-4xl font-semibold mb-6 text-white">Review Submission</h1>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h2 className="text-xl font-semibold text-white">Team Name</h2>
                      <p className="text-sm text-white">{teamName}</p>
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-xl font-semibold text-white">Team Description</h2>
                      <p className="text-sm text-white">{teamDescription}</p>
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-xl font-semibold text-white">Team Members</h2>
                      <ul className="list-disc pl-5">
                        {teamMembers.map((member, index) => (
                          <li key={index} className="text-sm text-white">
                            {member}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-xl font-semibold text-white">Reference URL</h2>
                      <p className="text-sm">
                        <a href={referenceURL} target="_blank" rel="noopener noreferrer" className="text-purple-600">
                          {referenceURL}
                        </a>
                      </p>
                    </div>
                    <button
                      className="w-full px-6 py-3 rounded-lg bg-purple-600 text-white disabled:opacity-25 disabled:cursor-not-allowed enabled:hover:bg-purple-700"
                      onClick={async () => {
                        if (
                          !userAddress ||
                          !alloCoreContract ||
                          !directGrantsSimpleStrategy ||
                          !carbonOffset ||
                          !hyperCert
                        ) {
                          showToast({
                            message: "Please connect your wallet and ensure it is set to the Goerli testnet.",
                          });
                          return;
                        }
                        try {
                          debug.start();
                          debug.log(`Sponsor: ${userAddress}`);
                          debug.log("Sponsor: distribute");
                          const distributeTx = await alloCoreContract.distribute(
                            grantId,
                            [applicantId],
                            utils.NULL_BYTES,
                          );
                          debug.log("distributeTx.hash", distributeTx.hash);
                          await distributeTx.wait();

                          debug.log("Sponsor: purchaseCarbonOffset");
                          const purchaseCarbonOffsetTx = await carbonOffset.purchase({
                            value: ethers.utils.parseEther(grantAmount).mul(10).div(100),
                          });
                          debug.log("purchaseCarbonOffsetTx.hash", purchaseCarbonOffsetTx.hash);
                          purchaseCarbonOffsetTx.wait();

                          debug.log("Sponsor: verifyCarbonOffsetTxAndCreateCO2StorageData");
                          const response = await fetch("/api/verifyCarbonOffsetTxAndCreateCO2StorageData", {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ hash: purchaseCarbonOffsetTx.hash, grantId }),
                          });
                          if (!response.ok) {
                            throw new Error("Network response was not ok");
                          }
                          const {
                            result: { assetId },
                          } = await response.json();
                          debug.log("CO2 Storage Asset ID", assetId);

                          const sdk = await import("@hypercerts-org/sdk");
                          const { formatHypercertData, TransferRestrictions } = sdk;

                          const { data: metadata } = formatHypercertData({
                            name: "Auto Green Grant",
                            description:
                              "Auto Green Grant Contributor, Please check external URL to check the data on CO2.storage",
                            external_url: `https://co2.storage/assets/${assetId}`, // link to co2.storage asset
                            version: "0.0.1",
                            image: defaultImage, // image generation is out of scope, so use static image
                            workScope: ["GreenGrant"],
                            excludedWorkScope: [],
                            impactScope: ["All"], // Asset id witch has
                            excludedImpactScope: [], // out of scope
                            workTimeframeStart: new Date().getTime() / 1000, // use current
                            workTimeframeEnd: new Date().getTime() / 1000, // use current
                            impactTimeframeStart: new Date().getTime() / 1000, // use current
                            impactTimeframeEnd: new Date().getTime() / 1000, // use current
                            contributors: teamMembers, // add members
                            rights: [], // out of scope
                            excludedRights: [], // out of scope
                          });
                          if (!metadata) {
                            throw new Error("Hypercert metadata invalid");
                          }
                          console.log(metadata);
                          const totalUnits = 5;
                          const transferRestrictions = TransferRestrictions.DisallowAll;

                          const hyperCertMintClaimTx = await hyperCert.mintClaim(
                            metadata,
                            totalUnits,
                            transferRestrictions,
                          );
                          debug.log("hyperCertMintClaimTx.hash", hyperCertMintClaimTx.hash);
                          await hyperCertMintClaimTx.wait();
                          console.log("Sponsor: setPoolActive");
                          const setPoolActiveToFalseTx = await directGrantsSimpleStrategy.setPoolActive(false);
                          debug.log("setPoolActiveToFalseTx.hash", setPoolActiveToFalseTx.hash);
                          await setPoolActiveToFalseTx.wait();

                          setIsSubmissionReviewed(true);
                          setModalTitle("Submission Approved");
                          setModalDescription("The submission has been approved successfully!");
                          setIsModalOpen(true);
                        } catch (e: any) {
                          console.log(e);
                          // showToast({ message: e.message });
                        } finally {
                          debug.end();
                        }
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
                  <div className="space-y-2">
                    <p className="text-xl font-semibold text-white">Grant ID</p>
                    <input
                      value={grantId}
                      onChange={(e) => setGrantId(e.target.value)}
                      placeholder="Enter Grant ID"
                      className="w-full p-4 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-purple-600 focus:outline-none text-sm mb-2"
                    />
                    <button
                      className="w-full px-6 py-3 rounded-lg bg-purple-600 text-white disabled:opacity-25 disabled:cursor-not-allowed enabled:hover:bg-purple-700"
                      onClick={() => setApplicantAction("applyForGrant")}
                      disabled={!grantId}
                    >
                      Apply for Grant
                    </button>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xl font-semibold text-white">Application ID</p>
                    <input
                      value={applicationId}
                      onChange={(e) => setApplicationId(e.target.value)}
                      className="w-full p-4 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-purple-600 focus:outline-none text-sm"
                      placeholder="Application ID"
                    />

                    <button
                      className="w-full px-6 py-3 rounded-lg bg-purple-600 text-white disabled:opacity-25 disabled:cursor-not-allowed enabled:hover:bg-purple-700"
                      onClick={() => setApplicantAction("submitToGrant")}
                      disabled={!applicationId || !isApplicationReviewed || isSubmitted}
                    >
                      {!isSubmitted ? "Submit to Grant" : "Already Submitted"}
                    </button>
                  </div>
                </div>
              )}
              {applicantAction === "applyForGrant" && (
                <>
                  <button className="mb-2 text-white" onClick={() => setApplicantAction("default")}>
                    ← Back
                  </button>
                  <h1 className="text-4xl font-semibold mb-6 text-white">Apply for Grant</h1>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h2 className="text-xl font-semibold text-white">Grant Name</h2>
                      <p className="text-sm text-white">{grantName}</p>
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-xl font-semibold text-white">Grant Description</h2>
                      <p className="text-sm text-white">{grantDescription}</p>
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-xl font-semibold text-white">Grant Amount</h2>
                      <p className="text-sm text-white">
                        {grantAmount} {grantToken}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-xl font-semibold text-white">Grant Strategy</h2>
                      <p className="text-sm text-white">{grantStrategy}</p>
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-xl font-semibold text-white">10% Carbon Offset Enabled 🌱</h2>
                      <p className="text-sm text-white">{isCarbonOffsetEnabled.toString()}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xl font-semibold text-white">Team Name</p>
                      <input
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        placeholder="Team Name"
                        className="w-full p-4 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-purple-600 focus:outline-none text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xl font-semibold text-white">Team Description</p>
                      <textarea
                        value={teamDescription}
                        onChange={(e) => setTeamDescription(e.target.value)}
                        placeholder="Team Description"
                        className="w-full p-4 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-purple-600 focus:outline-none text-sm"
                        rows={5}
                      ></textarea>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xl font-semibold text-white">Team Members</p>
                      <div className="space-y-4">
                        {teamMembers.map((member, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <input
                              value={member}
                              onChange={(e) => updateTeamMember(index, e.target.value)}
                              placeholder={`Member ${index + 1} Name`}
                              className="flex-grow p-4 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-purple-600 focus:outline-none text-sm"
                            />
                            {teamMembers.length > 1 && (
                              <button
                                className="text-red-500 hover:text-red-600"
                                onClick={() => removeTeamMember(index)}
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        ))}
                        <button className="text-purple-600 hover:underline" onClick={addTeamMember}>
                          + Add Member
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xl font-semibold text-white">Drip Address (Optional)</p>
                      <input
                        value={dripAddress}
                        onChange={(e) => setDripAddress(e.target.value)}
                        placeholder="Team Name"
                        className="w-full p-4 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-purple-600 focus:outline-none text-sm"
                      />
                    </div>
                    <button
                      className="w-full px-6 py-3 rounded-lg bg-purple-600 text-white disabled:opacity-25 disabled:cursor-not-allowed enabled:hover:bg-purple-700"
                      onClick={async () => {
                        if (!userAddress || !alloCoreContract || !alloRegistryContract) {
                          showToast({
                            message: "Please connect your wallet and ensure it is set to the Goerli testnet.",
                          });
                          return;
                        }
                        try {
                          if (dripAddress && grantToken === "ETH") {
                            throw new Error("Drip address can only be used with ERC20 tokens, sorry!");
                          }
                          debug.start();
                          debug.log(`Applicant: ${userAddress}`);
                          debug.log("Applicant: createProfile");

                          const createProfileMetadtaCID = await web3StorageClient.put([
                            new File(
                              [
                                new Blob([JSON.stringify({ name: "Applicant Profile" })], {
                                  type: "application/json",
                                }),
                              ],
                              "metadata.json",
                            ),
                          ]);
                          debug.log("createProfileMetadtaCID", createProfileMetadtaCID);
                          // use random nance for easy demo
                          const randomNance = ethers.utils.randomBytes(32);
                          const createApplicantProfileTx = await alloRegistryContract.createProfile(
                            randomNance,
                            "Applicant Profile",
                            { protocol: 1, pointer: createProfileMetadtaCID },
                            userAddress,
                            teamMembers.filter((v) => v),
                          );
                          debug.log("createApplicantProfileTx.hash", createApplicantProfileTx.hash);
                          const createApplicantProfileReceipt = await createApplicantProfileTx.wait();
                          const applicantProfileId =
                            createApplicantProfileReceipt.events?.[createApplicantProfileReceipt.events.length - 1].args
                              ?.profileId;
                          const applicantAlloAnchorAddress =
                            createApplicantProfileReceipt.events?.[createApplicantProfileReceipt.events.length - 1].args
                              ?.anchor;

                          debug.log("applicantProfileId", applicantProfileId);
                          debug.log("applicantAlloAnchorAddress", applicantAlloAnchorAddress);

                          debug.log("Applicant: registerRecipient");
                          const registerRecipientMetadtaCID = await web3StorageClient.put([
                            new File(
                              [
                                new Blob(
                                  [
                                    JSON.stringify({
                                      teamName,
                                      teamDescription,
                                      teamMembers: !teamMembers.includes(userAddress)
                                        ? [userAddress, ...teamMembers.filter((v) => v)]
                                        : teamMembers.filter((v) => v),
                                    }),
                                  ],
                                  {
                                    type: "application/json",
                                  },
                                ),
                              ],
                              "metadata.json",
                            ),
                          ]);
                          debug.log("registerRecipientMetadtaCID", registerRecipientMetadtaCID);
                          const registerRecipientTx = await alloCoreContract.registerRecipient(
                            grantId,
                            // Encode data for (address recipientId, address recipientAddress, uint256 grantAmount, Metadata metadata)
                            ethers.utils.defaultAbiCoder.encode(
                              ["address", "address", "uint256", "tuple(uint256, string)"],
                              [
                                applicantAlloAnchorAddress,
                                dripAddress ? dripAddress : userAddress, // here user can use drip address as recipient address
                                0,
                                [1, registerRecipientMetadtaCID],
                              ],
                            ),
                          );
                          debug.log("registerRecipientTx.hash", registerRecipientTx.hash);
                          await registerRecipientTx.wait();

                          const applicationId = `${grantId}:${applicantAlloAnchorAddress}`;
                          debug.log("applicationId", applicationId);
                          setApplicantId(applicantAlloAnchorAddress);
                          setApplicationId(applicationId);
                          setModalTitle("Application Submitted");
                          setModalDescription("Your application has been submitted successfully!");
                          setIsModalOpen(true);
                        } catch (e: any) {
                          showToast({ message: e.message });
                        } finally {
                          debug.end();
                        }
                      }}
                    >
                      Submit Application
                    </button>
                  </div>
                </>
              )}
              {applicantAction === "submitToGrant" && (
                <>
                  <button className="mb-2 text-white" onClick={() => setApplicantAction("default")}>
                    ← Back
                  </button>
                  <h1 className="text-4xl font-semibold mb-6 text-white">Submit to Grant</h1>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h2 className="text-xl font-semibold text-white">Grant Name</h2>
                      <p className="text-sm text-white">{grantName}</p>
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-xl font-semibold text-white">Grant Description</h2>
                      <p className="text-sm text-white">{grantDescription}</p>
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-xl font-semibold text-white">Grant Amount</h2>
                      <p className="text-sm text-white">
                        {grantAmount} {grantToken}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-xl font-semibold text-white">Grant Strategy</h2>
                      <p className="text-sm text-white">{grantStrategy}</p>
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-xl font-semibold text-white">10% Carbon Offset Enabled 🌱</h2>
                      <p className="text-sm text-white">{isCarbonOffsetEnabled.toString()}</p>
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-xl font-semibold text-white">Team Name</h2>
                      <p className="text-sm text-white">{teamName}</p>
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-xl font-semibold text-white">Team Description</h2>
                      <p className="text-sm text-white">{teamDescription}</p>
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-sm text-xl font-semibold text-white">Team Members</h2>
                      <ul>
                        {teamMembers.map((member, index) => (
                          <li key={index} className="text-sm text-white">
                            {member}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-xl font-semibold text-white">Reference URL</h2>
                      <input
                        value={referenceURL}
                        onChange={(e) => setReferenceURL(e.target.value)}
                        placeholder="Reference URL"
                        className="w-full p-4 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-purple-600 focus:outline-none text-sm"
                      />
                    </div>
                    <button
                      className="w-full px-6 py-3 rounded-lg bg-purple-600 text-white disabled:opacity-25 disabled:cursor-not-allowed enabled:hover:bg-purple-700"
                      onClick={async () => {
                        if (!directGrantsSimpleStrategy) {
                          return;
                        }
                        try {
                          debug.start();
                          debug.log(`Applicant: ${userAddress}`);
                          debug.log("Applicant: setMilestones");
                          // Just create sigle milestone for demo
                          const setMilestonesMetadtaCID = await web3StorageClient.put([
                            new File(
                              [
                                new Blob([JSON.stringify({ name: "Dummy Milestone To Process" })], {
                                  type: "application/json",
                                }),
                              ],
                              "metadata.json",
                            ),
                          ]);
                          debug.log("setMilestonesMetadtaCID", setMilestonesMetadtaCID);
                          const setMilestonesTx = await directGrantsSimpleStrategy.setMilestones(applicantId, [
                            {
                              amountPercentage: utils.AMOUNT_PERCENTAGE_BASE,
                              metadata: { protocol: 1, pointer: setMilestonesMetadtaCID },
                              milestoneStatus: utils.STATUS.NONE,
                            },
                          ]);
                          debug.log("setMilestonesTx.hash", setMilestonesTx.hash);
                          await setMilestonesTx.wait();

                          debug.log("Applicant: submitMilestone");
                          const submitMilestoneMetadtaCID = await web3StorageClient.put([
                            new File(
                              [
                                new Blob([JSON.stringify({ referenceURL })], {
                                  type: "application/json",
                                }),
                              ],
                              "metadata.json",
                            ),
                          ]);
                          debug.log("submitMilestoneMetadtaCID", submitMilestoneMetadtaCID);
                          const milestoneId = 0;
                          const submitMilestoneTx = await directGrantsSimpleStrategy.submitMilestone(
                            applicantId,
                            milestoneId,
                            {
                              protocol: 1,
                              pointer: submitMilestoneMetadtaCID,
                            },
                          );
                          await submitMilestoneTx.wait();

                          const submissionId = `${grantId}:${applicantId}:${milestoneId}`;
                          setIsSubmitted(true);
                          setMilestoneId(milestoneId);
                          setSubmissionId(submissionId);
                          setModalTitle("Submission Complete");
                          setModalDescription("Your reference has been submitted successfully!");
                          setIsModalOpen(true);
                        } catch (e: any) {
                          showToast({ message: e.message });
                        } finally {
                          debug.end();
                        }
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
          <div className="bg-gradient-to-br from-gray-700 to-gray-950 px-8 py-6 rounded-lg shadow-2xl w-full max-w-md z-10 space-y-4">
            <h2 className="text-2xl font-semibold text-white">{modalTitle}</h2>
            <p className="text-white">{modalDescription}</p>
            <button className="w-full p-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

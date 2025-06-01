import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { ErrorDecoder } from "ethers-decode-error";
import CertificateABI from "./Certificate.json";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

// Prepare the decoder with your contract’s ABI
const errorDecoder = ErrorDecoder.create([CertificateABI.abi]);

export default function App() {
    const [account, setAccount] = useState("");
    const [contract, setContract] = useState(null);
    const [certIds, setCertIds] = useState([]);
    const [certData, setCertData] = useState({});
    const [name, setName] = useState("");
    const [course, setCourse] = useState("");

    // 1. Connect wallet & instantiate contract
    async function connectWallet() {
        if (!window.ethereum) {
            return alert("Please install MetaMask");
        }
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        setAccount(await signer.getAddress());

        const contractInstance = new ethers.Contract(
            CONTRACT_ADDRESS,
            CertificateABI.abi,
            signer
        );
        setContract(contractInstance);

        // Immediately load existing certificates
        const countBigInt = await contractInstance.getCertificateCount();
        const count = Number(countBigInt); // Convert BigInt to JS number :contentReference[oaicite:0]{index=0}
        setCertIds(Array.from({ length: count }, (_, i) => i));
    }

    // 2. Issue a certificate (onlyOwner)
    async function issueCertificate() {
        if (!contract) return;
        try {
            const tx = await contract.issueCertificate(name, course);
            await tx.wait();
            alert("Certificate issued!");

            setName("");
            setCourse("");

            // Refresh the list
            const countBigInt = await contract.getCertificateCount();
            const count = Number(countBigInt);
            setCertIds(Array.from({ length: count }, (_, i) => i));
        } catch (err) {
            let message = err.message;
            try {
                const decoded = await errorDecoder.decode(err);
                if (decoded.name === "OwnableUnauthorizedAccount") {
                    message = "Only the contract owner can issue certificates.";
                }
            } catch {
                /* fallback */
            }
            alert(message);
        }
    }

    // 3. Fetch total certificates (view, no gas)
    async function fetchCertificateCount() {
        if (!contract) return;
        const countBigInt = await contract.getCertificateCount();
        const count = Number(countBigInt);
        setCertIds(Array.from({ length: count }, (_, i) => i));
    }

    useEffect(() => {
        if (contract) {
            fetchCertificateCount();
        }
    }, [contract]);

    // 4. Verify a certificate by ID
    async function verify(id) {
        if (!contract) return;
        const c = await contract.viewCertificate(BigInt(id));
        // Convert the returned BigInt timestamp to a JS number before using Date
        const timestamp = Number(c.dateOfIssue) * 1000;
        setCertData((prev) => ({
            ...prev,
            [id]: {
                studentName: c.studentName,
                courseName: c.courseName,
                date: new Date(timestamp).toLocaleString(), // Now safe
                issuer: c.issuer,
            },
        }));
    }

    return (
        <div style={{ padding: 20 }}>
            <h1>Certificate DApp</h1>

            {!account ? (
                <button onClick={connectWallet}>Connect Wallet</button>
            ) : (
                <p>Connected: {account}</p>
            )}

            <h2>Issue Certificate</h2>
            <input
                placeholder="Student Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                placeholder="Course Name"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
            />
            <button onClick={issueCertificate}>Issue</button>

            <h2>Certificates</h2>
            {certIds.length === 0 ? (
                <p>No certificates issued yet.</p>
            ) : (
                <ul>
                    {certIds.map((id) => (
                        <li key={id}>
                            ID #{id}{" "}
                            <button onClick={() => verify(id)}>Verify</button>
                            {certData[id] && (
                                <div style={{ marginLeft: 20 }}>
                                    <p>
                                        <strong>Student:</strong>{" "}
                                        {certData[id].studentName}
                                    </p>
                                    <p>
                                        <strong>Course:</strong>{" "}
                                        {certData[id].courseName}
                                    </p>
                                    <p>
                                        <strong>Date:</strong>{" "}
                                        {certData[id].date}
                                    </p>
                                    <p>
                                        <strong>Issuer:</strong>{" "}
                                        {certData[id].issuer}
                                    </p>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

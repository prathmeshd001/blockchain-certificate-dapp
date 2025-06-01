// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Certificate is Ownable {
    constructor() Ownable(msg.sender) {}

    struct Cert {
        string studentName;
        string courseName;
        uint256 dateOfIssue;
        address issuer;
    }

    Cert[] public certificates;
    event CertificateIssued(uint256 certId, address issuedTo);

    function issueCertificate(
        string memory name,
        string memory course
    ) public onlyOwner {
        require(bytes(name).length > 0, "Invalid student name");
        require(bytes(course).length > 0, "Invalid course name");
        certificates.push(Cert(name, course, block.timestamp, msg.sender));
        emit CertificateIssued(certificates.length - 1, msg.sender);
    }

    function getCertificateCount() public view returns (uint256) {
        return certificates.length;
    }

    function viewCertificate(uint256 id) public view returns (Cert memory) {
        require(id < certificates.length, "No such certificate");
        return certificates[id];
    }
}

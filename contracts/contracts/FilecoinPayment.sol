// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title FilecoinPayment
 * @notice Escrow-based payment for decentralized storage
 */
contract FilecoinPayment is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public immutable token;
    
    enum Status { PENDING, VERIFIED, RELEASED, REFUNDED }
    
    struct Payment {
        address user;
        address provider;
        string cid;
        uint256 amount;
        uint256 timestamp;
        Status status;
    }
    
    mapping(string => Payment) public payments;
    mapping(address => bool) public verifiers;
    
    event Deposited(string indexed cid, address indexed user, uint256 amount);
    event Verified(string indexed cid);
    event Released(string indexed cid, address indexed provider, uint256 amount);
    
    constructor(address _token) Ownable(msg.sender) {
        token = IERC20(_token);
        verifiers[msg.sender] = true;
    }
    
    function deposit(string memory cid, uint256 amount) external nonReentrant {
        require(bytes(payments[cid].cid).length == 0, "Payment exists");
        
        token.safeTransferFrom(msg.sender, address(this), amount);
        
        payments[cid] = Payment({
            user: msg.sender,
            provider: address(0),
            cid: cid,
            amount: amount,
            timestamp: block.timestamp,
            status: Status.PENDING
        });
        
        emit Deposited(cid, msg.sender, amount);
    }
    
    function verify(string memory cid, address provider) external {
        require(verifiers[msg.sender], "Not verifier");
        Payment storage p = payments[cid];
        require(p.status == Status.PENDING, "Invalid status");
        
        p.provider = provider;
        p.status = Status.VERIFIED;
        
        emit Verified(cid);
    }
    
    function release(string memory cid) external nonReentrant {
        require(verifiers[msg.sender], "Not verifier");
        Payment storage p = payments[cid];
        require(p.status == Status.VERIFIED, "Not verified");
        
        p.status = Status.RELEASED;
        token.safeTransfer(p.provider, p.amount);
        
        emit Released(cid, p.provider, p.amount);
    }
    
    function addVerifier(address verifier) external onlyOwner {
        verifiers[verifier] = true;
    }
    
    function getPayment(string memory cid) external view returns (Payment memory) {
        return payments[cid];
    }
}

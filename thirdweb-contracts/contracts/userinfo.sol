// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UserProfile {
    
    // Struct to hold user profile information
    struct User {
        string name;
        string status; // company or candidate
        address walletAddress;
        uint256 lastUpdated;
    }
    
    // Mapping to store user profile by address
    mapping (address => User) private users;
    
    // Event that is emitted when a user's profile is created or updated
    event UserProfileUpdated(address userAddress, string name, string status);
    
    // Modifier to check if the user is already registered
    modifier onlyRegisteredUser() {
        require(bytes(users[msg.sender].name).length != 0, "User not registered.");
        _;
    }
    
    // Function to register a new user
    function registerUser(string memory _name, string memory _status) public {
        require(bytes(users[msg.sender].name).length == 0, "User already registered.");
        
        users[msg.sender] = User({
            name: _name,
            status: _status,
            walletAddress: msg.sender,
            lastUpdated: block.timestamp
        });
        
        emit UserProfileUpdated(msg.sender, _name, _status);
    }
    
    // Function to update an existing user profile
    function updateUser(string memory _name, string memory _status) public onlyRegisteredUser {
        users[msg.sender].name = _name;
        users[msg.sender].status = _status;
        users[msg.sender].lastUpdated = block.timestamp;
        
        emit UserProfileUpdated(msg.sender, _name, _status);
    }
    
    // Function to get the user profile details
    function getUser(address userAddress) public view returns (string memory name, string memory status, address walletAddress) {
        require(bytes(users[userAddress].name).length != 0, "User not found.");
        return (users[userAddress].name, users[userAddress].status, users[userAddress].walletAddress);
    }
}
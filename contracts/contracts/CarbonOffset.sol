// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract CarbonOffset {

    event Purchase(address indexed _buyer, uint256 _amount);
    address public recipient;


   constructor(address _recipient) {
        recipient = _recipient;
    }
    
    function purchase() public payable {
        payable(recipient).transfer(msg.value);
        emit Purchase(msg.sender, msg.value);
    }

}

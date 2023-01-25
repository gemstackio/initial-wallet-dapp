//SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract WalletProj is ERC721{
    // Withdrawals only in the amount that was deposited by the person who likes to withdraw
    address owner;
    // take deposits from everyone

    mapping(address => bool) public whitelistedAddresses;

    modifier onlyOwner(){
        require(msg.sender == owner, "Must be contract owner");
        _;
    }

    modifier contractHasValidBalance(uint256 _transferAmount){
        require(address(this).balance >= _transferAmount, "Contract must have a balance greater than or equal to the amount being transferred");
        _;
    }

    modifier addressIsNotWhiteListed(address _address){
        require(!whitelistedAddresses[_address], "Address already whitelisted");
        _;
    }

    constructor(string memory _name, string memory _symbol)
        ERC721(_name, _symbol)
    {
        owner = msg.sender;
    }

    function depositToContract() public payable{}

    function getTotalContractAmount() public view returns(uint){
        return address(this).balance;
    }

    function transferAll() public onlyOwner {
        payable(msg.sender).transfer(this.getTotalContractAmount()); // send the amount in the smart contract back to the account requesting all funds
    }

    function transferAmountFromContract(uint _transferAmount, address _someone)
    public
    onlyOwner
    contractHasValidBalance(_transferAmount)
    {
        payable(_someone).transfer(_transferAmount);
    }

    function addAddressToWhitelist(address _address) public onlyOwner addressIsNotWhiteListed(_address){
        require(_address != address(0), "Invalid address");

        whitelistedAddresses[_address] = true;
    }

    function removeAddressFromWhitelist(address _address) public onlyOwner {
        require(whitelistedAddresses[_address], "Address not found in whitelist");
        delete whitelistedAddresses[_address];
    }

    function checkIfWhitelisted(address _address) public view returns (bool) {
        return whitelistedAddresses[_address];
    }

    // can also do this too, might be the better way:
    // function getTotalContractAmount2()public view returns(uint){
    //     return address(this).balance;
    // }


    // fallback and receive functions in case someone wishes to send
    receive() external payable{

    }

    fallback() external payable{

    }

}
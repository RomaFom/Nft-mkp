// SPDX-Licence-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter public tokenCount;

    constructor() ERC721("DApp NFT","DAPP"){}

    function mint(address recipient, string memory _tokenURI) public onlyOwner returns (uint256) {
        tokenCount.increment();
        uint256 newTokenId = tokenCount.current();
        _mint(recipient, newTokenId);
//        _safeMint(msg.sender,tokenCount);
        _setTokenURI(newTokenId,_tokenURI);
        return newTokenId;
    }

    function getOwner(uint _tokenId) external view returns(address){
        return ownerOf(_tokenId);
    }
}
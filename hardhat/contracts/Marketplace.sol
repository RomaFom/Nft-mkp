// SPDX-Licence-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Marketplace is ReentrancyGuard {
    address payable public feeAccount;
    uint public immutable feePercent;
    uint public itemCount;

    struct Item {
        uint itemId;
        IERC721 nft;
        uint tokenId;
        uint price;
        address payable seller;
        bool isSold;
    }
    event Offered(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller
    );
    event Bought(
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller,
        address indexed buyer
    );
    mapping(uint => Item) public items;

    constructor(uint _feePercent){
        feeAccount = payable(msg.sender);
        feePercent = _feePercent;
    }

    function makeItem(IERC721 _nft,uint _tokenId, uint _price) external nonReentrant{
        require(_price > 0,"Price must be greater than 0");
        itemCount++;
        _nft.transferFrom(msg.sender,address(this),_tokenId);
        items[itemCount] = Item(
        itemCount,
        _nft,
        _tokenId,
        _price,
        payable(msg.sender),
        false
        );
        emit Offered(itemCount,address(_nft),_tokenId,_price,msg.sender);
    }

    function listItem(uint _itemId) external nonReentrant{

    }
    function buyItem(uint _itemId) external payable nonReentrant{
        require(items[_itemId].isSold == false,"Item is already sold");
        require(_itemId>0 && _itemId <= itemCount,"Item does not exist");
        require(items[_itemId].seller != msg.sender,"You cannot buy your own item");
        uint price = getFinalPrice(_itemId);
        Item storage item = items[_itemId];
        require(price <= msg.value,"Not enough money to buy item");
        // Transfer money to seller
        item.seller.transfer(item.price);
        // Transfer fees to fee account
        feeAccount.transfer(price-item.price);
        // Transfer NFT to buyer
        item.nft.transferFrom(address(this),msg.sender,item.tokenId);
        item.isSold = true;
        //emit
        emit Bought(_itemId,address(item.nft),item.tokenId,item.price,item.seller,msg.sender);
    }
    function getFinalPrice(uint _itemId) view public returns(uint){
        return(items[_itemId].price*(100+feePercent)/100);
    }

}


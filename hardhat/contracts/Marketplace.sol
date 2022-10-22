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
        uint listingPrice;
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
        uint listPrice = _price;
        items[itemCount] = Item(
        itemCount,
        _nft,
        _tokenId,
        _price,
        listPrice,
        payable(msg.sender),
        false
        );
        emit Offered(itemCount,address(_nft),_tokenId,_price,msg.sender);
    }

    function listItem(uint _itemId,uint _price) external nonReentrant{
        require(items[_itemId].nft.ownerOf(items[_itemId].tokenId) == msg.sender,"You must own the token to list it");
        require(items[_itemId].isSold == true,"Item is already sold");
        require(_price > 0,"Price must be greater than 0");

        Item storage item = items[_itemId];
        item.listingPrice = _price;

        // Transfer ownership of the token to the marketplace
        item.nft.transferFrom(msg.sender,address(this),item.tokenId);
        item.seller = payable(msg.sender);
        item.isSold = false;
        emit Offered(_itemId,address(item.nft),item.tokenId,_price,msg.sender);
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
        // Set item as sold
        item.isSold = true;
        item.price = item.listingPrice;
//        item.listingPrice = item.price;
        //emit
        emit Bought(_itemId,address(item.nft),item.tokenId,item.price,item.seller,msg.sender);
    }
    function getFinalPrice(uint _itemId) view public returns(uint){
        return(items[_itemId].listingPrice*(100+feePercent)/100);
    }

}


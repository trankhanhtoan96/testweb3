// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
contract GameAGGItemSSS is ERC721{
    using Strings for uint256;
    mapping (uint256 => uint256) public tokenIdToPrice;
    string public domain = "https://demo.khanhtoan.name.vn/token/";
    constructor() ERC721("Game-AGG-TRAI", "TRAI"){}
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory){
        require(_exists(tokenId),"token not available");
        if(bytes(domain).length>0){
            return string(abi.encodePacked(domain,tokenId.toString()));
        } else {
            return "";
        }
    }
    function addNewItem(address player, uint256 tokenId) external{
        _mint(player, tokenId);
    }
    function allowBuy(uint256 _tokenId, uint256 _price) external {
        require(msg.sender == ownerOf(_tokenId), 'Not owner of this token');
        require(_price > 0, 'Price zero');
        tokenIdToPrice[_tokenId] = _price;
        _approve(address(this),_tokenId);
    }

    function disallowBuy(uint256 _tokenId) external {
        require(msg.sender == ownerOf(_tokenId), 'Not owner of this token');
        tokenIdToPrice[_tokenId] = 0;
    }

    function buy(uint256 _tokenId) external payable {
        uint256 price = tokenIdToPrice[_tokenId];
        require(price > 0, 'This token is not for sale');
        require(msg.value == price, 'Incorrect value');

        address seller = ownerOf(_tokenId);
        _transfer(seller, msg.sender, _tokenId);
        tokenIdToPrice[_tokenId] = 0;
        payable(seller).transfer(msg.value);
    }
}

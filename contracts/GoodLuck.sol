// SPDX-License-Identifier: UNLICENSE
pragma solidity ^0.8.0;

import { IGoodLuck } from "./interfaces/IGoodLuck.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract GoodLuck is IGoodLuck {
    
    uint256 internal _gameId;
    uint256 internal _timeLimit;

    mapping(uint256 => Game) internal _games;

    address internal _usdt;

    constructor(address usdt_, uint256 timeLimit_) {
        require(usdt_ != address(0), "Unset USDT address");
        _usdt = usdt_;
        _timeLimit = timeLimit_;
    }

    function createGame(uint256 amount, bytes32 bankerHash) external {
        require(amount > 0, "USDT must be greater than 0");

        _games[_gameId] = Game({
            _banker: msg.sender,
            _player: address(0),
            _amount: amount,
            _bankerHash: bankerHash,
            _bankerChoice: Choice.None,
            _playerChoice: Choice.None,
            _deadline: 0,
            _isSettled: false
        });
        _gameId++;
        IERC20(_usdt).transferFrom(msg.sender, address(this), amount);
    }

    function joinGame(uint256 gameId, Choice palyerChoice) external {
        Game memory game = _games[gameId];
        require(game._player == address(0), "Game already has a player");

        game._player = msg.sender;
        game._playerChoice = palyerChoice;
        game._deadline = block.timestamp + _timeLimit;
        IERC20(_usdt).transferFrom(msg.sender, address(this), game._amount);
    }

    function execute(uint256 gameId, Choice bankerChoice, string memory salt) external {
        Game storage game = _games[gameId];
        require(msg.sender == game._banker, "Only banker can execute");
        require(!game._isSettled, "Game already settled");
        require(block.timestamp <= game._deadline, "Execute period expired");
        require(keccak256(abi.encodePacked(bankerChoice, salt)) == game._bankerHash, "Invalid execute");

        game._bankerChoice = bankerChoice;
        _settleGame(game);
    }

    function settle(uint256 gameId) external {
        Game storage game = _games[gameId];
        require(!game._isSettled, "Game already settled");
        require(block.timestamp > game._deadline, "Execute period not expired");

        // game._bankerChoice = Choice.None; 
        _settleGame(game);
    }

    function _settleGame(Game storage game) internal {
        game._isSettled = true;

        if (game._bankerChoice == Choice.None) {
            // banker did not reveal in time, player wins by default
            IERC20(_usdt).transferFrom(address(this), game._player, 2 * game._amount);
        } else if ((game._bankerChoice == Choice.Rock && game._playerChoice == Choice.Scissors) ||
                   (game._bankerChoice == Choice.Paper && game._playerChoice == Choice.Rock) ||
                   (game._bankerChoice == Choice.Scissors && game._playerChoice == Choice.Paper)) {
            // banker wins
            IERC20(_usdt).transferFrom(address(this), game._banker, 2 * game._amount);
        } else if ((game._playerChoice == Choice.Rock && game._bankerChoice == Choice.Scissors) ||
                   (game._playerChoice == Choice.Paper && game._bankerChoice == Choice.Rock) ||
                   (game._playerChoice == Choice.Scissors && game._bankerChoice == Choice.Paper)) {
            // Player wins
            IERC20(_usdt).transferFrom(address(this), game._player, 2 * game._amount);
        } else {
            // Tie, refund both
            IERC20(_usdt).transferFrom(address(this), game._banker, game._amount);
            IERC20(_usdt).transferFrom(address(this), game._player, game._amount);
        }
    }
}

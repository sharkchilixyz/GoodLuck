// SPDX-License-Identifier: UNLICENSE
pragma solidity ^0.8.0;

import { IGoodLuck } from "./interfaces/IGoodLuck.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { Errors } from "./lib/Errors.sol";

contract GoodLuck is IGoodLuck {
    
    uint256 internal _gameId;
    uint256 internal _timeLimit;

    mapping(uint256 => Game) internal _games;

    address internal _usdt;

    constructor(address usdt_, uint256 timeLimit_) {
        if (usdt_ == address(0)) revert Errors.UnSetUSDTAddress();
        _usdt = usdt_;
        _timeLimit = timeLimit_;
    }

    function createGame(uint256 amount, bytes32 bankerHash) external {
        if (amount == 0) revert Errors.USDTAmountTooSmall();

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
        Game storage game = _games[gameId];
        if (game._player != address(0)) revert Errors.GameAlreadyHasPlayer();

        game._player = msg.sender;
        game._playerChoice = palyerChoice;
        game._deadline = block.timestamp + _timeLimit;
        IERC20(_usdt).transferFrom(msg.sender, address(this), game._amount);
    }

    function execute(uint256 gameId, Choice bankerChoice, string memory salt) external {
        Game storage game = _games[gameId];
        if (msg.sender != game._banker) revert Errors.OnlyBankerCanExecute();
        if (game._isSettled) revert Errors.GameAlreadySettled();
        if(block.timestamp > game._deadline) revert Errors.ExecutePeriodExpired();
        if (keccak256(abi.encodePacked(bankerChoice, salt)) != game._bankerHash) revert Errors.InvalidExecute();

        game._bankerChoice = bankerChoice;
        _settleGame(game);
    }

    function settle(uint256 gameId) external {
        Game storage game = _games[gameId];
        if (game._isSettled) revert Errors.GameAlreadySettled();
        if (block.timestamp <= game._deadline) revert Errors.ExecutePeriodNotExpired();

        // game._bankerChoice = Choice.None; 
        _settleGame(game);
    }

    function setTimeLimit(uint256 timeLimit) external {
        _timeLimit = timeLimit;
    }

    function getGameData(uint256 gameId) external view returns(Game memory) {
        return _games[gameId];
    }

    function getCurrentGameId() external view returns(uint256) {
        return _gameId;
    }

    function getTimeLimit() external view returns(uint256) {
        return _timeLimit;
    }

    function _settleGame(Game storage game) internal {
        game._isSettled = true;

        if (game._bankerChoice == Choice.None) {
            // banker did not reveal in time, player wins by default
            IERC20(_usdt).transfer(game._player, 2 * game._amount);
        } else if ((game._bankerChoice == Choice.Rock && game._playerChoice == Choice.Scissors) ||
                   (game._bankerChoice == Choice.Paper && game._playerChoice == Choice.Rock) ||
                   (game._bankerChoice == Choice.Scissors && game._playerChoice == Choice.Paper)) {
            // banker wins
            IERC20(_usdt).transfer(game._banker, 2 * game._amount);
        } else if ((game._playerChoice == Choice.Rock && game._bankerChoice == Choice.Scissors) ||
                   (game._playerChoice == Choice.Paper && game._bankerChoice == Choice.Rock) ||
                   (game._playerChoice == Choice.Scissors && game._bankerChoice == Choice.Paper)) {
            // Player wins
            IERC20(_usdt).transfer(game._player, 2 * game._amount);
        } else {
            // Tie, refund both
            IERC20(_usdt).transfer(game._banker, game._amount);
            IERC20(_usdt).transfer(game._player, game._amount);
        }
    }
}

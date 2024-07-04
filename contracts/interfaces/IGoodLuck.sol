// SPDX-License-Identifier: UNLICENSE
pragma solidity ^0.8.0;

interface IGoodLuck {
    enum Choice {
        None,
        Rock,
        Paper,
        Scissors
    }

    struct Game {
        address _banker;
        address _player;
        uint256 _amount;
        bytes32 _bankerHash;
        Choice _bankerChoice;
        Choice _playerChoice;
        uint256 _deadline;
        bool _isSettled;
    }

    event CreateGame(uint256 amount, bytes32 bankerHash);

    event JoinGame(uint256 gameId, Choice palyerChoice);

    event Execute(uint256 gameId, Choice bankerChoice, string salt);

    event Settle(uint256 gameId);

    function createGame(uint256 amount, bytes32 bankerHash) external;

    function joinGame(uint256 gameId, Choice palyerChoice) external;

    function execute(uint256 gameId, Choice bankerChoice, string memory salt) external;

    function settle(uint256 gameId) external;

    function getGameData(uint256 gameId) external view returns(Game memory);

    function getCurrentGameId() external view returns(uint256);

}
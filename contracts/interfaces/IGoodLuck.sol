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
        uint256 _deadline;
        uint256 _amount;
        bytes32 _bankerHash;
        Choice _bankerChoice;
        Choice _playerChoice;
        bool _isSettled;
        uint8 _result;// 0 is banker win, 1 is player win, 2 is tie
    }

    event CreateGame(address banker, uint256 gameId, Game game);

    event JoinGame(address player, uint256 gameId, Game game);

    event SettleGame(address executor, uint256 gameId, Game game);

    function createGame(uint256 amount, bytes32 bankerHash) external;

    function joinGame(uint256 gameId, Choice palyerChoice) external;

    function execute(uint256 gameId, Choice bankerChoice, string memory salt) external;

    function settle(uint256 gameId) external;

    function getGameData(uint256 gameId) external view returns(Game memory);

    function getCurrentGameId() external view returns(uint256);

}
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
}
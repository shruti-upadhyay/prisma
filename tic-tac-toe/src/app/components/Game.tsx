"use client";

import { useState } from "react";

const Game = () => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);

    const handleClick = (index: number) => {
        if (board[index] || calculateWinner(board)) return;

        const newBoard = [...board];
        newBoard[index] = isXNext ? "X" : "O";
        setBoard(newBoard);
        setIsXNext(!isXNext);
    };

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setIsXNext(true);
    };

    const winner = calculateWinner(board);
    const status = winner
        ? `Winner: ${winner}`
        : `Next player: ${isXNext ? "X" : "O"}`;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.welcome}>Welcome to Tic Tac Toe!</h1>
            </div>
            <div style={styles.status}>{status}</div>
            <div style={styles.board}>
                {board.map((cell, index) => (
                    <div
                        key={index}
                        style={styles.cell}
                        onClick={() => handleClick(index)}
                    >
                        {cell}
                    </div>
                ))}
            </div>
            <button onClick={resetGame} style={styles.resetButton}>
                Reset
            </button>
        </div>
    );
};

const calculateWinner = (board: string[]) => {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let line of lines) {
        const [a, b, c] = line;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a]; // Return the winner ('X' or 'O')
        }
    }
    return null;
};

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh", // Full viewport height
        textAlign: "center", // Center text horizontally
    },
    header: {
        marginBottom: "20px", // Space between the welcome text and game board
    },
    welcome: {
        fontSize: "32px",
        fontWeight: "bold",
    },
    status: {
        fontSize: "20px",
        marginBottom: "20px",
    },
    board: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 100px)",
        gridTemplateRows: "repeat(3, 100px)",
        gap: "5px",
        marginBottom: "20px",
    },
    cell: {
        width: "100px",
        height: "100px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: "2px solid black",
        fontSize: "24px",
        cursor: "pointer",
    },
    resetButton: {
        padding: "10px 20px",
        fontSize: "16px",
        cursor: "pointer",
    },
};

export default Game;

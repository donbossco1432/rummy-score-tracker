import { useState, useEffect } from "react";

export default function Home() {
    const [players, setPlayers] = useState([]);
    const [scores, setScores] = useState({});
    const [reentries, setReentries] = useState({});
    const [round, setRound] = useState(1);

    useEffect(() => {
        const storedPlayers = JSON.parse(localStorage.getItem("players")) || [];
        const storedScores = JSON.parse(localStorage.getItem("scores")) || {};
        const storedReentries =
            JSON.parse(localStorage.getItem("reentries")) || {};
        const storedRound = parseInt(localStorage.getItem("round")) || 1;
        setPlayers(storedPlayers);
        setScores(storedScores);
        setReentries(storedReentries);
        setRound(storedRound);
    }, []);

    useEffect(() => {
        localStorage.setItem("players", JSON.stringify(players));
        localStorage.setItem("scores", JSON.stringify(scores));
        localStorage.setItem("reentries", JSON.stringify(reentries));
        localStorage.setItem("round", round.toString());
    }, [players, scores, reentries, round]);

    const addPlayer = () => {
        if (players.length < 7) {
            const playerName = prompt("Enter player name:");
            if (playerName) {
                setPlayers([...players, playerName]);
                setScores({ ...scores, [playerName]: Array(round).fill(0) });
                setReentries({ ...reentries, [playerName]: 0 });
            }
        } else {
            alert("Maximum 7 players allowed.");
        }
    };

    const addRound = () => {
        setRound(round + 1);
        const newScores = { ...scores };
        players.forEach((player) => {
            if (!newScores[player]) newScores[player] = [];
            newScores[player].push(0);
        });
        setScores(newScores);
    };

    const updateScore = (player, roundIndex, value) => {
        const newScores = { ...scores };
        newScores[player][roundIndex] = parseInt(value) || 0;
        setScores(newScores);
    };

    const calculateTotal = (player) => {
        return scores[player]?.reduce((a, b) => a + (b || 0), 0) || 0;
    };

    const reEnterPlayer = (player) => {
        const newScores = { ...scores };
        const newReentries = { ...reentries };
        newScores[player] = Array(round).fill(0);
        newReentries[player] = (newReentries[player] || 0) + 1;
        setScores(newScores);
        setReentries(newReentries);
    };

    const clearCache = () => {
        if (window.confirm("Are you sure you want to clear all data?")) {
            localStorage.clear();
            setPlayers([]);
            setScores({});
            setReentries({});
            setRound(1);
        }
    };

    const findLowestScore = () => {
        const totals = players.map((player) => ({
            player,
            total: calculateTotal(player),
        }));
        return totals.sort((a, b) => a.total - b.total)[0]?.player;
    };

    const lowestScorer = findLowestScore();

    return (
        <div className="container">
            <h1>Rummy Score Tracker</h1>
            <div className="controls">
                <button onClick={addPlayer}>+ Add Player</button>
                <button onClick={addRound}>+ Add Round</button>
                <button onClick={clearCache}>Clear Cache</button>
            </div>
            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th className="sticky-column">Re-Entries</th>
                            <th className="sticky-column">Player</th>
                            {[...Array(round)].map((_, i) => (
                                <th key={i}>Round {i + 1}</th>
                            ))}
                            <th>Total</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {players.map((player) => {
                            const total = calculateTotal(player);
                            return (
                                <tr
                                    key={player}
                                    style={{
                                        backgroundColor:
                                            total >= 100
                                                ? "lightcoral"
                                                : player === lowestScorer
                                                ? "lightgreen"
                                                : "",
                                    }}
                                >
                                    <td className="sticky-column">
                                        {"*".repeat(reentries[player] || 0)}
                                    </td>
                                    <td className="sticky-column">{player}</td>
                                    {[...Array(round)].map((_, i) => (
                                        <td key={i}>
                                            <input
                                                type="number"
                                                value={
                                                    scores[player]?.[i] || ""
                                                }
                                                onChange={(e) =>
                                                    updateScore(
                                                        player,
                                                        i,
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </td>
                                    ))}
                                    <td>{total}</td>
                                    <td>
                                        <button
                                            onClick={() =>
                                                reEnterPlayer(player)
                                            }
                                        >
                                            Re-Enter
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <style jsx>{`
                .container {
                    font-family: Arial, sans-serif;
                    padding: 20px;
                    background: #f5f5f5;
                    border-radius: 10px;
                    max-width: 900px;
                    margin: auto;
                    text-align: center;
                }
                h1 {
                    color: #333;
                }
                .controls {
                    margin-bottom: 20px;
                }
                button {
                    margin: 5px;
                    padding: 10px 20px;
                    border: none;
                    background: #0070f3;
                    color: white;
                    border-radius: 5px;
                    cursor: pointer;
                }
                button:hover {
                    background: #005bb5;
                }
                .table-wrapper {
                    overflow-x: auto;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }
                th,
                td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: center;
                }
                th {
                    background-color: #0070f3;
                    color: white;
                }
                input {
                    width: 50px;
                    text-align: center;
                }
               
                    .sticky-column {
    position: sticky;
    left: 0;
    color: black; /* Set text color to black */
    z-index: 2;
}

                @media (max-width: 600px) {
                    .container {
                        padding: 10px;
                    }
                    button {
                        padding: 8px 15px;
                        font-size: 14px;
                    }
                    input {
                        width: 40px;
                        font-size: 14px;
                    }
                }
            `}</style>
        </div>
    );
}

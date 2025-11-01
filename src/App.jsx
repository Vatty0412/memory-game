import { useEffect, useState } from 'react';

function Card({ value, flipped, solved, onClick = () => {} }) {
    return (
        <>
            <div
                className={`h-20 w-20 m-1 transition-all duration-300 border border-gray-200 rounded-xl flex items-center justify-center ${solved ? 'bg-green-400' : flipped ? 'bg-blue-400' : 'bg-gray-400'}`}
                onClick={onClick}
            >
                <span className="text-white text-2xl font-semibold">
                    {((flipped || solved) ? value : '?')}
                </span>
            </div>
        </>
    );
}

function App() {
    const [grid, setGrid] = useState(4);
    const [cards, setCards] = useState([]);

    const [flipped, setFlipped] = useState([]);
    const [solved, setSolved] = useState([]);

    const [won, setWon] = useState(false);

    const resetGame = () => {
        const shuffledCards = Array.from({ length: grid ** 2 - (grid ** 2 % 2) }, (_, id) => ({
            id,
            value: (id % Math.floor((grid * grid) / 2)) + 1,
        })).sort(() => Math.random() - 0.5);

        setCards(shuffledCards);
        setFlipped([]);
        setSolved([]);
        setWon(false);
    };

    const handleClick = card => {
        if (solved.some(({ id }) => id === card.id) || flipped.some(({ id }) => id === card.id)) return;

        setFlipped(prev => {
            if ([0, 1].includes(prev.length)) return [...prev, card];
            else return prev;
        });
    };

    useEffect(() => {
        if (flipped.length !== 2) return;

        const [card1, card2] = flipped;
        
        setTimeout(() => {
            setSolved((prev) => (card1.value === card2.value ? [...prev, card1, card2] : prev));
            setFlipped([]);
            setDisabled(false);
        }, 1000);

    }, [flipped]);

    useEffect(() => {
        if (solved.length === cards.length) setWon(true);
    }, [solved, cards]);

    useEffect(() => {
        resetGame();
    }, [grid]);

    return (
        <div className="w-full h-screen p-10 bg-gray-200">
            <h1 className="text-4xl font-bold text-gray-700 text-center">MEMORY GAME</h1>
            {/* Grid Size */}
            <form className="flex justify-center items-center my-10">
                Grid size:
                <input
                    type="number"
                    name="grid"
                    value={grid}
                    onChange={(e) => setGrid(Number(e.target.value))}
                    max={8}
                    min={2}
                    className="border-2 ml-4 pl-2 py-1 rounded-md w-20 bg-white"
                />
            </form>
            {/* Game Board */}
            <div
                className="my-10 mx-auto w-fit grid items-center"
                style={{
                    gridTemplateColumns: `repeat(${grid}, minmax(0, 1fr))`,
                }}
            >
                {cards.map((card) => (
                    <Card
                        key={card.id}
                        value={card.value}
                        onClick={() => handleClick(card)}
                        flipped={flipped.some(({ id }) => id === card.id)}
                        solved={solved.some(({ id }) => id === card.id)}
                    />
                ))}
            </div>
            {/* Reset/Play Again Button */}
            <div className="flex justify-center">
                <button
                    className="rounded-md bg-green-400 active:bg-green-500 p-2 text-white shadow-green-400 shadow-sm"
                    onClick={resetGame}
                >
                    {won ? 'Play Again' : 'Reset Game'}
                </button>
            </div>
        </div>
    );
}

export default App;

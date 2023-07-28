import { useEffect, useState } from "react";
import ScoreBoard from "./components/ScoreBoard";
import blueCandy from "./images/blue-candy.png";
import greenCandy from "./images/green-candy.png";
import orangeCandy from "./images/orange-candy.png";
import purpleCandy from "./images/purple-candy.png";
import redCandy from "./images/red-candy.png";
import yellowCandy from "./images/yellow-candy.png";
import blank from "./images/blank.png";
const width = 8;
const candyColors = [
  blueCandy,
  greenCandy,
  orangeCandy,
  purpleCandy,
  redCandy,
  yellowCandy,
];

const App = () => {
  const [currentColorArrangement, setCurrentColorArrangement] = useState([]);
  const [dragged, setDragged] = useState(null);
  const [replaced, setReplaced] = useState(null);
  const [scoreDisplay, setScoreDisplay] = useState(0);
  const checkForColumnFour = () => {
    for (let i = 0; i <= 39; i++) {
      const columnOfFour = [i, i + width, i + width * 2, i + width * 3];
      const decideColor = currentColorArrangement[i];
      const isBlank = currentColorArrangement[i] === blank;
      if (
        columnOfFour.every(
          (square) =>
            currentColorArrangement[square] === decideColor && !isBlank
        )
      ) {
        setScoreDisplay((score) => score + 4);
        columnOfFour.forEach(
          (square) => (currentColorArrangement[square] = blank)
        );
        return true;
      }
    }
  };

  const checkForRowFour = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfFour = [i, i + 1, i + 2, i + 3];
      const decideColor = currentColorArrangement[i];
      const notValid = [
        5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53,
        54, 55, 62, 63, 64,
      ];
      const isBlank = currentColorArrangement[i] === blank;
      if (notValid.includes(i)) continue;

      if (
        rowOfFour.every(
          (square) =>
            currentColorArrangement[square] === decideColor && !isBlank
        )
      ) {
        setScoreDisplay((score) => score + 4);
        rowOfFour.forEach(
          (square) => (currentColorArrangement[square] = blank)
        );
        return true;
      }
    }
  };
  const checkForColumnThree = () => {
    for (let i = 0; i <= 47; i++) {
      const columnOfThree = [i, i + width, i + width * 2];
      const decideColor = currentColorArrangement[i];
      const isBlank = currentColorArrangement[i] === blank;
      if (
        columnOfThree.every(
          (square) =>
            currentColorArrangement[square] === decideColor && !isBlank
        )
      ) {
        setScoreDisplay((score) => score + 3);
        columnOfThree.forEach(
          (square) => (currentColorArrangement[square] = blank)
        );
        return true;
      }
    }
  };

  const checkForRowThree = () => {
    for (let i = 0; i < 64; i++) {
      const rowOfThree = [i, i + 1, i + 2];
      const decideColor = currentColorArrangement[i];
      const notValid = [
        6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64,
      ];
      const isBlank = currentColorArrangement[i] === blank;
      if (notValid.includes(i)) continue;

      if (
        rowOfThree.every(
          (square) =>
            currentColorArrangement[square] === decideColor && !isBlank
        )
      ) {
        setScoreDisplay((score) => score + 3);
        rowOfThree.forEach(
          (square) => (currentColorArrangement[square] = blank)
        );
        return true;
      }
    }
  };

  const moveIntoSquareBelow = () => {
    for (let i = 0; i <= 55; i++) {
      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
      const isFirstRow = firstRow.includes(i);
      if (isFirstRow && currentColorArrangement[i] === blank) {
        let randomNumber = Math.floor(Math.random() * candyColors.length);
        currentColorArrangement[i] = candyColors[randomNumber];
      }
      if (currentColorArrangement[i + width] === blank) {
        currentColorArrangement[i + width] = currentColorArrangement[i];
        currentColorArrangement[i] = blank;
      }
    }
  };

  // console.log(scoreDisplay);

  const dragStart = (e) => {
    // console.log(e.target);
    // console.log("dragStart");
    setDragged(e.target);
  };
  const dargDrop = (e) => {
    // console.log(e.target);
    // console.log("drag Drop");
    setReplaced(e.target);
  };
  const dragEnd = () => {
    // console.log("drag End");
    const draggedId = parseInt(dragged.getAttribute("data-id"));
    const replacedId = parseInt(replaced.getAttribute("data-id"));
    currentColorArrangement[draggedId] = replaced.getAttribute("src");
    currentColorArrangement[replacedId] = dragged.getAttribute("src");
    // console.log("draggedId", draggedId);
    // console.log("replacedId", replacedId);

    const validMoves = [
      draggedId - 1,
      draggedId - width,
      draggedId + 1,
      draggedId + width,
    ];
    const validMove = validMoves.includes(replacedId);
    const isColumnOfFour = checkForColumnFour();
    const isRowOfFour = checkForRowFour();
    const isColumnOfThree = checkForColumnThree();
    const isRowOfThree = checkForRowThree();

    const isOneTrue =
      isRowOfThree || isRowOfFour || isColumnOfFour || isColumnOfThree;
    if (replacedId && validMove && isOneTrue) {
      setDragged(null);
      setReplaced(null);
    } else {
      currentColorArrangement[replacedId] = replaced.getAttribute("src");
      currentColorArrangement[draggedId] = dragged.getAttribute("src");
      setCurrentColorArrangement([...currentColorArrangement]);
    }
  };

  const createBoard = () => {
    const randomColorArrangement = [];
    for (let i = 0; i < width * width; i++) {
      const randomNumber0to5 = Math.floor(Math.random() * candyColors.length);
      const randomColor = candyColors[randomNumber0to5];
      randomColorArrangement.push(randomColor);
    }
    setCurrentColorArrangement(randomColorArrangement);
  };
  useEffect(() => {
    createBoard();
  }, []);
  useEffect(() => {
    const timer = setInterval(() => {
      checkForColumnFour();
      checkForRowFour();
      checkForColumnThree();
      checkForRowThree();
      moveIntoSquareBelow();
      setCurrentColorArrangement([...currentColorArrangement]);
    }, 140);
    return () => clearInterval(timer);
  }, [
    checkForColumnFour,
    checkForRowFour,
    checkForColumnThree,
    checkForRowThree,
    moveIntoSquareBelow,
    currentColorArrangement,
  ]);

  // console.log(currentColorArrangement);
  return (
    <div className="app">
      <div className="game">
        {currentColorArrangement.map((candyColor, index) => (
          <img
            key={index}
            src={candyColor}
            alt={candyColor}
            data-id={index}
            draggable={true}
            onDragStart={dragStart}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => e.preventDefault()}
            onDragLeave={(e) => e.preventDefault()}
            onDrop={dargDrop}
            onDragEnd={dragEnd}
          />
        ))}
      </div>
      <ScoreBoard score={scoreDisplay} />
    </div>
  );
};

export default App;

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClickB}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    //debugger
    return <Square
      value={this.props.squares[i]}
      onClickB={() => this.props.onClickA(i)}
      key={i}
    />;
  }

  render() {

    const BoardRows = [];
    let counter = 0;

    for (var i = 0; i < 3; i++) {
      BoardRows.push(<div className="board-row" key={i.toString() + ' row parent'} />)
      for (var j = 0; j < 3; j++) {
        BoardRows.push(this.renderSquare(counter));
        counter++;

      }
    }

    return (
      <div>
        {BoardRows}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        vector: null,
      }],
      stepNumber: 0,
      xIsNext: true,
      selected: false,
      isToggleOn: true,
    };

    this.handleClickOfSort = this.handleClickOfSort.bind(this);
  }

  getVector(i) {
    let col;
    let row;
    if (i === 0 || i === 3 || i === 6) {
      col = 1;
    } else if (i === 1 || i === 4 || i === 7) {
      col = 2;
    } else {
      col = 3;
    }
    if (i === 0 || i === 1 || i === 2) {
      row = 1;
    } else if (i === 3 || i === 4 || i === 5) {
      row = 2;
    } else {
      row = 3;
    }
    return `(${col}, ${row})`;
  }


  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const vector = this.getVector(i);
    //debugger

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        vector: vector,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      selected: history.length,
    });


  }

  handleClickOfSort() {
    this.setState(state => ({
      isToggleOn: !state.isToggleOn
    }));
  }

  jumpTo(step) {

    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      selected: step,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const accending = this.state.isToggleOn;

    //debugger
    const moves = history.map((step, move) => {
      const desc = move ?
        `Go to move #${move} ${history[move].vector}` :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)} style={{ 'fontWeight': this.state.selected === move ? 'bold' : 'normal' }}>{desc}</button>
        </li>
      );
    })

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClickA={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>
            <button onClick={this.handleClickOfSort}>
              {accending ? "Accending" : "Decending"}
            </button>
          </div>
          <div>{status}</div>
          <ol>{accending ? moves : moves.reverse()}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

//class Clock extends React.Component {
//  constructor(props) {
//    super(props);
//    this.state = { date: new Date() };
//  }

//  componentDidMount() {
//    this.timerID = setInterval(
//      () => this.tick(),
//      1000
//    );
//  }

//  componentWillUnmount() {
//    clearInterval(this.timerID);
//  }

//  tick() {
//    this.setState({
//      date: new Date()
//    });
//  }

//  render() {
//    return (
//      <div>
//        <h1>Hello, world!</h1>
//        <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
//      </div>
//    );
//  }
//}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

//ReactDOM.render(
//  <Clock />,
//  document.getElementById('root')
//);
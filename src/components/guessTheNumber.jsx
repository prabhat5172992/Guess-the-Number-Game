import React, { Component } from "react";
export default class GuessNumber extends Component {
  constructor() {
    super();
    this.state = {
      num: parseInt(Math.random(100) * 100),
      userInput: null,
      yourGuess: "",
      initialText: "Please enter name first and then number",
      info: "",
      attempt: 0,
      attemptTrace: [],
      participants: {},
      userTime: {},
      userName: "",
      leastAttempt: 0,
      winners: [],
      checkFlag: true,
      inputFieldFlag: false,
      resultFlag: true,
      regenFlag: false,
      resultShown: false,
      t1: 0,
      t2: 0,
    };
  }
  componentDidUpdate(_, prevState) {
    if(prevState.userInput !== this.state.userInput) {
        this.setState({
            checkFlag: false,
        });
    }
  }
  getNumber(e) {
    const userNum = parseInt(e.target.value) ? parseInt(e.target.value) : null;
    if (userNum > 100 || userNum < 0) {
      this.setState({
        initialText: "Please enter the number in range 1 to 100",
        userInput: null,
        yourGuess: "",
      });
    } else if(this.state.userName) {
      this.setState({
        initialText: "",
        userInput: userNum,
        yourGuess: "",
      });
    }
  }
  getName(e) {
    this.setState({
      userName: e.target.value,
    });
  }
  checkNumber() {
    const { userInput, num, attempt, attemptTrace } = this.state;
    if (!attemptTrace.length) {
      this.timeCounter();
    }
    while (userInput < num || userInput >= num) {
      if (userInput < num) {
        this.setState({
          yourGuess: "Your guess is low!",
          attempt: attempt + 1,
          attemptTrace: [...attemptTrace, userInput],
          resultFlag: true,
          regenFlag: true,
          checkFlag: true,
        });
        return;
      } else if (userInput > num) {
        this.setState({
          yourGuess: "Your guess is high!",
          attempt: attempt + 1,
          attemptTrace: [...attemptTrace, userInput],
          resultFlag: true,
          regenFlag: true,
          checkFlag: true,
        });
        return;
      } else if (userInput === num) {
        this.setState(
          {
            yourGuess: "Congrats!! Your guess is right",
            info: "Please regenerate number to enable fields!",
            attempt: attempt + 1,
            attemptTrace: [...attemptTrace, userInput],
            inputFieldFlag: true,
            checkFlag: true,
          },
          () => this.addParticipants()
        );
        return;
      }
    }
  }
  timeCounter() {
    let t1 = 0;
    let t2 = 0;
    this.counter = setInterval(() => {
      if (t2 === 59) {
        t1 += 1;
      }
      if (t2 === 59) {
        t2 = 0;
      } else {
        t2 += 1;
      }
      this.setState({
        t1,
        t2,
      });
    }, 1000);
  }
  addParticipants() {
    const { participants, attempt, userName, t1, t2, userTime } = this.state;
    const user = {};
    const time = {};
    if (userName && attempt) {
      user[userName] = attempt;
      time[userName] = `${t1} : ${t2}`;
    }
    this.setState({
      participants: { ...participants, ...user },
      userTime: { ...userTime, ...time },
      resultFlag: false,
      regenFlag: false,
    });
    clearInterval(this.counter);
  }
  regenerateNumber() {
    this.setState(
      {
        initialText: "Please enter name first and then number",
        info: "",
        num: parseInt(Math.random(100) * 100),
        userInput: null,
        yourGuess: "",
        attempt: 0,
        attemptTrace: [],
        userName: "",
        leastAttempt: 0,
        winners: [],
        inputFieldFlag: false,
        resultFlag: true,
        t1: 0,
        t2: 0,
      },
      () => this.clearUserTime()
    );
  }
  clearUserTime() {
    const { resultShown } = this.state;
    if (resultShown) {
      this.setState({
        userTime: {},
        resultShown: false,
      });
    }
  }
  getWinner() {
    const { participants, resultFlag } = this.state;
    const attempts = Object.values(participants).sort((a, b) => a - b);
    const winners = [];
    for (let user in participants) {
      if (participants[user] === attempts[0]) {
        winners.push(user);
      }
    }
    this.setState({
      leastAttempt: attempts[0],
      winners,
      participants: {},
      resultFlag: !resultFlag,
      resultShown: true,
    });
  }
  render() {
    const {
      attempt,
      attemptTrace,
      checkFlag,
      inputFieldFlag,
      info,
      initialText,
      leastAttempt,
      regenFlag,
      resultFlag,
      t1,
      t2,
      userInput,
      userName,
      userTime,
      yourGuess,
      winners,
    } = this.state;
    return (
      <>
        <h1>Guess a number between 1 to 100</h1>
        <h2>
          {t1}
          {" : "}
          {t2}
        </h2>
        <input
          className="enterName"
          type="text"
          placeholder="Enter your name..."
          value={userName}
          onChange={(e) => this.getName(e)}
          disabled={inputFieldFlag}
        />
        <input
          className="guess-num"
          type="text"
          placeholder="Enter the number..."
          value={userInput || ""}
          onChange={(e) => this.getNumber(e)}
          disabled={inputFieldFlag}
        />
        <button
          id="check-num"
          className="rotate-button get-country checkNum"
          onClick={() => this.checkNumber()}
          disabled={checkFlag}
        >
          Check Number!
        </button>
        <button
          id="regenerate-num"
          className="rotate-button get-country"
          onClick={() => this.regenerateNumber()}
          disabled={regenFlag}
        >
          Regenerate Number!
        </button>
        <h3>{userInput && yourGuess ? yourGuess : initialText}</h3>
        <h3>{info ? info : null}</h3>
        <h3>{attempt ? `Your number of attempts: ${attempt}` : null}</h3>
        {attemptTrace.length
          ? attemptTrace.map((item) => (
              <span className="attempt_trace" key={`span${item}`}>
                {item}
              </span>
            ))
          : null}
        <button
          id="regenerate-num"
          className="rotate-button get-country finalResult"
          onClick={() => this.getWinner()}
          disabled={resultFlag}
        >
          Result!
        </button>
        {winners.length
          ? winners.map((item) => (
              <h4
                key={`winner_${item}`}
                className="displayWinner"
              >{`The winner is ${item} with ${leastAttempt} attempts and took ${userTime[item]} sec.`}</h4>
            ))
          : null}
      </>
    );
  }
}

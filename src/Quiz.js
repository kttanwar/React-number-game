import React, { Component } from 'react';
import QuizOptions from './QuizOptions';
import classNames from 'classnames';

class Quiz extends Component {
    constructor(props) {
        super(props);
        let riddle = this.playGame();
        let correct = false;//true if you find the correct answer
        let gameOver = false;//true everytime a number is chosen doesn't matter correct or wrong, the game is over
        this.state = {
            riddle,
            correct,
            gameOver
        };
        this.renderOptions = this.renderOptions.bind(this);
        this.checkResults = this.checkResults.bind(this);
        this.play = this.play.bind(this);
    }
    randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    generateRandomOptions(sum) {
        //let result = sum; do this inside for loop below so that it gets updated everytime and not get carry forward(unchanged)
        let resultsArray = [];
        let randomNumberArray = [];

        while (randomNumberArray.length <= 3) {
            let randomNumber = this.randomNumber(1, 19);
            if (randomNumberArray.indexOf(randomNumber) > -1) continue;
            randomNumberArray.push(randomNumber);
        }
        //do console.log(randomNumberArray); to check the elements we expected to have
        for (let i = 0; i < 3; i++) {
            let addSubtract = this.randomNumber(0, 1);//used to get a flag(bool type) value to dtermine about + or -
            let result = sum;
            if (addSubtract === 1) {
                //add the number to the result
                result += randomNumberArray[i];
                resultsArray.push(result);
            }
            else {
                //subtract the number from the result
                result -= randomNumberArray[i];
                resultsArray.push(result);
            }
        }

        //do console.log(resultsArray); to see the random number generated after addition and subtraction
        return resultsArray;
    }
    playGame() {
        let field1 = this.randomNumber(20, 50);//do console.log(this.randomNumber(20,50) to see it working in selecting a random number)
        let field2 = this.randomNumber(20, 50);
        let result = field1 + field2;
        let resultsArray = this.generateRandomOptions(result);
        resultsArray.push(result);
        resultsArray.sort(function (a, b) { return 0.5 - Math.random() });//to shuffle the order of elements in array
        let riddle = {
            resultsArray: resultsArray,
            field1: field1,
            field2: field2,
            answer: result
        };

        //do console.log(riddle); for checking that everything in our riddle object is what we were expecting

        if (this.state && this.state.gameOver) {//Done this to reset the state, so a new game can be loaded. We did 'this.state' if it is true which means it is an existing game for which you have set the state of riddle and 'this.state.gameOver' if this is also true then setState of riddle.
            this.setState({
                riddle: riddle
            });
        } else {//else return riddle
            return riddle;
        }


    }
    checkResults(option) {
        console.log('checkResults called' + option);
        if (this.state.riddle.answer === option) {
            console.log('Correct Answer');
            this.setState({
                correct: true,
                gemeOver: true
            });
        } else {
            console.log('Wrong Answer');
            this.setState({
                correct: false,
                gemeOver: true
            });
        }
    }
    renderOptions() {
        return (
            <div className="options">
                {this.state.riddle.resultsArray.map((option, i) =>
                    <QuizOptions option={option} key={i} checkResults={(option) => this.checkResults(option)} />
                )}
            </div>
        );
    }
    renderMessage() {
        if (this.state.correct) {
            return <h3>Good job! Hit the button below to Play Again.</h3>
        } else {
            return <h3>ohhh ohhh! Hit the button below to Play Again.</h3>
        }
    }
    play() {
        this.setState({
            correct: false,
            gameOver: false
        });
        this.playGame();
    }
    render() {
        return (
            <div className="quiz">
                <div className="quiz-content">
                    <p className="question">What is the sum of <span className="text-info">{this.state.riddle.field1}</span> and <span className="text-info">{this.state.riddle.field2}</span>?</p>
                    {this.renderOptions()}
                </div>
                {/* Correct: {this.state.correct ? "True" : "False"}<br/>
                GameOver: {this.state.gameOver ? "True" : "False"} to check the values of the states*/}
                <div className={classNames("after", { 'hide': !this.state.gameOver }, { 'wrong animated zoomInDown': !this.state.correct }, { 'correct animated zoomInDown': this.state.correct })}>
                    {this.renderMessage()}
                </div>
                <div className="play-again">
                    <a className="button" onClick={this.play}>Play Again</a>
                </div>
            </div>
        );
    }
}

export default Quiz;


/*Array.sort(function(a,b) {return 0.5 - Math.random()})
  Math.random gives number between 0 to 1(excluded). The sort function will sort as:
    1) min(a,b) then remaining one, if the 0.5-Math.random returns negative value
    2) max(a,b) then remaining one, if the 0.5-Math.random returns positive value
  a and b are all the consecutive pairs of numbers in the array
  eg: Start with the array [3,9,1].If the random function returns a negative number,
  the 3 and the 9 stay in the same order ie; you have [3,9,1]. BUT if the random function
  returns a positive number, then they go in the opposite order (b comes first) ie; you now have [9,3,1].
  Then repeat the process for the next pair of elements, which will either be 9,1 or 3,1 depending on the
  result of the first sort. If the next random number is negative, swap them.
  If it’s positive, don’t swap them.*/
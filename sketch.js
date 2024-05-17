/* Game opdracht
   Informatica - Emmauscollege Rotterdam
   Template voor een game in JavaScript met de p5 library

   Begin met dit template voor je game opdracht,
   voeg er je eigen code aan toe.
 */

/*
 * instellingen om foutcontrole van je code beter te maken 
 */
///<reference path="p5.global-mode.d.ts" />
"use strict"

const MUTATION_CHANGE = 0.6;

let label;
let teRadenWoordInput;
let startButton;
let nextGenerationButton;
let stopButton;

let currentGeneration;
let currentTotalScore;
let teRadenWoord;
var newcharacterslength;
var newcharacters = '';
var solA;
let solB;
var bestSolution;
var stopped = false;
var running = false;
var highestofhighest = 0;


/* ********************************************* */
/* setup() en draw() functies / hoofdprogramma   */
/* ********************************************* */

/**
 * setup
 * de code in deze functie wordt één keer uitgevoerd door
 * de p5 library, zodra het spel geladen is in de browser
 */
function setup() {
  createCanvas(400, 400);

  label = createP("Voer een woord van 8 kleine letters in");
  label.position(450, 0);

  teRadenWoordInput = createInput();
  teRadenWoordInput.position(450, 40);
  teRadenWoordInput.attribute("maxLength", 8)

  startButton = createButton("Start")
  startButton.position(450, 80);
  startButton.mouseClicked(start)

  nextGenerationButton = createButton("Next generation");
  nextGenerationButton.position(450, 120);
  nextGenerationButton.attribute("disabled", true)
  nextGenerationButton.mouseClicked(nextIteration);

  stopButton = createButton("stop generation");
  stopButton.position(450, 160);
  stopButton.attribute("disabled", true);
  stopButton.mouseClicked(stop);
}


/**
 * draw
 * de code in deze functie wordt 50 keer per seconde
 * uitgevoerd door de p5 library, nadat de setup functie klaar is
 */
function draw() {
  background('gray');
}

function stop() {
  stopped = true;
}

function start() {
  if (teRadenWoordInput.value().length < 8) {
    window.alert("woord kleiner dan 8 tekens");
    return;
  }

  startButton.attribute("disabled", true);
  nextGenerationButton.removeAttribute("disabled");
  stopButton.removeAttribute("disabled");

  teRadenWoord = teRadenWoordInput.value(); 
  
  createFirstGeneration();

  for (let i = 0; i < currentGeneration.length; i++) {
    calculateSolutionFitness(currentGeneration[i])
  }

  console.log("beste oplossing: ", bestCurrentSolution());
}

function nextIteration() {
        let newGeneration = []

        // creëer een nieuwe generatie:
        // kies twee oplossingen
        console.log(calculateTotalScore());
        
        solA = rouletteWheelSelection()
        solB = rouletteWheelSelection()
        while (solA === solB) {
          solB = rouletteWheelSelection()
        }

        createcharacterlist();
        console.log(newcharacters);

        for (var i = 0; i < 20; i++) {
          let input = '';
          for (var t = 0; t < 8; t++) {
            input += newcharacters.charAt(Math.floor(Math.random() * newcharacterslength));
            
          }
          newGeneration.push({value: input});
          calculateSolutionFitness(newGeneration[i]);
        }

        // for(var i = 0; i < 1; i++) {
        //   newGeneration.push(createRandomSolution());
        //   calculateSolutionFitness(newGeneration[i+19]);
        // }

        console.log(solA);
        console.log(solB);

        // maak twee nieuwe oplossingen door uitwisseling
        // en zet die in de nieuwe generatie
        
        
        // vervang de oude generatie
        currentGeneration = newGeneration;
        console.log(currentGeneration);
        bestSolution = bestCurrentSolution();
        if(calculateTotalScore() > highestofhighest) {
          highestofhighest = calculateTotalScore();
        }
        console.log("beste oplossing: ", bestSolution);
        console.log("best ooit " + highestofhighest);
        running = false;
}

function createcharacterlist() {
  newcharacters = '';
  let roll = random(1)
  if (roll < MUTATION_CHANGE) {
    newcharacters += getRandomLowerCaseLetter()
    newcharacterslength = 17;
    if (roll < MUTATION_CHANGE) {
      newcharacters += getRandomLowerCaseLetter()
      newcharacterslength = 18;
      if (roll < MUTATION_CHANGE) {
        newcharacters += getRandomLowerCaseLetter()
        newcharacterslength = 19;
      }
    }
  }else{
    newcharacterslength = 16;
  }
  newcharacters += solA.value + solB.value;
}


function createRandomSolution() {
  var result = '';
  var characters = 'abcdefghijklmnopqrstuvwxyz';
  var charactersLength = characters.length;
  for (var i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return {value: result}
}


function createFirstGeneration() {
  currentGeneration = [];

  for (let i = 0; i < 20; i++) {
    currentGeneration.push(createRandomSolution());
  }

  console.log(currentGeneration);
}


function calculateSolutionFitness(solution) {
  let score = 1;
  for (let i = 0; i < 8; i++) {
    if (solution.value[i] === teRadenWoord[i]) {
      score = score * 2;
      console.log("letter is hetzelfde");
    }
  }

  return solution.score = score;
}


function calculateTotalScore() {
  currentTotalScore = 0;
  for (let index = 0; index < currentGeneration.length; index++) {
    const solution = currentGeneration[index];
    currentTotalScore = currentTotalScore + solution.score
  }

  return currentTotalScore
}


function rouletteWheelSelection() {
  let rouletteNumber = random(currentTotalScore);
  let searchNumber = 0;

  for(let i = 0; i<currentGeneration.length; i++) {
    searchNumber = searchNumber + currentGeneration[i].score
    if (searchNumber >= rouletteNumber) {
      return currentGeneration[i];
    }
  }
}


function bestCurrentSolution() {
  let bestSolution = currentGeneration[0];

  for (let i = 0; i < currentGeneration.length; i++) {
    if (currentGeneration[i].score > bestSolution.score) {
      bestSolution = currentGeneration[i];
    }
  }

  return bestSolution;
}


function solutionWidthCrossOver(solA, solB) {

}


function mutate() {
  let roll = random(1)
  if (roll < MUTATION_CHANGE) {
    return getRandomLowerCaseLetter()
  }
}

function getRandomLowerCaseLetter() {
  var randomCharCode = Math.floor(Math.random() * 26) + 97; // ASCII-waarden voor 'a' tot 'z' zijn 97 tot 122
  return String.fromCharCode(randomCharCode);
}
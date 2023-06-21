var gamejs = require('gamejs');
var font = require('gamejs/font');
var screenWidth = 1900;
var screenHeight = 930;
var activeGame = true;
var defaultFont = new font.Font("40px Arial");
var currentMovementP1 = "Preview/balancing.gif"
var currentMovementP2 = "PreviewP2/balancingP2.gif"
var correctMovementP1 = "Preview/balancing.gif"
var correctMovementP2 = "PreviewP2/balancingP2.gif"
var arrayMovesP1 = ["Preview/hips.gif", "Preview/skip.gif", "Preview/slide.gif", "Preview/snap.gif"]
var arrayMovesP2 = ["PreviewP2/hipsP2.gif", "PreviewP2/skipP2.gif", "PreviewP2/slideP2.gif", "PreviewP2/snapP2.gif"]
var arrayMovesShadow = ["PreviewS/hipsS.gif", "PreviewS/skipS.gif", "PreviewS/slideS.gif", "PreviewS/snapS.gif"]
var newMoveCurrentTicks = 0
var ticksToNewMove = 700 
var canMove = correctMovementP1 !== "Preview/balancing.gif" && correctMovementP2  !== "PreviewP2/balancingP2.gif"

/* 
 Valores dos tamanhos dos itens na tela
 proporcaoLarguraAlturaPlayer = 1.35897435897
 larguraPlayer = 150
 alturaPlayer = 150 * proporcaoLarguraAlturaPlayer
 proporcaoLarguraAlturaTV = 1.32692307692
 larguraPlayer = 300
 alturaPlayer = 300 * proporcaoLarguraAlturaTV
*/

function Player(placement, formIndex){
  this.placement = placement;
  this.mask = 16;
  this.hit = false;
  this.health = 1500;
};

Player.registerHit = function(player1, player2){
 
  if(arrayMovesP1.indexOf(currentMovementP1) !== arrayMovesShadow.indexOf(correctMovementP1)){
    player1.hit = true  
  }
  
  if(arrayMovesP2.indexOf(currentMovementP2) !== arrayMovesShadow.indexOf(correctMovementP2)){
    player2.hit = true  
  }
  
};

Player.prototype.update = function(msDuration) {

  if(this.hit===true){
    this.health = this.health - 1;
    this.hit = false;

  };
};


//Atualiza o passo de dança dos players  (no .html)
function changeMovement(player){
  if(player === 1){
    document.getElementById("player1").src = currentMovementP1
  } else {
    document.getElementById("player2").src = currentMovementP2
  }

}

//Atualiza a variavel canMove, se ela for false, os players na odevem podem mudar de passo de dança. Util para startar o game, já que o passo "Balancing" é usado apenas no start;
function refreshCanMove(){

  canMove = correctMovementP1 !== "Preview/balancing.gif" && correctMovementP2  !== "PreviewP2/balancingP2.gif"

}

//Atualiza os passos na TV, que os players deverão seguir (no .html). E controla a quantidade de ticks que irá demorar para o proximo passo aparecer na TV do game.
function changeNextMovement(){

  var isPlayersDancandoCerto = arrayMovesP1.indexOf(currentMovementP1) === arrayMovesShadow.indexOf(correctMovementP1) && arrayMovesP2.indexOf(currentMovementP2) === arrayMovesShadow.indexOf(correctMovementP2)
    
  if ( !isPlayersDancandoCerto){
  
    newMoveCurrentTicks = 0

  }

  if( newMoveCurrentTicks >= ticksToNewMove && isPlayersDancandoCerto ){

    correctMovementP1 = randomMovePlayer(1)
    correctMovementP2 = randomMovePlayer(2)
    
    console.log( "Nwe Moves", correctMovementP1 + correctMovementP2)

    document.getElementById("p1STV").src = correctMovementP1
    document.getElementById("p2STV").src = correctMovementP2

    newMoveCurrentTicks = 0

  } else if ( newMoveCurrentTicks < ticksToNewMove && isPlayersDancandoCerto) {

    newMoveCurrentTicks += 1

  } 

}

//Escolhe aleatoriamente o proximo passo que o player deverá fazer. O proximo passo nunca será o mesmo que o quye está sendo executado atualmente.
function randomMovePlayer(playerNumber){

  var possibleNextMoves = []
  var currentMoveIndex
  var possibleNextMoves = [...arrayMovesShadow]

  if(playerNumber === 1){
    currentMoveIndex = arrayMovesP1.indexOf(currentMovementP1)
  } else {
    currentMoveIndex = arrayMovesP2.indexOf(currentMovementP2)
  }

  if(currentMoveIndex > -1){
    possibleNextMoves.splice(currentMoveIndex, 1);
  }

  let randomId = Math.floor(Math.random() * possibleNextMoves.length);

  return possibleNextMoves[randomId]
 
}


function main() {
  var display = gamejs.display.setMode([screenWidth, screenHeight]);
  console.log("Test")

  //Alternando os movimentos de dança a partir das teclas apertadas
  function handleEvent(event) {
    if(canMove){
      if(event.key === gamejs.event.K_UP){
       currentMovementP2 = "PreviewP2/hipsP2.gif"
       changeMovement(2)
      }else if(event.key === gamejs.event.K_DOWN){
       currentMovementP2 = "PreviewP2/skipP2.gif"
       changeMovement(2)
      }else if(event.key === gamejs.event.K_LEFT){
       currentMovementP2 = "PreviewP2/slideP2.gif"
       changeMovement(2)
      }else if(event.key === gamejs.event.K_RIGHT){
       currentMovementP2 = "PreviewP2/snapP2.gif"
       changeMovement(2)
      }else if(event.key === gamejs.event.K_w){
       currentMovementP1 = "Preview/hips.gif"
       changeMovement(1)
      }else if(event.key === gamejs.event.K_s){
       currentMovementP1 = "Preview/skip.gif"
       changeMovement(1)
      }else if(event.key === gamejs.event.K_a){
       currentMovementP1 = "Preview/slide.gif"
       changeMovement(1)
      }else if(event.key === gamejs.event.K_d){
       currentMovementP1 = "Preview/snap.gif"
       changeMovement(1)
      }   
    }
  };

  //Deixa o jogo atualizando a cada segundo(tick). O que é chamado aqui dentro é executo na mesma frequencia.
  function gameTick(msDuration) {
    if(activeGame){
      gamejs.event.get().forEach(function(event) {
        handleEvent(event);
      });

      refreshCanMove()
      changeNextMovement()

      Player.registerHit(player1, player2);

      display.clear();
      player1.update(msDuration)
      player2.update(msDuration)
      display.blit(defaultFont.render("DANCE BATTLE", "#000000"), [930, 35]);
      display.blit(defaultFont.render("1 ", "#000000"), [170, 150]);
      display.blit(defaultFont.render(player1.health, "#000000"), [410, 240]);
      display.blit(defaultFont.render("Controls: W A S D", "#000000"), [180, 35]);
      display.blit(defaultFont.render("2 ", "#000000"), [1470, 150]);
      display.blit(defaultFont.render(player2.health, "#000000"), [1720, 240]);
      display.blit(defaultFont.render("Controls: \u2191 \u2193 \u2190 \u2192", "#000000"), [1540, 35]);

      if(player1.health === 0 || player2.health === 0){
        activeGame = false;
        if (player1.health === 0){
          display.blit(defaultFont.render("Player 1 Defeated", "#ffffff"), [800, 400]);
        }
        if (player2.health === 0){
          display.blit(defaultFont.render("Player 2 Defeated", "#ffffff"), [800, 470]);
          display.blit(Image.render(""))
        }
      };
    };
  };
  var player1 = new Player(0, 3);
  var player2 = new Player(1000, 3);
  gamejs.time.fpsCallback(gameTick, this, 1960);
};
gamejs.ready(main);

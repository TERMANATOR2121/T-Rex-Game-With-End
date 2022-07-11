var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloud, cloudsGroup, cloudImage;
var newImage;
var obstaclesGroup;
var PLAY = 0;
var END = 1 ;
var gamestate = PLAY;
var score = 0;
var gameover, gameoverImage, restart, restartImage;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  groundImage = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");222

  gameoverImage = loadImage("gameOver.png")
  restartImage = loadImage("restart.png")
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  //create a trex sprite
  trex = createSprite(30,500,20,30);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  //adding scale and position to trex
  trex.scale = 1;
  trex.x = 130
  
  //create ground sprite
  ground = createSprite(200,800,400,70);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  //create invisible ground
  invisibleGround = createSprite(200, ground.y + 30, 400, 10)
  invisibleGround.visible = false;
  //groups
  cloudsGroup = createGroup()
  obstaclesGroup = createGroup()

  gameover = createSprite(width/2, height/2 - 50)
  gameover.addImage(gameoverImage)
  gameover.scale = 1
  gameover.visible = false
  restart = createSprite(width/2, height/2)
  restart.addImage(restartImage)
  restart.scale = 0.6
  restart.visible = false
  // trex.debug = true
  // trex.setCollider("rectangle", 0, 0, trex.height, trex.width)
}

function draw() {
  background(180);
  textSize(25)
  text("SCORE: " + score, gameover.x -100, gameover.y - 80)
  text("Get a Score of 100 to Win", gameover.x - 150, gameover.y - 160)
  if(gamestate == PLAY){
    score += Math.round(getFrameRate()/60)  
    if(score % 500 == 0 && score != 0){
      checkpoint_sound.play()
    }
    ground.velocityX = -(6 + score/100)
    
    if (ground.x<700){
      ground.x = ground.width/2;
    }
    
    if(score >= 100) {
      gamestate = END;
     }

    //jumping the trex on space key press
    if(keyDown("up_arrow") && trex.y >= 776) {
      trex.velocityY = -14;
      touches = []
    }

    if(keyDown("down_arrow")) {
      trex.velocityY = +6;
      touches = []
    }
    
    trex.velocityY = trex.velocityY + 0.5        
    spawnClouds()
    spawnObstacles()
    if(trex.isTouching(obstaclesGroup)){
      gamestate = END
    }
  }
  else if(gamestate == END){
    ground.velocityX = 0
    cloudsGroup.setVelocityXEach(0)
    obstaclesGroup.setVelocityXEach(0)
    obstaclesGroup.setLifetimeEach(-1)
    trex.changeAnimation("collided")
    trex.velocityY = 0
    gameover.visible = true
    restart.visible = true
    if(mousePressedOver(restart)){
      reset()
    }

    if(score >= 100) {
      textSize(100)
      text("You Win, Congratulations", gameover.x - 500, gameover.y - 250);
      score = 100;
     }

  }
  drawSprites();
  //stop trex from falling down 
  trex.collide(invisibleGround);
}


function reset(){
  console.log()
  trex.changeAnimation("running")
  score = 0
  obstaclesGroup.destroyEach()
  cloudsGroup.destroyEach()
  gameover.visible = false
  restart.visible = false
  gamestate = PLAY
}

function spawnObstacles(){
  if(frameCount % 70 === 0){
    var obstacle = createSprite(width, height - 170, 10, 20)
    obstacle.velocityX = -(6 + score/100);

    var rand = Math.round(random(1, 5))
    switch(rand){
      case 1:
        obstacle.addImage(obstacle1)
        break
      case 2:
        obstacle.addImage(obstacle2)
        break
      case 3:
        obstacle.addImage(obstacle3)
        break
      case 4:
        obstacle.addImage(obstacle4)
        break
      case 5:
        obstacle.addImage(obstacle5)
        break
      case 6:
        obstacle.addImage(obstacle6)
        break
      default: break
  }
  obstacle.scale = 1;
  obstacle.lifetime = 400;
  obstaclesGroup.add(obstacle)
}
}



function spawnClouds(){
  if(frameCount % 60 === 0){
    cloud = createSprite(width, height - 100, 40, 10)
    cloud.addImage(cloudImage)
    cloud.y = Math.round(random(500, 700))
    cloud.scale = 0.8
    cloud.velocityX = -3
    cloud.depth = trex.depth
    trex.depth += 1
    cloudsGroup.add(cloud)
  } 
}

var PLAY = 1;
var END = 0;
var gameState = PLAY;

var girl, girl_running, girl_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var zombiesGroup, zombie1, zombie2, zombie3, zombie4, zombie5;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  girl_running = loadAnimation("girl1.png","girl2.png");
  girl_collided = loadAnimation("collided girl.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  
  zombie1 = loadImage("zombie1.png");
  zombie2= loadImage("zombie2.png");
  zombie3= loadImage("zombie3.png");
  zombie4= loadImage("zombie4.png");
  zombie5=loadImage("zombie5.png")

  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(600, 200);

  var message = "This is a message";
 console.log(message)
  
  girl = createSprite(50,160,20,50);
  girl.addAnimation("running", girl_running);
  girl.addAnimation("collided",girl_collided);
  

  girl.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //create Zombie and Cloud Groups
  zombiesGroup = createGroup();
  cloudsGroup = createGroup();

  
  girl.setCollider("rectangle",0,0,girl.width,girl.height);
  girl.debug = true
  
  score = 0;
  
}

function draw() {
  
  background(180);
  //displaying score
  text("Score: "+ score, 500,50);
  
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& girl.y >= 100) {
        girl.velocityY = -12;
        jumpSound.play();
    }
    
    //add gravity
    girl.velocityY = girl.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn zombies on the ground
    spawnzombies();
    
    if(zombiesGroup.isTouching(girl)){
        //girl.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //change the girl animation
      girl.changeAnimation("collided", girl_collided);
    
     
     
      ground.velocityX = 0;
      girl.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    zombiesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     zombiesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
   }
  
 
  //stop girl from falling down
  girl.collide(invisibleGround);
  
  if(mousePressedOver(restart)) {
      reset();
    }


  drawSprites();
}

function reset(){
  gameState=PLAY;
 gameOver.visible=false;
restart.visible=false;
zombiesGroup.destroyEach();
cloudsGroup.destroyEach();
girl.changeAnimation("running",girl_running);
score=0;
}


function spawnzombies(){
 if (frameCount % 60 === 0){
   var zombie = createSprite(600,165,10,40);
   zombie.velocityX = -(6 + score/100);
   
    //generate random zombies
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: zombie.addImage(zombie1);
              break;
      case 2:zombie .addImage(zombie2);
              break;
      case 3: zombie.addImage(zombie3);
              break;
      case 4: zombie.addImage(zombie4);
              break;
      case 5: zombie.addImage(zombie5);
              break;
      case 6: zombie.addImage(zombie6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the zombie          
    zombie.scale = 0.5;
    zombie.lifetime = 300;
   
   //add each zombie to the group
    zombiesGroup.add(zombie);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = girl.depth;
    girl.depth = girl.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}


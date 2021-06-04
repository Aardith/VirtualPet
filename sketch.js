var dog,sadDog,happyDog, database;
var foodS,foodStock;
var addFood;
var foodObj;
var lastFeed, feed;
//create feed and lastFed variable here


function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  //create feed the dog button here
  feed = createButton("Feed The Dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(46,139,87);
  foodObj.display();
  fedTime = database.ref("FeedTime");
  fedTime.on("value", function(data){
    lastFeed = data.val();
  })
 
  fill(255,255,254);
  textSize(15);
  if(lastFeed >= 12){
    text("last Feed:" + lastFeed % 12 + "PM", 350, 30);
  }
else if(lastFeed === 0 ){
  text("last Feed: 12AM", 350, 30);

} else{
  text("last Feed: " + lastFeed + "AM", 350, 30);
}
  
  
 
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog(){
  dog.addImage(happyDog);

  var foodStockval = foodObj.getFoodStock();
  if(foodStockval <= 0){
    foodObj.updateFoodStock(foodStockval *0);
  }
else{
  foodObj.updateFoodStock(foodStockval - 1);
}
database.ref("/").update(
  {
    Food: foodObj.getFoodStock(), 
    FeedTime: hour()
  }
)
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

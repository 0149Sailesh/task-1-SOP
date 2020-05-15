if (localStorage.getItem("hasCodeRunBefore") === null) {
    	
	        localStorage.setItem('score',0);
    		localStorage.setItem("hasCodeRunBefore", true);
    }

var canvas=document.querySelector('canvas');
var c=canvas.getContext('2d');
canvas.width=innerWidth;
canvas.height=innerHeight;
var score=0;
var cancel;
var speed1;
var timer=10;
var cancelTimer;
var arrbub=[];
var arrRock=[];
var totalBubbles=[];
var arrGaunlet=[];
var colorArr=['red','blue','green','orange'];
//Rock image
var img = new Image();
img.src="breakbubble.jpg";
//Gaunlet Image
var gaunglet=new Image();
gaunglet.src="gaunglet.png";
//rock generation
var speedRock;
//Gaunglet generation
var speedGaunlet;
var burst=document.querySelectorAll(".burst");
//Liquid luck
var luck=0;
var liqLuck=[0,0];
var luckInterval;
var state='r';

//to be cancelled timer update 

//collision function
function resolveCollision(bubble1, bubble2) {
    const xVelocityDiff = bubble1.velocity.x - bubble2.velocity.x;
    const yVelocityDiff = bubble1.velocity.y - bubble2.velocity.y;

    const xDist = bubble2.x - bubble1.x;
    const yDist = bubble2.y - bubble1.y;

    
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

        
        const angle = -Math.atan2(bubble2.y - bubble1.y, bubble2.x - bubble1.x);

        
        const m1 = bubble1.mass;
        const m2 = bubble2.mass;

        
        const u1 = rotate(bubble1.velocity, angle);
        const u2 = rotate(bubble2.velocity, angle);

        
        const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
        const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

        
        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        
        bubble1.velocity.x = vFinal1.x;
        bubble1.velocity.y = vFinal1.y;

        bubble2.velocity.x = vFinal2.x;
        bubble2.velocity.y = vFinal2.y;
    }
}
function rotate(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };

    return rotatedVelocities;
}
//bubble object
function bubble(x,y,radius,color)
{	
	this.x=x;
	this.y=y;
	this.radius=radius;
	this.color=color;
	this.dr=0.05;
	this.velocity= {
		x : Math.random()*5-2.5,
		y : Math.random()*5-2.5

	}
	this.mass=1;
	this.game= totalBubbles => {
		
		this.expand();
		this.draw();
		for(let i=0;i<totalBubbles.length;i++)
		{
			if(this===totalBubbles[i])
			{
				continue;
			}
			if (distance(this.x,this.y,totalBubbles[i].x,totalBubbles[i].y)<(this.radius+totalBubbles[i].radius)) 
			{
				resolveCollision(this,totalBubbles[i]);
			}


		}
		if(this.x<=this.radius || this.x+this.radius>=canvas.width)
		{
			this.velocity.x=-this.velocity.x;
		}
		if(this.y<=this.radius || this.y+this.radius>=canvas.height)
		{
			this.velocity.y=-this.velocity.y;
		}
		

		
		this.x+=this.velocity.x;
		this.y+=this.velocity.y;

	}
	this.draw=function(){
	  var gradient=c.createRadialGradient(this.x,this.y,5,this.x,this.y,this.radius);
	  gradient.addColorStop(0,'white');
	  gradient.addColorStop(1,this.color);

	  c.beginPath();
      c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      c.fillStyle = gradient;
      c.fill();
      c.closePath();
      
	}
	this.expand=function(){
		this.radius=this.radius+this.dr;
	}
	
}


//intial bubbles

for(let i=0;i<10;i++)
{	
	
	
	let radius=randomIntFromRange(20, 50);
	let x=randomIntFromRange(radius,canvas.width-radius);
	let y=randomIntFromRange(radius,canvas.height-radius);
	const color='blue';
	

	if(i!==0){
		for(let j=0;j<arrbub.length;j++)
		{
			if(distance(x,y,arrbub[j].x,arrbub[j].y)<(radius+arrbub[j].radius))
			{
				x=randomIntFromRange(radius,canvas.width-radius);
				y=randomIntFromRange(radius,canvas.height-radius);
				j=-1;
			}
		}
	}
	arrbub.push(new bubble(x,y,radius,color));

}
totalBubbles=arrbub.concat(arrRock,arrGaunlet);
cancel=requestAnimationFrame(animate);


function animate(){

	
	cancel=requestAnimationFrame(animate);
	c.clearRect(0,0,canvas.width,canvas.height);
	for(let i=0;i<totalBubbles.length;i++)
	{
		totalBubbles[i].game(totalBubbles);
	}
	
	c.font= "20px Arial";
     c.textBaseline='top';
     c.fillText('TIMER:'+timer+'       SCORE:'+score,canvas.width/2,0);
     check();
     c.font= "20px Arial";
     c.textBaseline='top';
     c.fillText('HIGH SCORE: '+localStorage.getItem('score'),canvas.width/4,0);
     totalBubbles=arrbub.concat(arrRock,arrGaunlet);
     if(luck===0)
     {
     	c.font= "20px Arial";
     c.textBaseline='top';
     c.fillText('LIQUID LUCK: X'+2,0,0);
     }
	else if(luck===1)
	{
		c.font= "20px Arial";
     c.textBaseline='top';
     c.fillText('LIQUID LUCK: X'+1,0,0);
	}
	else
	{
		c.font= "20px Arial";
     c.textBaseline='top';
     c.fillText('LIQUID LUCK: X'+0,0,0);
	}
}
function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)];
}

function distance(x1, y1, x2, y2) {
  var xDist = x2 - x1;
  var yDist = y2 - y1;
  return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}
var mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2
};
addEventListener('mousemove', function (event) {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});
canvas.addEventListener('click',function(){
	if(state==='r')
	{
	for(let i=0;i<arrbub.length;i++)
	{
		if(distance(mouse.x,mouse.y,arrbub[i].x,arrbub[i].y)<=arrbub[i].radius)
		{
			arrbub.splice(i,1);
			burst[0].play();

			totalBubbles=arrbub.concat(arrRock,arrGaunlet);
			score++;
		}
	}
	for(let i=0;i<arrRock.length;i++)
	{
		if (distance(mouse.x,mouse.y,arrRock[i].x,arrRock[i].y)<=arrRock[i].radius) 
		{
			arrRock[i].clicks+=1;
			if(arrRock[i].clicks>=5)
			{
				arrRock.splice(i,1);
				burst[0].play();
				totalBubbles=arrbub.concat(arrRock,arrGaunlet);
				score+=5;
			}
		}
	}
	for(let i=0;i<arrGaunlet.length;i++)
	{
		if (distance(mouse.x,mouse.y,arrGaunlet[i].x,arrGaunlet[i].y)<=arrGaunlet[i].radius) 
		{
			var status=setInterval(function(){
				arrGaunlet[i].state+=1;
				if(arrGaunlet[i].state===3)
			{
			score+=Math.floor((arrbub.length/2)+(arrRock.length/2)*5);

			arrbub.splice(0,arrbub.length/2);
			arrRock.splice(0,arrRock.length/2);
			arrGaunlet.splice(i,1);
			burst[0].play();

			totalBubbles=arrbub.concat(arrRock,arrGaunlet);
			clearInterval(status);
		}

			},250);

			
			
		}
	}
}})

	
		
		   speed1=setInterval(stage1,2000);
		   speedRock=setInterval(stageR1,5000);
		   speedGaunlet=setInterval(stageG1,10000);

//Gaunlet generation
function stageG1()
{
	if(score>=35)
	{
		clearInterval(speedGaunlet);
		speedGaunlet=setInterval(stageG2,8000);
	}
	let radius=50;
	let x=randomIntFromRange(radius,canvas.width-radius);
	let y=randomIntFromRange(radius,canvas.height-radius);
	const color='brown';
	
	//to prevent overlap
	if(totalBubbles.length!==0){
		for(let j=0;j<totalBubbles.length;j++)
		{
			if(distance(x,y,totalBubbles[j].x,totalBubbles[j].y)<(radius+totalBubbles[j].radius))
			{
				x=randomIntFromRange(radius,canvas.width-radius);
				y=randomIntFromRange(radius,canvas.height-radius);
				j=-1;
				continue;
			}
			

		}
	}
	arrGaunlet.push(new gaunlet(x,y,radius,color));
	totalBubbles=arrbub.concat(arrRock,arrGaunlet);
}
function stageG2()
{
	let radius=50;
	let x=randomIntFromRange(radius,canvas.width-radius);
	let y=randomIntFromRange(radius,canvas.height-radius);
	const color='brown';
	
	//to prevent overlap
	if(totalBubbles.length!==0){
		for(let j=0;j<totalBubbles.length;j++)
		{
			if(distance(x,y,totalBubbles[j].x,totalBubbles[j].y)<(radius+totalBubbles[j].radius))
			{
				x=randomIntFromRange(radius,canvas.width-radius);
				y=randomIntFromRange(radius,canvas.height-radius);
				j=-1;
				continue;
			}
			

		}
	}
	arrGaunlet.push(new gaunlet(x,y,radius,color));
	totalBubbles=arrbub.concat(arrRock,arrGaunlet);
}
	   

//Rock bubble generation with time
function stageR1()
{	if(score>=35)
	{
		clearInterval(speedRock);
		speedRock=setInterval(stageR2,2000);
	}
	let radius=50;
	let x=randomIntFromRange(radius,canvas.width-radius);
	let y=randomIntFromRange(radius,canvas.height-radius);
	const color='brown';
	
	//to prevent overlap
	if(totalBubbles.length!==0){
		for(let j=0;j<totalBubbles.length;j++)
		{
			if(distance(x,y,totalBubbles[j].x,totalBubbles[j].y)<(radius+totalBubbles[j].radius))
			{
				x=randomIntFromRange(radius,canvas.width-radius);
				y=randomIntFromRange(radius,canvas.height-radius);
				j=-1;
				continue;
			}
			

		}
	}
	arrRock.push(new rockbubble(x,y,radius,color));
	totalBubbles=arrbub.concat(arrRock,arrGaunlet);
}
function stageR2()
{
	let radius=50;
	let x=randomIntFromRange(radius,canvas.width-radius);
	let y=randomIntFromRange(radius,canvas.height-radius);
	const color='brown';
	
	//to prevent overlap
	if(totalBubbles.length!==0){
		for(let j=0;j<totalBubbles.length;j++)
		{
			if(distance(x,y,totalBubbles[j].x,totalBubbles[j].y)<(radius+totalBubbles[j].radius))
			{
				x=randomIntFromRange(radius,canvas.width-radius);
				y=randomIntFromRange(radius,canvas.height-radius);
				j=-1;
				continue;
			}
			

		}
	}
	arrRock.push(new rockbubble(x,y,radius,color));
	totalBubbles=arrbub.concat(arrRock,arrGaunlet);
}

//1st generation rate
function stage1(){
	if(score>=15)
	{
		clearInterval(speed1);
		speed1=setInterval(stage2,1500);
	}
	let radius=randomIntFromRange(20, 50);
	let x=randomIntFromRange(radius,canvas.width-radius);
	let y=randomIntFromRange(radius,canvas.height-radius);
	const color='blue';
	
	//to prevent overlap
	if(totalBubbles!==0){
		for(let j=0;j<totalBubbles.length;j++)
		{
			if(distance(x,y,totalBubbles[j].x,totalBubbles[j].y)<(radius+totalBubbles[j].radius))
			{
				x=randomIntFromRange(radius,canvas.width-radius);
				y=randomIntFromRange(radius,canvas.height-radius);
				j=-1;
			}
		}
	}
	arrbub.push(new bubble(x,y,radius,color));
	totalBubbles=arrbub.concat(arrRock,arrGaunlet);
}
//2nd generation rate
function stage2(){
	if(score>=35)
	{
		clearInterval(speed1);
		speed1=setInterval(stage3,1000);
	}
	
	let radius=randomIntFromRange(20, 50);
	let x=randomIntFromRange(radius,canvas.width-radius);
	let y=randomIntFromRange(radius,canvas.height-radius);
	const color='blue';
	
	

	if(totalBubbles.length!==0){
		for(let j=0;j<totalBubbles.length;j++)
		{
			if(distance(x,y,totalBubbles[j].x,totalBubbles[j].y)<(radius+totalBubbles[j].radius))
			{
				x=randomIntFromRange(radius,canvas.width-radius);
				y=randomIntFromRange(radius,canvas.height-radius);
				j=-1;
			}
		}
	}
	arrbub.push(new bubble(x,y,radius,color));
	totalBubbles=arrbub.concat(arrRock,arrGaunlet);

}
//3rd generation rate
function stage3(){
	let radius=randomIntFromRange(20, 50);
	let x=randomIntFromRange(radius,canvas.width-radius);
	let y=randomIntFromRange(radius,canvas.height-radius);
	const color='blue';
	
	

	if(totalBubbles.length!==0){
		for(let j=0;j<totalBubbles.length;j++)
		{
			if(distance(x,y,totalBubbles[j].x,totalBubbles[j].y)<(radius+totalBubbles[j].radius))
			{
				x=randomIntFromRange(radius,canvas.width-radius);
				y=randomIntFromRange(radius,canvas.height-radius);
				j=-1;
			}
		}
	}
	arrbub.push(new bubble(x,y,radius,color));
	totalBubbles=arrbub.concat(arrRock,arrGaunlet);
}
cancelTimer=setInterval(runTimer,1000);
function runTimer()
{
	if(area()>0.3)
	{
		timer--;
	}
	else
	{
		timer=10;
	}
	for(let i=0;i<arrbub.length;i++)
	{
		let y=Math.floor(Math.random() * 4);
		arrbub[i].color=colorArr[y];
	}
}


//Checking if timer <0
function check()
{
	if(timer<=0)
	{
	cancelAnimationFrame(cancel);
	clearInterval(speed1);
	clearInterval(speedRock);
	clearInterval(speedGaunlet);
	clearInterval(cancelTimer);
	state='p';
	if(score>=Number(localStorage.getItem('score')))
	{
		localStorage.setItem('score',score);
	}
	}
}
//calculating % of area occupied
function area()
{	var area=0;
	for(let i=0;i<totalBubbles.length;i++)
	{
		area+=Math.PI*totalBubbles[i].radius*totalBubbles[i].radius;
	}
	area=area/1127424;
	return area;
}
function rockbubble(x,y,radius,color)
{	this.clicks=0;
	this.x=x;
	this.y=y;
	this.radius=radius;
	this.color=color;
	this.dr=0.05;
	this.velocity= {
		x : Math.random()*5-2.5,
		y : Math.random()*5-2.5

	}
	this.mass=1;
	this.game= totalBubbles => {
		
		
		this.draw();
		for(let i=0;i<totalBubbles.length;i++)
		{
			if(this===totalBubbles[i])
			{
				continue;
			}
			if (distance(this.x,this.y,totalBubbles[i].x,totalBubbles[i].y)<(this.radius+totalBubbles[i].radius)) 
			{
				resolveCollision(this,totalBubbles[i]);
			}


		}
		if(this.x<=this.radius || this.x+this.radius>=canvas.width)
		{
			this.velocity.x=-this.velocity.x;
		}
		if(this.y<=this.radius || this.y+this.radius>=canvas.height)
		{
			this.velocity.y=-this.velocity.y;
		}
		

		
		this.x+=this.velocity.x;
		this.y+=this.velocity.y;

	}
	this.draw=function(){
	  if(this.clicks===0)
	  {
	  c.beginPath();
      c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      c.drawImage(img,90,0,80,88,this.x-40,this.y-44,80,88);
  	}
  	if(this.clicks===1)
	  {
	  c.beginPath();
      c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      c.drawImage(img,170,0,90,88,this.x-45,this.y-44,90,88);
  	}
  	if(this.clicks===2)
	  {
	  c.beginPath();
      c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      c.drawImage(img,260,0,80,88,this.x-40,this.y-44,80,88);
  	}
      if(this.clicks===3)
	  {
	  c.beginPath();
      c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      c.drawImage(img,340,0,90,88,this.x-45,this.y-44,90,88);
  	}
  	if(this.clicks===4)
	  {
	  c.beginPath();
      c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      c.drawImage(img,430,0,90,88,this.x-45,this.y-44,90,88);
  	}
  	if(this.clicks===5)
	  {
	  c.beginPath();
      c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      c.drawImage(img,520,0,80,88,this.x-40,this.y-44,80,88);
  	}
	}
}
function gaunlet(x,y,radius,color)
{	this.state=0;
	this.x=x;
	this.y=y;
	this.radius=radius;
	this.color=color;
	this.dr=0.05;
	this.velocity= {
		x : Math.random()*5-2.5,
		y : Math.random()*5-2.5

	}
	this.mass=1;
	this.game= totalBubbles => {
		
		
		this.draw();
		for(let i=0;i<totalBubbles.length;i++)
		{
			if(this===totalBubbles[i])
			{
				continue;
			}
			if (distance(this.x,this.y,totalBubbles[i].x,totalBubbles[i].y)<(this.radius+totalBubbles[i].radius)) 
			{
				resolveCollision(this,totalBubbles[i]);
			}


		}
		if(this.x<=this.radius || this.x+this.radius>=canvas.width)
		{
			this.velocity.x=-this.velocity.x;
		}
		if(this.y<=this.radius || this.y+this.radius>=canvas.height)
		{
			this.velocity.y=-this.velocity.y;
		}
		

		
		this.x+=this.velocity.x;
		this.y+=this.velocity.y;

	}
	this.draw=function(){
		if(this.state===0)
		{
	  c.beginPath();
      c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      c.drawImage(gaunglet,0,0,58,100,this.x-28,this.y-50,57,100);
  }
  if(this.state===1)
		{
	  c.beginPath();
      c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      c.drawImage(gaunglet,57,0,58,100,this.x-28,this.y-50,57,100);
  }
  if(this.state===2)
		{
	  c.beginPath();
      c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      c.drawImage(gaunglet,116,0,58,100,this.x-28,this.y-50,57,100);
  }
  if(this.state===3)
		{
	  c.beginPath();
      c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      c.drawImage(gaunglet,173,0,58,100,this.x-28,this.y-50,57,100);
  }
  if(this.state===4)
		{
	  c.beginPath();
      c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      c.drawImage(gaunglet,231,0,58,100,this.x-28,this.y-50,57,100);
  }
      
	}
}
document.addEventListener('keydown',function(event){
	if(event.key==='l')
	{
		clearInterval(luckInterval);
		if(luck<=1)
		{	clearInterval(speed1);
			clearInterval(speedRock);
			clearInterval(speedGaunlet);

	 luckInterval=setInterval(function(){
	if(liqLuck[luck]<=1)
	{
	let radius=randomIntFromRange(20, 50);
	let x=randomIntFromRange(radius,canvas.width-radius);
	let y=randomIntFromRange(radius,canvas.height-radius);
	const color='blue';
	
	

	if(totalBubbles.length!==0){
		for(let j=0;j<totalBubbles.length;j++)
		{
			if(distance(x,y,totalBubbles[j].x,totalBubbles[j].y)<(radius+totalBubbles[j].radius))
			{
				x=randomIntFromRange(radius,canvas.width-radius);
				y=randomIntFromRange(radius,canvas.height-radius);
				j=-1;
			}
		}
	}
	arrbub.push(new bubble(x,y,radius,color));
	totalBubbles=arrbub.concat(arrRock,arrGaunlet);
	liqLuck[luck]++;
}
	else
	{
		clearInterval(luckInterval);
		cancelAnimationFrame(cancel);
		luck++;
		resume();
		
	}


			},4000)
		}
	}
	if(event.key==='p')
{	state='p';
	cancelAnimationFrame(cancel);
	clearInterval(speed1);
	clearInterval(speedRock);
	clearInterval(speedGaunlet);
	clearInterval(cancelTimer);
}

if(event.key==='r')
{	state='r';
	resume();
}
if(event.key==='n')
{
	window.location.reload();
}

})
function resume()
{	clearInterval(cancelTimer);
	animate();
	if(score<=15)
	{
		speed1=setInterval(stage1,2000);
		speedRock=setInterval(stageR1,5000);
		 speedGaunlet=setInterval(stageG1,10000);
		 cancelTimer=setInterval(runTimer,1000);
	}
	else if(score>=15&&score<=35)
	{
		speed1=setInterval(stage2,1500);
		speedRock=setInterval(stageR1,5000);
		speedGaunlet=setInterval(stageG1,10000);
		 cancelTimer=setInterval(runTimer,1000);

	}
	else
	{
		speed1=setInterval(stage3,1000);
		speedGaunlet=setInterval(stageG2,8000);
		speedRock=setInterval(stageR2,2000);
		cancelTimer=setInterval(runTimer,1000);

	}
}
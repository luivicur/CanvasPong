var WIDTH;
var HEIGHT;
var g;
var rightDown = false;
var leftDown = false;
var carray = new Array();
var leftPaddle;
var rightPaddle;
var ball;


// Main Function To Start
function start()
{
	g = $('#canvas')[0].getContext("2d");
	WIDTH = $("#canvas").width();
	HEIGHT = $("#canvas").height();
	leftPaddle = new Paddle(100,50);
	rightPaddle = new Paddle(100,WIDTH-50);
	ball = new Circle(150,150,5);
	ball.reset(1);
	
	carray[0] = leftPaddle;
	carray[1] = rightPaddle;
	carray[2] = ball;
	return setInterval(draw, 10);
}

function resetGame(player)
{
	leftPaddle.reset();
	rightPaddle.reset();
	ball.reset(player);
}

// Get Key Input
function onKeyDown(evt) 
{
	if(evt.keyCode == 40) rightPaddle.setDy(1);
	else if(evt.keyCode == 38) rightPaddle.setDy(-1);
	
	if(evt.keyCode == 90) leftPaddle.setDy(1);
	else if(evt.keyCode == 65) leftPaddle.setDy(-1);
}

function onKeyUp(evt) 
{
	if (evt.keyCode == 40) rightPaddle.setDy(0);
	else if (evt.keyCode == 38) rightPaddle.setDy(0);
	
	if (evt.keyCode == 90) leftPaddle.setDy(0);
	else if (evt.keyCode == 65) leftPaddle.setDy(0);
}


// Circle Class	
function Circle()
{
	this.r = 5;
	this.x;
	this.y;
	this.dx;
	this.dy;
	
	this.draw = function()
	{
		g.beginPath();
		g.fillStyle = "#000";
		g.arc(this.x, this.y, this.r, 0, Math.PI*2, true);
		g.closePath();
		g.fill();
	}
	
	this.move = function()
	{	
		this.x += this.dx;
		this.y += this.dy;
		
		if(this.y > HEIGHT || this.y < 0)
		{
			this.invertY();
		}
		
		if(leftPaddle.collides(this.x, this.y))
		{
			this.invertX();
			var mod = leftPaddle.getBounceModifier(this.y);
			this.dy += mod;
		}
		
		if(rightPaddle.collides(this.x, this.y))
		{
			this.invertX();
			var mod = rightPaddle.getBounceModifier(this.y);
			this.dy += mod;
		}
		
		if(this.x > WIDTH || this.x < 0)
		{
			resetGame(this.x);
		}
	}
	
	this.invertX = function()
	{
		if(this.dx > 0) this.dx += 0.5;
		else this.dx += -0.5;
		
		this.dx = this.dx*-1;
	}

	this.invertY = function()
	{
		this.dy = this.dy*-1;
	}
	
	this.reset = function(dir)
	{
		this.y = HEIGHT/2;
		this.x = WIDTH/2;
		this.dy = Math.ceil(Math.random()*4);
		
		if(dir > 0)
			this.dx = Math.ceil(Math.random()*3) + 1;
		else
			this.dx = -1 * Math.ceil(Math.random()*3) -1 ;
	}
	
	this.getX = function()
	{
		return x;
	}
	
	this.getY = function()
	{
		return this.y;
	}
}

function Paddle(length,x)
{
	this.x = x;
	this.y = HEIGHT/2;
	this.length = length;
	this.dy = 0;
	
	this.draw = function()
	{
		g.beginPath();
		g.fillStyle = "#000";
		var top = this.y - this.length/2;
		g.fillRect(this.x, top, 10, this.length);
		g.closePath();
		g.fill();
	}
	
	this.collides = function(x,y)
	{
		var col = false;
		if( Math.abs(x-this.x)<5 ) //&& se mueve en direccion a la paleta
		{
			var top = this.y - this.length/2;
			var bottom = top + this.length;
			if(y < bottom && y > top)
			{
				col = true;
			}
		}
		return col;
	}
	
	this.getBounceModifier = function(y)
	{
		var delta = this.y - y;
		var proportion = (delta/this.length) * (Math.PI/2);
		var mod = Math.sin(proportion);
		return mod * 0.75;
	}
	
	this.move = function()
	{
		//Falta limitar el movimiento
		this.y += this.dy;
	}
	
	this.reset = function()
	{
		this.dy = 0;
		this.y = HEIGHT/2;
	}
	
	this.getX = function()
	{
		return x;
	}
	
	this.getY = function()
	{
		return this.y;
	}
	
	this.setDy = function(dir)
	{
		if(dir > 0) this.dy = 3;
		else if(dir < 0) this.dy = -3;
		else this.dy = 0;
	}	
}


// Draw Function
function draw()
{
	clear();
	var i;
	for (i=0; i<carray.length; i++)
	{
		carray[i].move();
		carray[i].draw();
	}
}

function clear() 
{
	g.fillStyle = "#fff";
	g.fillRect(0, 0, WIDTH, HEIGHT);
}

// Use JQuery to wait for document load
$(document).ready(function()
{
	start();
});

$(document).keydown(onKeyDown);
$(document).keyup(onKeyUp);

var g = {

cell: function (state){
	this.width = g.config.cellsize;
	this.height = g.config.cellsize;
	this.age = 0;
	this.state = state;
	this.neighbours = 0;

},

config: {
	running: false,
	fps:24,
	cellsize:4,
	canvas_width:500,
	canvas_height:500,
	random_number:0.4,
	templates:{
		dot:false,
		glider:true
	}
},

func:{
	check_template: function() {
		if (!g.config.templates.dot) {
			for (var template in g.config.templates) {
				if (template) { console.log(template)}
			}
		}	
	},

	glider:function(x,y) {
		g.grid[x][y].state = true;
		g.grid[x+g.config.cellsize][y].state = true;
		g.grid[x-g.config.cellsize][y-g.config.cellsize].state = true;
		g.grid[x][y+g.config.cellsize].state = true;
		g.grid[x-g.config.cellsize][y+g.config.cellsize].state = true;
	},

	wrap: function (x, max){ 
		var min = 0;
		// -10, return 500 - 10 = 490
		if (x < min) {
			return max + x
		}
		// x = 0 return 500 - 10
		else if (x === min) {
			return max - g.config.cellsize
		}
		// x = 510 return 0 + 10 = 10
		else if (x > max) {
			return min + g.config.cellsize
		}
		// 490, 500 <= 500   
		else if (x <= max){
			return max % x 
		}
		// return x < 0 ? max + x : min
	},



	get_neighbour:function(x, y) {
		if (g.grid[x] && g.grid[x][y]){
			return g.grid[x][y].state
		} else {
			(g.grid[x]) ? x = x : x = g.func.wrap(x, g.config.canvas_width);
			(g.grid[y]) ? y = y : y = g.func.wrap(y, g.config.canvas_height);
			return g.grid[x][y].state
		}
	},

	check_neighbours: function(){
			// for x in xrange(canvas.width -1, 10)
		for (var x = 0; x < g.config.canvas_width +1; x += g.config.cellsize) {
				// for y in xrange(canvas.height -1, 10)
			for (var y = 0; y < g.config.canvas_height +1; y +=g.config.cellsize) {
					g.grid[x][y].neighbours = 0

					if (g.func.get_neighbour(x, y-g.config.cellsize)){
						g.grid[x][y].neighbours += 1;
					};

					if (g.func.get_neighbour(x, y+g.config.cellsize)){
						g.grid[x][y].neighbours += 1;
					};

					if (g.func.get_neighbour(x-g.config.cellsize, y)){
						g.grid[x][y].neighbours += 1;
					};
					if (g.func.get_neighbour(x+g.config.cellsize, y)){
						g.grid[x][y].neighbours += 1;
					}; 
					if (g.func.get_neighbour(x-g.config.cellsize, y-g.config.cellsize)){
						g.grid[x][y].neighbours += 1;
					};
					if (g.func.get_neighbour(x+g.config.cellsize, y+g.config.cellsize)){
						g.grid[x][y].neighbours += 1;
					};
					if (g.func.get_neighbour(x+g.config.cellsize, y-g.config.cellsize)){
						g.grid[x][y].neighbours += 1;
					};
					if (g.func.get_neighbour(x-g.config.cellsize, y+g.config.cellsize)){
						g.grid[x][y].neighbours += 1;
					};
			}
		}
	},

	set_state: function(){
			// for x in xrange(canvas.width -1, 10)
		for (var x = 0; x < g.config.canvas_width +1; x += g.config.cellsize) {
				// for y in xrange(canvas.height -1, 10)
			for (var y = 0; y < g.config.canvas_height +1; y +=g.config.cellsize) {

					if (g.grid[x][y].state) {
						if (g.grid[x][y].neighbours < 2){
							g.grid[x][y].state = false;
							g.grid[x][y].age = 0;
						}
						else if (g.grid[x][y].neighbours in [2, 3]){
							g.grid[x][y].state = true;
						}
						else if (g.grid[x][y].neighbours > 3){
							g.grid[x][y].state = false;
							g.grid[x][y].age = 0;
						}
					}
					else if (!g.grid[x][y].state){
						if (g.grid[x][y].neighbours === 3){
							g.grid[x][y].state = true;
						}
						else{
							g.grid[x][y].state = false;
							g.grid[x][y].age = 0;
							}
					}
			}
		}
	}
},


grid: {
	init:function(){
		for (var x = 0; x < g.config.canvas_width +1; x += g.config.cellsize) {
			g.grid[x] = []
			for (var y = 0; y < g.config.canvas_height +1; y +=g.config.cellsize) {
				if (Math.random() < g.config.random_number){
					g.grid[x][y] = new g.cell(false)
				}
				else {
					g.grid[x][y] = new g.cell(true)
					g.canvas.ctx.fillRect(x, y, g.config.cellsize, g.config.cellsize)
				}
			}
		}
	},

	update_grid:function(){
	for (var x = 0; x < g.config.canvas_width +1; x += g.config.cellsize) {
		for (var y = 0; y < g.config.canvas_height +1; y +=g.config.cellsize) {
			if (g.grid[x][y].state) {
				g.canvas.ctx.fillRect(x, y, g.config.cellsize, g.config.cellsize)
			} else {
				g.canvas.ctx.clearRect(x, y, g.config.cellsize, g.config.cellsize)
			}
			}
		}
	}
},


events:{

	show_cursor:function(e){

		var pos = g.events.findOffset(g.canvas.c);
		mouseX = (e.pageX - pos.x) - ((e.pageX - pos.x) % g.config.cellsize);
		mouseY = (e.pageY - pos.y) - ((e.pageY - pos.y) % g.config.cellsize);
		if (g.config.templates["glider"]) {
			g.func.glider(mouseX, mouseY)
		} else {
			g.grid[mouseX][mouseY].state = true;
		}
		g.grid.update_grid();
		g.canvas.ctx.fillRect(mouseX, mouseY, 10, 10);
	},

	findOffset:function(obj){
    var curX = curY = 0;
    if (obj.offsetParent) {
        do {
           curX += obj.offsetLeft;
           curY += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return {x:curX,y:curY};
    }
	}

},

canvas: {
	c:null,
	ctx:null,

	init:function(){
		this.c = document.getElementById('canvas');
		this.ctx = this.c.getContext('2d');
		this.c.width = g.config.canvas_width;
		this.c.height = g.config.canvas_height;
		this.c.addEventListener("mousedown", g.events.show_cursor, false);
	},

	drawgrid:function(){
		for (var x = 0.5; x < g.config.canvas_width +1; x += g.config.cellsize){
			this.ctx.moveTo(x, 0);
			this.ctx.lineTo(x, g.config.canvas_height);
		}
		for (var y = 0.5; y < g.config.canvas_height +1; y += g.config.cellsize){
			this.ctx.moveTo(0, y);
			this.ctx.lineTo(g.config.canvas_width, y);
		}
		this.ctx.strokeStyle = "black"
		//strokes seem to be increasing in draw time over time. not sure why.
		this.ctx.stroke();
	}
},



init: function() {
	g.canvas.init();

	//g.canvas.drawgrid();
	g.func.check_template();
	g.grid.init();
	g.main();

},

main:function(){
		 setTimeout(function() {
		requestAnimationFrame(g.main);
			g.func.check_neighbours();
			g.func.set_state();
			g.grid.update_grid();
			// g.canvas.drawgrid();
	 }, 1000/g.config.fps)
	}
}



var g = {

config: {
	running: false,
	fps:30,
	templates:{
		dot:false,
		glider:false
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

wrap: function (x, min, max){ 
	//if X is less than 0, return 500 + -10 or 510 + 0 
	return x < 0 ? max + x : min
},


get_neighbour:function(x, y) {
	if (g.grid[x] && g.grid[x][y]){
		return g.grid[x][y].state
	} else {
		x = g.func.wrap(x, 0, 500);
		y = g.func.wrap(y, 0, 500);
		return g.grid[x][y].state
	}
},
	check_neighbours: function(){
			// for x in xrange(canvas.width -1, 10)
		for (var x = 0; x < g.canvas.width +10; x += 10) {
				// for y in xrange(canvas.height -1, 10)
			for (var y = 0; y < g.canvas.height +10; y +=10) {
					g.grid[x][y].neighbours = 0

					if (g.func.get_neighbour(x, y-10)){
						g.grid[x][y].neighbours += 1;
					};

					if (g.func.get_neighbour(x, y+10)){
						g.grid[x][y].neighbours += 1;
					};

					if (g.func.get_neighbour(x-10, y)){
						g.grid[x][y].neighbours += 1;
					};
					if (g.func.get_neighbour(x+10, y)){
						g.grid[x][y].neighbours += 1;
					}; 
					if (g.func.get_neighbour(x-10, y-10)){
						g.grid[x][y].neighbours += 1;
					};
					if (g.func.get_neighbour(x+10, y+10)){
						g.grid[x][y].neighbours += 1;
					};
					if (g.func.get_neighbour(x+10, y-10)){
						g.grid[x][y].neighbours += 1;
					};
					if (g.func.get_neighbour(x-10, y+10)){
						g.grid[x][y].neighbours += 1;
					};
			}
		}
	},

	set_state: function(){
			// for x in xrange(canvas.width -1, 10)
		for (var x = 0; x < g.canvas.width +10; x += 10) {
				// for y in xrange(canvas.height -1, 10)
			for (var y = 0; y < g.canvas.height +10; y +=10) {

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


cell: function (state){
	this.width = 10;
	this.height = 10;
	this.age = 0;
	this.state = state;
	this.neighbours = 0;

},

grid: {
	init:function(){
		for (var x = 0; x < g.canvas.width +10; x += 10) {
			g.grid[x] = []
			for (var y = 0; y < g.canvas.height +10; y +=10) {
				if (Math.random() < 0.5){
					g.grid[x][y] = new g.cell(false)
				}
				else {
					g.grid[x][y] = new g.cell(true)
					g.canvas.ctx.fillRect(x, y, 10, 10)
				}
			}

		}
	},

	update_grid:function(){
	for (var x = 0; x < g.canvas.width +10; x += 10) {
		for (var y = 0; y < g.canvas.height +10; y +=10) {
			if (g.grid[x][y].state) {
				g.canvas.ctx.fillRect(x, y, 10, 10)
			} else {
				g.canvas.ctx.clearRect(x, y, 10, 10)
			}
			}
		}
	}
},


canvas: {
	width:null,
	height:null,
	c:null,
	ctx:null,

	init:function(){
		this.c = document.getElementById('canvas');
		this.ctx = this.c.getContext('2d');
		this.width = this.c.width;
		this.height = this.c.height;
	},

	drawgrid:function(){
		for (var x = 0.5; x < g.canvas.width +10; x += 10){
			this.ctx.moveTo(x, 0);
			this.ctx.lineTo(x, g.canvas.height);
		}
		for (var y = 0.5; y < g.canvas.height +10; y += 10){
			this.ctx.moveTo(0, y);
			this.ctx.lineTo(g.canvas.width, y);
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
	console.log(g.grid);
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


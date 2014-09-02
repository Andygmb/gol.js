
var g = {



config: {
	running: false,
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

	check_neighbours: function(){
		for (var x = 0; x < g.canvas.width -1; x += 10) {
			for (var y = 0; y < g.canvas.height -1; y +=10) {
				try {
					g.grid[x][y].neighbours = 0
					if (g.grid[x][y-10].state) {
						g.grid[x][y].neighbours += 1;
					}
					if (g.grid[x][y+10].state) {
						g.grid[x][y].neighbours += 1;
					}
					if (g.grid[x-10][y].state) {
						g.grid[x][y].neighbours += 1;
					}
					if (g.grid[x+10][y].state) {
						g.grid[x][y].neighbours += 1;
					}
					if (g.grid[x-10][y-10].state) {
						g.grid[x][y].neighbours += 1;
					}
					if (g.grid[x+10][y+10].state) {
						g.grid[x][y].neighbours += 1;
					}
					if (g.grid[x+10][y-10].state) {
						g.grid[x][y].neighbours += 1;
					}
					if (g.grid[x-10][y+10].state) {
						g.grid[x][y].neighbours += 1;
					}
				}	catch (e) {}
			}
		}
	},

	set_state: function(){
		for (var x = 0; x < g.canvas.width -1; x += 10) {
			for (var y = 0; y < g.canvas.height -1; y +=10) 
			{
				try {
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

				catch (e) {}
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
		for (var x = 0; x < g.canvas.width -1; x += 10) {
			g.grid[x] = []
			for (var y = 0; y < g.canvas.height -1; y +=10) {
				if (Math.random() < 0.5){
					g.grid[x][y] = new g.cell(false)
				}
				else {
					g.grid[x][y] = new g.cell(true)
					g.canvas.ctx.fillRect(x, y, 10, 10)
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
		for (var x = 0.5; x < this.width; x += 10){
			this.ctx.moveTo(x, 0);
			this.ctx.lineTo(x, this.height);
		}
		for (var y = 0.5; y < this.height; y += 10){
			this.ctx.moveTo(0, y);
			this.ctx.lineTo(this.width, y);
		}
		this.ctx.strokeStyle = "black"
		this.ctx.stroke();
	}
},



init: function() {
	g.canvas.init();
	g.canvas.drawgrid();
	g.func.check_template();
	g.grid.init();
	console.log(g.grid);

	g.main();
},

main:function(){
g.func.check_neighbours();
g.func.set_state();
}

}





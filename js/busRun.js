
/**
  * bus constructor
  * @param paper the Rapael.paper that the bus draw in
  */
function Bus(paper){
	this.paper     = paper;
	this.time      = 8000;
	this.bodyWidth = 200;
	this.distance  = paper.width - this.bodyWidth;
	this.isRun     = false;
	
	// function
	if (typeof this.paint == "undefined"){
		/**
	  	  * draw the bus on the paper and initialization
	  	  */
		Bus.prototype.paint = function (){

			/*	draw bus's body 	*/
			this.body = paper.rect(0,0,this.bodyWidth,80,5);
			this.body.attr("fill", "yellow");
			
			/*	draw bus's tires	*/
			this.tire = [
				paper.circle(40,80,20), 
				paper.circle(160,80,20)
			];

			this.tire.forEach(function (value){
				value.attr("fill","black")
			});

			/*	draw bus's tire lines	*/
			this.line = [
				paper.path("M21 80L59 80"),
				paper.path("M40 61L40 99"),
				paper.path("M141 80L179 80"),
				paper.path("M160 61L160 99")
			]

			this.line.forEach(function (value){
				value.attr("stroke-width","6px");
				value.attr("stroke","green");
			});

			/*	draw bus's windows	*/
			this.window = [
				paper.rect(15,15,18,18,1),
				paper.rect(48,15,18,18,1),
				paper.rect(81,15,18,18,1),
				paper.rect(114,15,18,18,1),
				paper.rect(147,15,18,18,1),
				paper.rect(180,15,20,25,1)
			];

			this.window.forEach(function (value) {
				value.attr("fill","gray");
			});

			/*	add bus's animation 	*/ 
			this.moveBody = Raphael.animation({
				transform:"t" + this.distance + ",0"
			},this.time);

			this.moveLine = Raphael.animation({
				transform:"t" + this.distance + ",0 r3000"
			},this.time);
		}

		/**
		  * bind animatetion function to bus
		  * @param action 	'animate' bind animation
		  *			 		'stop' stop animation
		  */
		Bus.prototype._do = function (action){
			var that = this;
			// add bus body's action
			this.body[action](that.moveBody);

			// add bus tires' action
			this.tire.forEach(function (value){
				value[action](that.moveBody);
			});

			// add bus windows' action
			this.window.forEach(function (value){
				value[action](that.moveBody);
			});

			// add bus tire lines' action
			this.line.forEach(function (value){
				value[action](that.moveLine);
			});
		}

		/**
		  * while changing the speed, update the animation in bus
		  */
		Bus.prototype._updateAni = function () {
			var distance    = this.distance;
			var time        = this.time;
			var busLocation = this.body.getBBox().x;
			var rate        = 1-(busLocation/distance);
			
			this.moveBody   = Raphael.animation({
				transform : "t"+distance+",0"
			},time*rate);

			this.moveLine 	= Raphael.animation({
				transform : "t"+distance+",0 r3000"
			},time*rate);
		}
	

		/**
	  	  * bus move
	  	  */
		Bus.prototype.move = function (){
			this._do("animate");
			this.isRun = true;
		}


		/**
	  	  * bus stop
	  	  */
		Bus.prototype.stop = function (){
			this._do("stop");
			this.isRun = false;
		}

		/**
		  * bus changes speed
		  * @param action 	'up' speed up
		  * 				'down' speed down
		  */
		Bus.prototype.changeSpeed = function (action){
			var isChange = false;

			if (action == 'up' 
				&& this.time >2000) {
				this.time -= 2000;
				isChange   = true;
			} else if (action == 'down' 
				&& this.time<16000) {
				this.time += 2000;
				isChange   = true;
			}
			if (isChange){
				var state = this.isRun;
				this.stop();
				this._updateAni();
				if (state) {
					this.move();
				}
			}
		}
	}
	 this.paint(paper);
}


/**
  * panel : control the bus
  */
function Panel(bus, btnStart, btnStop, btnPause, btnResume, btnSpeedUp, btnSpeedDwon, speedLine) {
	this.bus          = bus;
	this.btns         = [btnStart, btnStop, btnPause, btnResume];
	this.speedLine    = speedLine;
	this.btnSpeedUp   = btnSpeedUp;
	this.btnSpeedDwon = btnSpeedDwon;

	var _panel         = this;

	if (typeof this.btnsInit == "undefined"){

		// After clicking, buttons changes array
		Panel.prototype.btnsInit     = ['abled','hide','disabled','hide'];
		Panel.prototype.btnsRuning   = ['hide','abled','abled','hide'];
		Panel.prototype.btnsPause    = ['hide', 'abled', 'hide', 'abled'];

		/**
		  * buttons change when you click it
		  */
		Panel.prototype.btnsChange = function (actions){
			var i, action;

			for (i in this.btns){
				el = this.btns[i];
				action = actions[i];

				if (action == 'disabled'){
					el.style.display = 'inline-block';
					el.setAttribute('disabled','')
				} else if (action == 'hide'){
					el.style.display = 'none';
				} else if (action == 'abled'){
					el.style.display = 'inline-block';
					el.removeAttribute('disabled');
				}
			}
		}

		/**
		  * show speed on speedLine
		  */
		Panel.prototype.showSpeed = function (){
			this.speedLine.style.backgroundPosition = (((this.bus.time-2000)/14000)*100)+"% 0%";
		}

		/**
		  * panel's initialize
		  */
		Panel.prototype.init = function (){
			this.btnsChange(this.btnsInit);
			this.showSpeed();
		}
		
	}

	this.init();

	btnStart.onclick = function (){
		bus.move();
		_panel.btnsChange(_panel.btnsRuning);
	}

	btnStop.onclick = function (){
		bus.stop();
		bus.paper.clear();
		bus.paint();
		_panel.init();
	}

	btnPause.onclick = function (){
		bus.stop();
		_panel.btnsChange(_panel.btnsPause)
	}

	btnResume.onclick = function (){
		bus.move();
		_panel.btnsChange(_panel.btnsRuning);
	}

	btnSpeedUp.onclick = function (){
		bus.changeSpeed("up");
		_panel.showSpeed();
	}

	btnSpeedDwon.onclick = function (){
		bus.changeSpeed("down");
		_panel.showSpeed();
	}
}

function $(id){
	return document.getElementById(id);
}

new Panel(new Bus(Raphael("svg",1300,150)), $("start"), $("stop"), $("pause"), $("resume"), $("speedUp"), $("speedDown"), $("speedLine"));
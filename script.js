var juego=new Phaser.Game(600,800,Phaser.CANVAS,'escenario');
var fondoJuego;
var persona;
var teclaDerecha;
var teclaIzquierda;
var teclaArriba;
var teclaAbajo;
var botonDisparo;

var personaje;
var enemigos;

var balas;
var tiempoBala=0;

var estadoPrincipal={
	preload: function(){
		juego.load.image('fondo','img/fondo.png');
		juego.load.spritesheet('animacion','img/Gato.png',128,128);
		juego.load.spritesheet('enemigo','img/enemigo2.png',70,70);
		juego.load.image('laser','img/huella.png');
		juego.load.audio('laserSound','sound/laserSound.mp3'); //precarga de sonido
		juego.load.audio('destruccion','sound/destruccion.mp3'); //no funciona aun

		juego.load.audio('musica','sound/fondo.mp3'); //no funciona aun

	},
	

	create: function(){

		fondoJuego=juego.add.tileSprite(0,0,600,800,'fondo');
		personaje=juego.add.sprite(230,500,'animacion');
		personaje.animations.add('movimiento',[0,1,2,3,4,5],5,true);
		this.laserSound = this.sound.add('laserSound'); //instancia de sonido

		this.destruccion = this.sound.add('destruccion'); //instancia de sonido

		this.musica = this.sound.add('musica');

		// Reproducir la música en bucle/en true
		this.musica.play('', 0, 1, true);

		balas=juego.add.group();
		balas.enableBody=true;
		balas.physicsBodyType=Phaser.Physics.ARCADE;
		balas.createMultiple(20,'laser');
		balas.setAll('anchor.x',-2);
		balas.setAll('anchor.y',1);
		balas.setAll('outOfBoundsKill',true);
		balas.setAll('checkWorldBounds',true);
		
		
		enemigos=juego.add.group();
		enemigos.enableBody=true;
		enemigos.physicsBodyType=Phaser.Physics.ARCADE;
		for (let y = 0; y < 3; y++) {
			for (let x = 0; x < 3; x++) {
				var enemig = enemigos.create(x*70,y*70,'enemigo')
				enemig.anchor.setTo(0.5);
			}
		}

		//posicion enemigos
		enemigos.x=100;
		enemigos.y=100;

		var animacion=juego.add.tween(enemigos).to(
			{x:320}, //velocidad
			1000,Phaser.Easing.Linear.None,true,0,1000,true
		);

		teclaDerecha=juego.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
		teclaIzquierda=juego.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		teclaArriba=juego.input.keyboard.addKey(Phaser.Keyboard.UP);
		teclaAbajo=juego.input.keyboard.addKey(Phaser.Keyboard.DOWN);

		botonDisparo=juego.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	},

	update: function(){

		fondoJuego.tilePosition.x-=1;

		if(teclaDerecha.isDown){
			personaje.x += 3;
			personaje.animations.play('movimiento');
		}
		if(teclaIzquierda.isDown){
			personaje.x -= 3;
			personaje.animations.play('movimiento');
		}
		if(teclaArriba.isDown){
			personaje.y -= 3;
			personaje.animations.play('movimiento');
		}
		if(teclaAbajo.isDown){
			personaje.y += 3;
			personaje.animations.play('movimiento');
		}

		var bala;
		if (botonDisparo.isDown) {
			if (juego.time.now>tiempoBala) {
				bala=balas.getFirstExists(false);
			}
			if (bala) {
				bala.reset(personaje.x,personaje.y);
				bala.body.velocity.y=-300;
				tiempoBala=juego.time.now+400; //cadencia de disparo
			}
			this.laserSound.play(); //reproducción del sonido al disparar
		}

		juego.physics.arcade.overlap(balas,enemigos,colision,null,this);

	}
};

function colision(bala, enemigo) {
	bala.kill();
	enemigo.kill();
	this.destruccion.play();
}

function colision2(personaje, enemigo) {
	personaje.kill();
	personaje.kill();
	this.destruccion.play();
}

juego.state.add('principal',estadoPrincipal);
juego.state.start('principal');
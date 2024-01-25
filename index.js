import {Inicio} from './inicio.js';
import {Game} from './script.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 500,
    scene: [Game,Inicio],
    physics:{
        default: 'arcade',
        arcade: {
            debug:false
        }
    }
}

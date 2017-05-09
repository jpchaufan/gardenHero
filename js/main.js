var GardenHero = GardenHero || {};

GardenHero.game = new Phaser.Game(576, 384, Phaser.CANVAS); // 9:6 @ 64px/sq


GardenHero.game.state.add('Preload', GardenHero.PreloadState);
GardenHero.game.state.add('Game', GardenHero.GameState);


GardenHero.game.state.start('Preload');
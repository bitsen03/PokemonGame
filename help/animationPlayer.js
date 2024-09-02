import animationUnit from "./animationUnit.js";



const animationPlayer = (player, lastKey, speedAnamation = 10) => {
    
    animationUnit(player, speedAnamation);

    switch (lastKey){
        case 'w':
            player.image = player.sprites.playerUpImage;
            break;
        case 'a':
            player.image = player.sprites.playerLeftImage;
            break;
        case 's': 
            player.image = player.sprites.playerDownImage;
            break;
        case 'd': 
            player.image = player.sprites.playerRightImage;
            break;
    }

}

export default animationPlayer;
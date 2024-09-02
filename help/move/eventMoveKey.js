const eventMoveKey = (keys) => {

    window.addEventListener('keyup', (e) => {

        switch(e.key.toLowerCase()){
            case 'w':
                keys.w.pressed = false;
                break
            case 'a':
                keys.a.pressed = false;
                break
            case 's':
                keys.s.pressed = false;
                break
            case 'd':
                keys.d.pressed = false;
                break        
        }
    })
    
    window.addEventListener('keydown', (e) => {

        switch(e.key.toLowerCase()){
            case 'w':
                keys.w.pressed = true;
                keys.lastKey = 'w'
                break
            case 'a':
                keys.a.pressed = true;
                keys.lastKey = 'a'
                break
            case 's':
                keys.s.pressed = true;
                keys.lastKey = 's'
                break
            case 'd':
                keys.d.pressed = true;
                keys.lastKey = 'd'
                break        
        }
    })
}

export default eventMoveKey;

import animationPlayer from "../animationPlayer.js";
import rectangleCollisions from "../rectangleCollosoons.js";

let moving = true;

const move = (keys, player, boundaries, movables) => {
    moving = true;
    // Проверка для каждого направления отдельно
    if (keys.w.pressed && keys.lastKey === 'w') {
        animationPlayer(player, keys.lastKey)
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (rectangleCollisions({
                rectangle1: player,
                rectangle2: {
                    ...boundary,
                    position: {
                        x: boundary.position.x,
                        y: boundary.position.y + 3, // Положение после движения
                    }
                }
            })) {
                moving = false;
                break;
            }
        }
        if (moving) {
            movables.forEach((movable) => {
                movable.position.y += 3;
            });
        }
    }

    if (keys.a.pressed && keys.lastKey === 'a') {
        animationPlayer(player, keys.lastKey);
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (rectangleCollisions({
                rectangle1: player,
                rectangle2: {
                    ...boundary,
                    position: {
                        x: boundary.position.x + 3,
                        y: boundary.position.y,
                    }
                }
            })) {
                moving = false;
                break;
            }
        }
        if (moving) {
            movables.forEach((movable) => {
                movable.position.x += 3;
            });
        }
    }

    if (keys.s.pressed && keys.lastKey === 's') {
        animationPlayer(player, keys.lastKey);
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (rectangleCollisions({
                rectangle1: player,
                rectangle2: {
                    ...boundary,
                    position: {
                        x: boundary.position.x,
                        y: boundary.position.y - 3,
                    }
                }
            })) {
                moving = false;
                break;
            }
        }
        if (moving) {
            movables.forEach((movable) => {
                movable.position.y -= 3;
            });
        }
    }

    if (keys.d.pressed && keys.lastKey === 'd') {
        animationPlayer(player, keys.lastKey);
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i];
            if (rectangleCollisions({
                rectangle1: player,
                rectangle2: {
                    ...boundary,
                    position: {
                        x: boundary.position.x - 3,
                        y: boundary.position.y,
                    }
                }
            })) {
                moving = false;
                break;
            }
        }
        if (moving) {
            movables.forEach((movable) => {
                movable.position.x -= 3;
            });
        }
    }
}

export default move;
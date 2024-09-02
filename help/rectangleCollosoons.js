const rectangleCollisions = ({rectangle1, rectangle2}) => {
    return (
        rectangle1.position.x + (rectangle1.width -10) >= rectangle2.position.x && 
        rectangle1.position.x - (rectangle1.width -10) <= rectangle2.position.x &&
        rectangle1.position.y + (rectangle1.height - 5) >= rectangle2.position.y && 
        rectangle1.position.y - (rectangle1.height -50) <= rectangle2.position.y
    )
}

export default rectangleCollisions;


const animationUnit = (unit, speedAnamation = 10) => {
    
    // Инициализация счетчика, если он еще не существует
    if (!unit.changeFrame) {
        unit.changeFrame = 0;
    }

    // Увеличиваем счетчик
    unit.changeFrame += 1;

    // Меняем кадр, когда счетчик достигает порога
    if (unit.changeFrame >= speedAnamation) {
        unit.changeFrame = 0;
        unit.frames.current += 1;
    }

    // Сбрасываем кадр, если он достиг максимального значения
    if (unit.frames.current >= unit.frames.max) {
        unit.frames.current = 0;
    }
}

export default animationUnit;
// Classe que contém as funções de utilidades
class Utils {
    // Função utilitária para criar elementos com classe
    newElement(tagName, className) {
        const element = document.createElement(tagName);
        element.className = className;
        return element;
    }

    // Função utilitária para obter a posição esquerda de um elemento
    position(element) {
        return parseFloat(window.getComputedStyle(element).left);
    }
}
const utils = new Utils();

// Classe do cenário
class Sky {
    constructor() {
        this.element = utils.newElement("div", "sky");
    }

    setHeight(height) {
        this.element.style.height = `${height}%`;
    }

    addToScreen() {
        document.querySelector("[screen]").appendChild(this.element);
    }
}
const sky = new Sky();
// Classe da nuvem
class Cloud { 
    constructor(numberCloud, position) { 
        this.element = utils.newElement("div", `cloud cloud${numberCloud}`);
        this.elementCloud = utils.newElement("img", "");
        this.elementCloud.src = `./img/cloud${numberCloud}.png`;
        this.element.style.left = `${position}px`;
        this.element.appendChild(this.elementCloud);
    }
}

// Classe das nuvens
class Clouds {
    constructor(numberClouds) {
        this.element = utils.newElement("div", "cloud-container");
        this.numberClouds = numberClouds;
        this.setClouds(this.numberClouds);
        
        this.step = 10;
        this.isMovingLeft = false;
        this.isMovingRight = false;
    }

    setClouds() {
        for(var i = 0; i < this.numberClouds; i++) {
            const cloud = new Cloud(i+1, (350*(i-1)));
            this.element.appendChild(cloud.element);
        }
    }

    move(direction) {
        for(var i = 0; i < this.numberClouds; i++){
            const cloudElement = this.element.children[i];
            const currentPosition = utils.position(cloudElement);
            let newPosition =
                direction === "right"
                    ? currentPosition + this.step
                    : currentPosition - this.step;

            cloudElement.style.left = `${newPosition}px`;
        }

        // Chama a próxima atualização de posição no próximo quadro da animação
        if ((this.isMovingLeft && direction === "left") || (this.isMovingRight && direction === 'right')) {
            requestAnimationFrame(() => this.move(direction));
        }
    }

    addToScreen() {
        document.querySelector('.sky').appendChild(this.element);
    }
}
const clouds = new Clouds(6);

// Classe do chão
class Floor {
    constructor() {
        this.element = utils.newElement('div', 'divFloor');
    }
    
    addToScreen() {
        document.querySelector('[screen]').appendChild(this.element);
    }
}
const floor = new Floor();

// Classe da estrada
class Road {
    constructor() {
        this.element = utils.newElement('div', 'divRoad');
    }

    addToScreen() {
        document.querySelector('.divFloor').appendChild(this.element);
    }
}
const road = new Road();

// Classe das linhas da estrada
class RoadLines {
    constructor() {
        this.lines = [];
        this.speed = 1;
        this.lineSpacing = 2;
    }
    
    createLines() {
        const divRoad = document.querySelector(".divRoad");
        for (let i = 0; i < 5; i++) {
            const line = utils.newElement("div", "road-line");
            line.style.top = `${-this.lineSpacing * i * 50}px`;
            divRoad.appendChild(line); // Adiciona ao contêiner .divRoad
            this.lines.push(line);
        }
    }
    
    moveLines() {
        setInterval(() => {
            for (let i = 0; i < this.lines.length; i++) {
                const line = this.lines[i];
                const currentTop = parseFloat(line.style.top);
                const newTop = currentTop + this.speed;
                if (newTop > line.parentElement.offsetHeight) {
                    line.style.top = `${-this.lineSpacing}px`;
                } else {
                    line.style.top = `${newTop}px`;
                }
            }
        }, 15);
    }

    addToScreen() {
        this.createLines();
        this.moveLines();
    }
}
const roadlines = new RoadLines();

// Classe do carro
class Car {
    constructor() {
        this.element = utils.newElement("div", "carDiv");
        this.elementCar = utils.newElement("img", "car");
        this.elementCar.src = "./img/car.png";
        this.element.appendChild(this.elementCar);

        this.step = 20;
        this.isMovingLeft = false;
        this.isMovingRight = false;
    }

    limitLeft() {
        return this.element.offsetWidth / 2;
    }

    limitRight() {
        const mainElement = document.querySelector("main");
        return mainElement.offsetWidth - this.limitLeft();
    }

    move(direction) {
        const currentPosition = utils.position(this.element);
        const newPosition =
        direction === "right"
            ? currentPosition + this.step
            : currentPosition - this.step;

        if (newPosition >= this.limitLeft() && newPosition <= this.limitRight()) {
            this.element.style.left = `${newPosition}px`;
        }

        if ((this.isMovingLeft && direction === "left") || (this.isMovingRight && direction === 'right')) {
            requestAnimationFrame(() => this.move(direction));
        }
    }

    crashed(obstacle) {
        let colidiu = false
    
        if (!colidiu) {
            colidiu = areSuperimposed(this.element, obstacle.element)
        }
    
        return colidiu
    }
    
    addToScreen() {
        document.querySelector(".divFloor").appendChild(this.element);
        this.element.style.left = utils.position(this.element) + "px";
    }
}
const car = new Car();

// Classe dos obstáculos
class Obstacle {
    constructor() {
        this.element = utils.newElement("div", "obstacleCar");
        this.elementCar = utils.newElement("img", "car");
        this.elementCar.src = "./img/car2.png";
        this.element.appendChild(this.elementCar);
        this.isColisioned = false
        this.speed = 15;
    }

    addToScreen() {
        document.querySelector(".divFloor").appendChild(this.element);
    }
}
const obstacle = new Obstacle();

// Função que valida se dois elementos estão sobrepostos
function areSuperimposed(elementA, elementB) {

    const a = elementA.getBoundingClientRect()
    const b = elementB.getBoundingClientRect()
    const horizontal = a.left + a.width >= b.left && b.left + b.width >= a.left
    const vertical = a.top + a.height >= b.top && b.top + b.height >= a.top

    return horizontal && vertical
}

// Função que altera a velocidade das linhas quando o carro está na pista ou fora dela
function changeSpeedCar(car, roadLines) {
    setInterval(() => {
        if(car.element.style.left <= "300px" || car.element.style.left >= "700px") {
            roadLines.speed = (roadLines.speed > 2) ? (Math.ceil(roadLines.speed * 10)/10) - 0.75 : 2;
            car.step = (car.step > 10) ? car.step - 3 : 10;
        } else {
            roadLines.speed = (roadLines.speed < 10) ? (Math.ceil(roadLines.speed * 10)/10) + 0.01 : 10;
            car.step = (car.step < 20) ? car.step + 2 : 20;
        }
    }, 100);
}

// Função que valida se ocorreu uma colisão
function isCrashed(car, obstacleCar, roadLines) {
    setInterval(() => {
        if(car.crashed(obstacleCar)){
            console.log("bateu")
            obstacleCar.isColisioned = true
            roadLines.speed = (roadLines.speed > 2) ? (Math.ceil(roadLines.speed * 10)/10) - 0.75 : 2;
            car.step = (car.step > 10) ? car.step - 3 : 10;
        } 

        if(obstacleCar.isColisioned) {
            obstacleCar.speed -= 5;
            obstacleCar.isColisioned = false;
        }
        
    }, 15);
}

// Função que insere obstáculos na pista
function putObstacles(obstacleCar, roadLines) {
    setInterval(() => {
        obstacleCar.element.style.top = `${obstacleCar.speed}%`;
        obstacleCar.element.style.left = `${50 + (obstacleCar.speed / 25)}%`;
        obstacleCar.elementCar.style.height = `${obstacleCar.speed * 1.4}px`;

        obstacleCar.speed = (obstacleCar.speed < 81) ? obstacleCar.speed + (roadLines.speed / 25) : 15;
    }, 15);
}

// Função que captura os eventos das teclas mapeadas
function captureKeyEvents(car, clouds) {
    document.addEventListener("keydown", function (event) {
        if (event.key === "ArrowLeft" && !car.isMovingLeft) {
            car.isMovingLeft = true;
            car.move("left");

            clouds.isMovingRight = true;
            clouds.move("right");
        } else if (event.key === "ArrowRight" && !car.isMovingRight) {
            car.isMovingRight = true;
            car.move("right");

            clouds.isMovingLeft = true;
            clouds.move("left");
        }
    });

    document.addEventListener("keyup", function (event) {
        if (event.key === "ArrowLeft") {
            car.isMovingLeft = false;
            clouds.isMovingRight = false;
        } else if (event.key === "ArrowRight") {
            car.isMovingRight = false;
            clouds.isMovingLeft = false;
        }
    });
}

// Função que inicia os eventos do jogo
function gameEvents(sky, clouds, floor, road, roadLines, obstacle, car) {
    changeSpeedCar(car, roadLines)
    putObstacles(obstacle, roadLines)
    isCrashed(car, obstacle, roadLines)
    captureKeyEvents(car, clouds)
}

// Função para adicionar o cenário e o carro ao DOM
function buildScenario(sky, clouds, floor, road, roadLines, obstacle, car) {
    sky.setHeight(15);
    sky.addToScreen();
    floor.addToScreen();
    road.addToScreen();
    roadLines.addToScreen();
    obstacle.addToScreen();
    car.addToScreen();
    clouds.addToScreen();
}

//Função que inicia as entidades e o jogo
function initGame() {
    buildScenario(sky,clouds,floor,road,roadlines,obstacle,car)
    gameEvents(sky,clouds,floor,road,roadlines,obstacle,car)
}

// Aguarda o carregamento do DOM para iniciar a aplicação
document.addEventListener("DOMContentLoaded", initGame());

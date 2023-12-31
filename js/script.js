// Classe que contém as funções de utilidades
class Utils {
    constructor () {
        this.scenes = [
            //sky//road//sides
            ['#FFA500', '#3B3D4B', 'linear-gradient(to top, #58C45C, green)'], //day
            ['royalblue', '#3B3D4B', 'linear-gradient(to top, green, darkgreen)'], //afternoon 
            ['#000D65', 'black', 'linear-gradient(to top, #000A4B, #00062E)'], //night
            ['#aaf', '#D3D3D1', 'linear-gradient(to top, white, #D3D3D3)']  //snow
        ]
        this.t = 0;
    }
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
        utils.t = setInterval(() => {
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
        this.isLeft = true;
    }

    addToScreen() {
        document.querySelector(".divFloor").appendChild(this.element);
    }
}
const obstacle = new Obstacle();

// Classe do placar
class Scoreboard {
    constructor() {
        this.position = 50;
        this.lap = 1;
        this.auxlap = 0;
        this.distance = 0;
        this.element = utils.newElement("div", "scoreboard");
        this.printDistance = utils.newElement("div", "distance");
        this.printLap = utils.newElement("div", "lap");
        this.printPosition = utils.newElement("div", "position");
    }
    updateDistance(distance) {
        this.distance += distance;
        this.auxlap += distance;
        this.printDistance.innerHTML = `${Math.trunc(this.distance).toString().padStart(5, '0')}`;
        this.updateLap();
    }
    updateLap() {
        if (parseInt(this.auxlap) >= 100) {
           this.lap++;
           this.auxlap = 0;
        }
        this.printLap.innerHTML = `${this.lap}`
    }
    updatePosition() {
        this.position--;
        this.printPosition.innerHTML = `P${this.position}`
    }
    addToScreen() {
        document.querySelector("[screen]").appendChild(this.element);
        document.querySelector(".scoreboard").appendChild(this.printDistance);
        document.querySelector(".scoreboard").appendChild(this.printLap);
        document.querySelector(".scoreboard").appendChild(this.printPosition);
        this.printDistance.innerHTML = `${Math.floor(this.distance).toString().padStart(5, '0')}`
        this.printLap.innerHTML = `${this.lap}`
        this.printPosition.innerHTML = `P${this.position}`
    }
}
const scoreboard = new Scoreboard();

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
    utils.t = setInterval(() => {
        if(car.element.style.left <= "300px" || car.element.style.left >= "700px") {
            roadLines.speed = (roadLines.speed > 2) ? (Math.ceil(roadLines.speed * 10)/10) - 0.75 : 2;
            car.step = (car.step > 10) ? car.step - 3 : 10;
        } else {
            roadLines.speed = (roadLines.speed < 20) ? (Math.ceil(roadLines.speed * 10)/10) + 0.01 : 20;
            car.step = (car.step < 20) ? car.step + 2 : 20;
        }
    }, 100);
}

// Função que valida se ocorreu uma colisão
function isCrashed(car, obstacleCar, roadLines) {
    utils.t = setInterval(() => {
        if(car.crashed(obstacleCar)){
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
    utils.t = setInterval(() => {
        if (scoreboard.position > 1) {
            if (obstacleCar.isLeft) {
                obstacleCar.element.style.top = `${obstacleCar.speed}%`;
                obstacleCar.element.style.left = `${50 + (obstacleCar.speed / 25)}%`;
                obstacleCar.element.style.right = "unset";
                obstacleCar.elementCar.style.height = `${obstacleCar.speed * 1.4}px`;
        
                if (obstacleCar.speed < 81) {
                    obstacleCar.speed = obstacleCar.speed + (roadLines.speed / 25);
                } else {
                    obstacleCar.speed = 15;
                    scoreboard.updatePosition();
                    obstacleCar.isLeft = (Math.random() < 0.75) ? false : true;
                }
            } else {
                obstacleCar.element.style.top = `${obstacleCar.speed}%`;
                obstacleCar.element.style.right = `${50 + (obstacleCar.speed / 25)}%`;
                obstacleCar.element.style.left = "unset";
                obstacleCar.elementCar.style.height = `${obstacleCar.speed * 1.4}px`;
                if (obstacleCar.speed < 81) {
                    obstacleCar.speed = obstacleCar.speed + (roadLines.speed / 25);
                } else {
                    obstacleCar.speed = 15;
                    scoreboard.updatePosition();
                    obstacleCar.isLeft = (Math.random() < 0.75) ? false : true;

                }
            }
        } else {
            obstacleCar.element.style.display = "none";
        }        
        scoreboard.updateDistance(roadLines.speed / 200);
        verifyFinal()
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

// Função que troca o cenário
function changeScenario(){
    let k = 0;
    utils.t = setInterval(() => {
        sky.element.style.backgroundColor = utils.scenes[k][0];
        road.element.style.backgroundColor = utils.scenes[k][1];
        floor.element.style.backgroundImage = utils.scenes[k][2];
        k == 3 ? k = 0 : k++;
    }, 15000);
}

// Função que verifica se o jogo finalizou
function verifyFinal() {
    if(parseInt(scoreboard.distance) === 500) {
        if (parseInt(scoreboard.position) === 1) {
            console.log("VOCÊ GANHOU! :D")
            if (alert("VOCÊ GANHOU! :D")){
                location.reload();
            }
        } else {
            console.log("VOCÊ PERDEU! :/")
            if(alert("VOCÊ PERDEU! :/")) {
                document.getElementsByTagName("html").innerHTML = "";
                location.reload();
            }
        }
    }
}

// Função que inicia os eventos do jogo
function gameEvents(sky, clouds, floor, road, roadLines, obstacle, car, scoreboard) {
    changeScenario()
    changeSpeedCar(car, roadLines)
    putObstacles(obstacle, roadLines)
    isCrashed(car, obstacle, roadLines)
    captureKeyEvents(car, clouds)
}

// Função para adicionar o cenário e o carro ao DOM
function buildScenario(sky, clouds, floor, road, roadLines, obstacle, car, scoreboard) {
    sky.setHeight(15);
    sky.addToScreen();
    floor.addToScreen();
    road.addToScreen();
    roadLines.addToScreen();
    obstacle.addToScreen();
    car.addToScreen();
    clouds.addToScreen();
    scoreboard.addToScreen();
}

//Função que inicia as entidades e o jogo
function initGame() {
    buildScenario(sky,clouds,floor,road,roadlines,obstacle,car, scoreboard)
    gameEvents(sky,clouds,floor,road,roadlines,obstacle,car, scoreboard)
}

// Aguarda o carregamento do DOM para iniciar a aplicação
document.addEventListener("DOMContentLoaded", initGame());

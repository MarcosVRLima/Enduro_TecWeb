// Função utilitária para criar elementos com classe
function newElement(tagName, className) {
    const element = document.createElement(tagName);
    element.className = className;
    return element;
}

// Função utilitária para obter a posição esquerda de um elemento
function position(element) {
    return parseFloat(window.getComputedStyle(element).left);
}

// Classe do cenário
class Sky {
    constructor() {
        this.element = newElement("div", "sky");
    }

    setHeight(height) {
        this.element.style.height = `${height}%`;
    }

    addToScreen() {
        document.querySelector("[screen]").appendChild(this.element);
    }
}

class Cloud { 
    constructor(numberCloud, position) { 
        this.element = newElement("div", `cloud cloud${numberCloud}`);
        this.elementCloud = newElement("img", "");
        this.elementCloud.src = `./img/cloud${numberCloud}.png`;
        this.element.style.left = `${position}px`;
        this.element.appendChild(this.elementCloud);
    }
}

class Clouds {
    constructor(numberClouds) {
        this.element = newElement("div", "cloud-container");
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
            const currentPosition = position(cloudElement);
            let newPosition =
                direction === "right"
                    ? currentPosition + this.step
                    : currentPosition - this.step;

            /*//Verifica se a nuvem atingiu a posição de retorno
            if (direction === "right" && newPosition > (350*(this.numberClouds-1))) {
                console.log('saiu cloud' + i + ' na ' + direction);
            } else if (direction === "left" && newPosition < -350) {
                //newPosition = 1500;
            }*/

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

class Floor {
    constructor() {
        this.element = newElement('div', 'divFloor');
    }
    
    addToScreen() {
        document.querySelector('[screen]').appendChild(this.element);
    }
}

class Road {
    constructor() {
        this.element = newElement('div', 'divRoad');
    }

    addToScreen() {
        document.querySelector('.divFloor').appendChild(this.element);
    }
}

// Classe das linhas da estrada
class RoadLines {
    constructor() {
        this.lines = [];
        this.speed = 1;
        this.lineSpacing = 2;
        this.createLines();
        this.moveLines();
    }
    
    createLines() {
        const divRoad = document.querySelector(".divRoad");
        for (let i = 0; i < 5; i++) {
            const line = newElement("div", "road-line");
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
}

// Classe do carro
class Car {
    constructor() {
        this.element = newElement("div", "carDiv");
        this.elementCar = newElement("img", "car");
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
        const currentPosition = position(this.element);
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
    
    addToScreen() {
        document.querySelector(".divFloor").appendChild(this.element);
        this.element.style.left = position(this.element) + "px";
    }
}

class ObstacleCar {
    constructor() {
        this.element = newElement("div", "obstacleCar");
        this.elementCar = newElement("img", "car");
        this.elementCar.src = "./img/car2.png";
        this.element.appendChild(this.elementCar);

        this.speed = 15;
    }

    addToScreen() {
        document.querySelector(".divFloor").appendChild(this.element);
    }
}

// Função para adicionar o cenário e o carro ao DOM
function addScenario() {
    const s = new Sky();
    s.setHeight(15);
    s.addToScreen();

    const f = new Floor();
    f.addToScreen();

    const road = new Road();
    road.addToScreen();

    const roadLines = new RoadLines();

    const obstacleCar = new ObstacleCar();
    obstacleCar.addToScreen();

    const car = new Car();
    car.addToScreen();

    const clouds = new Clouds(6);
    clouds.addToScreen();

    setInterval(function() {
        if(car.element.style.left <= "300px" || car.element.style.left >= "700px") {
            roadLines.speed = (roadLines.speed > 2) ? (Math.ceil(roadLines.speed * 10)/10) - 0.75 : 2;
            car.step = (car.step > 10) ? car.step - 3 : 10;
        } else {
            roadLines.speed = (roadLines.speed < 10) ? (Math.ceil(roadLines.speed * 10)/10) + 0.01 : 10;
            car.step = (car.step < 20) ? car.step + 2 : 20;
        }

        
    }, 100);

    setInterval(function() {
        obstacleCar.element.style.top = `${obstacleCar.speed}%`;
        obstacleCar.element.style.left = `${50 + (obstacleCar.speed / 25)}%`;
        obstacleCar.elementCar.style.height = `${obstacleCar.speed * 1.7}px`;
        
        obstacleCar.speed = (obstacleCar.speed < 81) ? obstacleCar.speed + (roadLines.speed / 25) : 15;

    }, 15);

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

// Função para iniciar a aplicação
function initializeApp() {
    alert('Enduro');
    addScenario();
}

// Aguarda o carregamento do DOM para iniciar a aplicação
document.addEventListener("DOMContentLoaded", initializeApp);

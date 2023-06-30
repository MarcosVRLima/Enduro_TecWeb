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
class Scenario {
    constructor() {
        this.element = newElement("div", "sky");
    }

    setHeight(height) {
        this.element.style.height = `${height}px`;
    }

    addToScreen() {
        document.querySelector("[screen]").appendChild(this.element);
    }
}

class Cloud { 
    constructor(numberCloud, position) { 
        this.element = newElement("div", "cloud");
        this.elementCloud = newElement("img", `cloud${numberCloud}`);
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
        
        this.step = 15;
        this.isMovingLeft = false;
        this.isMovingRight = false;
    }

    setClouds() {
        for(var i = 0; i < this.numberClouds; i++) {
            const cloud = new Cloud(i+1, (300*i));
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

            /* Verifica se a nuvem atingiu a posição de retorno
            if (direction === "right" && newPosition > 1500) {
                newPosition = -300;
            } else if (direction === "left" && newPosition < -300) {
                newPosition = 1500;
            }*/

            cloudElement.style.left = `${newPosition}px`;
        }

        if (this.isMovingLeft) {
            requestAnimationFrame(() => this.move("left"));
        } else if (this.isMovingRight) {
            requestAnimationFrame(() => this.move("right"));
        }
    }

    addToScreen() {
        document.querySelector('.sky').appendChild(this.element);
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

        if (this.isMovingLeft) {
            requestAnimationFrame(() => this.move("left"));
        } else if (this.isMovingRight) {
            requestAnimationFrame(() => this.move("right"));
        }
    }
    
    addToScreen() {
        document.querySelector("[screen]").appendChild(this.element);
    }
}

// Função para adicionar o cenário e o carro ao DOM
function addScenarioAndCar() {
    const s = new Scenario();
    s.setHeight(200);
    s.addToScreen();

    const car = new Car();
    car.addToScreen();

    const clouds = new Clouds(6);
    clouds.addToScreen();

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
    addScenarioAndCar();
}

// Aguarda o carregamento do DOM para iniciar a aplicação
document.addEventListener("DOMContentLoaded", initializeApp);

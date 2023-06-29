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

    document.addEventListener("keydown", function (event) {
        if (event.key === "ArrowLeft" && !car.isMovingLeft) {
            car.isMovingLeft = true;
            car.move("left");
        } else if (event.key === "ArrowRight" && !car.isMovingRight) {
            car.isMovingRight = true;
            car.move("right");
        }
    });

    document.addEventListener("keyup", function (event) {
        if (event.key === "ArrowLeft") {
            car.isMovingLeft = false;
        } else if (event.key === "ArrowRight") {
            car.isMovingRight = false;
        }
    });
}

// Função para iniciar a aplicação
function initializeApp() {
    addScenarioAndCar();
}

// Aguarda o carregamento do DOM para iniciar a aplicação
document.addEventListener("DOMContentLoaded", initializeApp);

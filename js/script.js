function newElement(tagName, className){
    const element = document.createElement(tagName);
    element.className = className;
    return element;
}

function position(element){
    return parseFloat(window.getComputedStyle(element).left);
}

function Scenario(){
    this.element = newElement('div', 'sky');
    this.setHeight = height => this.element.style.height = `${height}px`
}

function Car(){
    this.element = newElement('div', 'carDiv');
    this.elementCar = newElement('img', 'car');
    this.elementCar.src = './img/car.png';
    this.element.appendChild(this.elementCar);

    this.step = 20;
    this.isMovingLeft = false;
    this.isMovingRight = false;
}

Car.prototype.limitLeft = function () {
    return this.element.offsetWidth / 2;
};
  
Car.prototype.limitRight = function () {
    const mainElement = document.getElementsByTagName('main')[0];
    return (mainElement.offsetWidth - (this.element.offsetWidth / 2));
};

Car.prototype.startMoving = function(event) {
    if (event.key === 'ArrowLeft' && !this.isMovingLeft) {
        this.isMovingLeft = true;
        this.moveLeft();
    } else if (event.key === 'ArrowRight' && !this.isMovingRight) {
        this.isMovingRight = true;
        this.moveRight();
    }
};

Car.prototype.stopMoving = function(event) {
    if (event.key === 'ArrowLeft') {
        this.isMovingLeft = false;
    } else if (event.key === 'ArrowRight') {
        this.isMovingRight = false;
    }
}

Car.prototype.moveLeft = function() {
    var currentPosition = position(this.element);
    var newPosition = currentPosition - this.step;

    if (newPosition >= this.limitLeft()) {
      this.element.style.left = newPosition + 'px';
    }

    if (this.isMovingLeft) {
        requestAnimationFrame(() => this.moveLeft());
    }
};

Car.prototype.moveRight = function() {
    var currentPosition = position(this.element);
    var newPosition = currentPosition + this.step;

    if (newPosition <= this.limitRight()) {
        this.element.style.left = newPosition + 'px';
    }

    if (this.isMovingRight) {
        requestAnimationFrame(() => this.moveRight());
    }
};



const s = new Scenario();
s.setHeight(200);
document.querySelector('[screen]').appendChild(s.element);

const car = new Car();
document.querySelector('[screen]').appendChild(car.element);

document.addEventListener('keydown', car.startMoving.bind(car));
document.addEventListener('keyup', car.stopMoving.bind(car));
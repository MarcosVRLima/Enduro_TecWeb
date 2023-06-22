function newElement(tagName, className){
    const element = document.createElement(tagName);
    element.className = className;
    return element;
}

function Scenario(){
    this.element = newElement('div', 'montain');
    const test = newElement('div', 'test')
    this.element.appendChild(test)
    this.setHeight = height => test.style.height = `${height}px`
}

const s = new Scenario();
s.setHeight(200);
document.querySelector('[screen]').appendChild(s.element);
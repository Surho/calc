import Component from './component.js';

class Calculator extends Component {
    constructor() {
        super({});
        this.value1 = null;
        this.value2 = null;
        this.currentValue = null;
        this.operationChosen = false;
        this.lastOperation = null;
        this.currentOperation = null;
        this._currentDidgit = 0;
        this._renderInterface();
        this._getElements();
        this._initEvents();
        // console.log(this._formatNumber('12311231321223'));
    }

    _renderInterface() {
        let container = document.createElement('DIV');
        container.classList.add("calculator");
        container.innerHTML = `
        <div class="calculator__current-value"></div>
            <div class="calculator__interface">
                <div class="calculator__wrapper">
                    <div class="calculator__actions">
                        <button class="calculator__clear" data-action="clear">C</button>
                        <button class="calculator__symbol" data-action="symbol">+/-</button>
                        <button class="calculator__percent" data-action="percent">%</button>
                    </div>
                    <div class="calculator__btns">
                        <button value="1">1</button>
                        <button value="2">2</button>
                        <button value="3">3</button>
                        <button value="4">4</button>
                        <button value="5">5</button>
                        <button value="6">6</button>
                        <button value="7">7</button>
                        <button value="8">8</button>
                        <button value="9">9</button>
                        <button value="0">0</button>
                        <button value=".">.</button>
                    </div>
                </div>
                <div class="calculator__operations">
                    <button class="calculator__devide" data-operation="/">/</button>
                    <button class="calculator__multiply" data-operation="*">X</button>
                    <button class="calculator__minus" data-operation="-">-</button>
                    <button class="calculator__plus" data-operation="+">+</button>
                    <button class="calculator__equal" data-operation="=">=</button>
                </div>
            </div>
         `;
        document.body.appendChild(container);        
    }

    _equals(value1, value2, symbol) {
        switch (symbol) {
            case '+':
            return (value1 + value2);
            case '-':
            return (value1 - value2);
            case '*':
            return (value1 * value2);
            case '/':
            return (value1 / value2);
            default:
            value1;
        }
    }

    _getElements() {
        this.element = document.querySelector('.calculator');
        this.calculatorDisplay = this.element.querySelector('.calculator__current-value');
    }

    _onClearButtonClick() {
        this._clearField();
        this._resetValues();
        return false;
    }

    _onOperationButtonClick(button, operation) {
        this.operationChosen = true;

        let highlighted = document.querySelector('.calculator__highlighted');

        if(highlighted) {
            highlighted.classList.remove('calculator__highlighted');
        }
        button.classList.add('calculator__highlighted');

        if(!this.value1) {
            this.value1 = +this.calculatorDisplay.textContent;
            this.lastOperation = operation;
            return;
        }

        if(!this.value2) {
            this.value2 = +this.calculatorDisplay.textContent;
        }

        if(this.value1 && this.value2) {

            if(this.lastOperation !== operation) {
                this.currentValue = this._equals(this.value1, this.value2, this.lastOperation);
                this.calculatorDisplay.textContent = this.currentValue;
                this.value1 = this.currentValue;
                this.value2 = null;
                this.lastOperation = operation;
                return;
            }

            this.currentValue = this._equals(this.value1, this.value2, operation);
            this.calculatorDisplay.textContent = this.currentValue;
            this.value1 = this.currentValue;
            this.value2 = null;
        }
    }

    _onNumberButtonClick(button) {

        if(this.operationChosen) {
            this.operationChosen = false;
            this._clearField();
        }

        this.calculatorDisplay.textContent += button.value;
    }

    _initEvents() {

        this.element.addEventListener('click', (evt) => {

            let target = evt.target;

            if(target.value) {
                this._onNumberButtonClick(target);
            }

            if(target.dataset.operation) {
                this._onOperationButtonClick(target, target.dataset.operation);
            }

            if(target.dataset.action === 'clear') {
                this._onClearButtonClick();
            }
        });
    }

    _clearField() {
        let highlighted = document.querySelector('.calculator__highlighted');
        if(highlighted) {
            highlighted.classList.remove('calculator__highlighted');
        }
        this.calculatorDisplay.textContent = '';
        return false;
    };

    _resetValues() {
        this.value1 = null;
        this.value2 = null;
    }
}

const calc = new Calculator();
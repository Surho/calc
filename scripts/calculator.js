import Component from './component.js';

class Calculator extends Component {
    constructor(container) {
        super({});
        this.value1 = null;
        this.value2 = null;
        
        this.operationChosen = false;
        this.lastOperation = null;
        this.decimalAccuracy = 1;

        this._renderInterface(container);
        this._getElements();
        this._initEvents();
    }

    _renderInterface(container) {
        let calculator = document.createElement('DIV');
        calculator.classList.add("calculator");
        calculator.innerHTML = `
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
         container.appendChild(calculator);        
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

    _onClearClick() {
        this._clearField();
        this._resetValues();
        return false;
    }

    _onSymbolClick() {
        if(this.calculatorDisplay.textContent.indexOf('-') + 1) {
            this.calculatorDisplay.textContent = this.calculatorDisplay.textContent.slice(1);
        } else {
            this.calculatorDisplay.textContent = -this.calculatorDisplay.textContent;
        }
    }

    _onOperationButtonClick(operation, button) {
        this.operationChosen = true;
        this._removeHighlight();
        this._addHighlight(button)

        if(!this.value1) {
            this.value1 = +this.calculatorDisplay .textContent;
        }

        if(this.value1 && this.value2) {
            this._checkDecimalAccuracy(this.value1, this.value2);
            this.calculatorDisplay.textContent = this._formatDecimal(this._equals(this.value1, this.value2, operation));;         
            this.value1 = +this.calculatorDisplay.textContent;
            this.value2 = null;
        }

        if(operation !== '=') {
            this.lastOperation = operation;
        }
    }

    _onNumberButtonClick(button) {
        if(this.operationChosen === true) {
            this._clearField();
            this.operationChosen = false;
        }

        if(this.calculatorDisplay .textContent.length <= 12) {
            this.calculatorDisplay .textContent += button.value;
        }

        if(this.value1) {
            this.value2 = +this.calculatorDisplay .textContent;
        }
    }

    _initEvents() {
        this.element.addEventListener('click', (evt) => {

            let target = evt.target;

            if(target.value) {
                this._onNumberButtonClick(target);
            }

            if(target.dataset.operation) {
                if(target.dataset.operation === '=' && this.value1 && this.value2) {
                    this._onOperationButtonClick(this.lastOperation, target);
                    return;
                }
                this._onOperationButtonClick(target.dataset.operation, target);
            }

            if(target.dataset.action === 'clear') {
                this._onClearClick();
            }

            if(target.dataset.action === 'symbol') {
                this._onSymbolClick();
            }

            if(target.dataset.action === 'percent') {
                this.calculatorDisplay .textContent = +this.calculatorDisplay .textContent / 100;
            }
        });
    }

    _clearField() {
        this._removeHighlight();
        this.calculatorDisplay.textContent = '';
        return false;
    };

    _removeHighlight() {
        let highlighted = document.querySelector('.calculator__highlighted');
        if(highlighted) {
            highlighted.classList.remove('calculator__highlighted');
        }
    }

    _addHighlight(elem) {
        elem.classList.add('calculator__highlighted');
    }

    _resetValues() {
        this.value1 = null;
        this.value2 = null;
    }

    _checkDecimalAccuracy(number1, number2) {
        let number1Decimal = ((String(number1)).indexOf('.') + 1) ? String(number1).split('.')[1].length : 0;
        let number2Decimal = ((String(number2)).indexOf('.') + 1) ? String(number2).split('.')[1].length : 0;
    
        this.decimalAccuracy = Math.max(number1Decimal, number2Decimal);
        return this.decimalAccuracy;
    }

    _formatDecimal(number) {
        if(String(number).indexOf('e') + 1) {
            return number;
        }

        number = String(number).split('.');

        if(number[0].length >= 12) {
            number[0] = number[0].slice(0, 12);
            number[0] = `${number[0]}e^${(number[0].length - 12)}`;
        }

        if(number[1]) {
            number[1] = number[1].slice(0, this.decimalAccuracy);
        }

       return number.join('.');  
    }
}

const phoneDisplay = document.querySelector('.phone__display');
const calc = new Calculator(phoneDisplay);
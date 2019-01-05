import Component from './component.js';

class Calculator extends Component {
    constructor(container) {
        super({});
        this.defaultFontSize = 32;
        this.dot = false;
        this.fieldClear = false;

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
        const calculator = document.createElement('DIV');
        calculator.classList.add("calculator");
        calculator.innerHTML = `
        <div class="calculator__current-value">0</div>
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
        this._addHighlight(button);

        if(!this.value1) {
            this.value1 = +this.calculatorDisplay.textContent;
        }

        if(this.value1 && this.value2) {
            // this._checkDecimalAccuracy(this.value1, this.value2);

            if(this.lastOperation && this.lastOperation !== operation) {
                this._showResult(this.value1, this.value2, this.lastOperation);
                this.lastOperation = operation;
                return;
            }
            this._showResult(this.value1, this.value2, operation);
        }

        if (operation !== '=') {
            this.lastOperation = operation;
        }
    }

    _showResult(number1, number2, operation) {
        this.calculatorDisplay.textContent = this._equals(number1, number2, operation);  
        this.calculatorDisplay.textContent  = this._trimRepeatedSequance(this.calculatorDisplay.textContent);
        this.value1 = +this.calculatorDisplay.textContent;
        this.value2 = null;
    }

    _onNumberButtonClick(button) {
        if(this.operationChosen === true) {
            this._clearField();
            this.operationChosen = false;
        }

        if(button.value === "0" && this.calculatorDisplay.textContent[0] === '0' && !this.dot) {
                return;
        };

        if(!this.fieldClear) {
            this.calculatorDisplay.textContent = '';
            this.fieldClear = true;
        } 
    
        if(button.value !== '.' && this.calculatorDisplay.textContent.length <= 12) {
            this.calculatorDisplay.textContent += button.value;
            this.calculatorDisplay.textContent = this.calculatorDisplay.textContent;
        }

        if(button.value === '.' && !this.dot && this.calculatorDisplay.textContent === '') {
            this.calculatorDisplay.textContent = '0.';
            this.dot = true;
        }  

        if(button.value === '.' && !this.dot) {
            this.calculatorDisplay.textContent += button.value;
            this.dot = true;
        }

        if(this.value1) {
            this.value2 = +this.calculatorDisplay.textContent;
        }
    }

    _initEvents() {
        this.element.addEventListener('click', (evt) => {

            let target = evt.target;

            if(this.element.style.fontSize !== this.defaultFontSize) {
                this._normaliseFontSize();
            }

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
        this.calculatorDisplay.textContent = '0';
        this.fieldClear = false;
        this.dot = false;
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
        this.lastOperation = null;
    }

    

    _checkRepeatedSequance(numberString) {
        let sequanceCount = 0;
        let sequanceStartsAt = null;
        let sequanceOf = null;
        let sequance = null;

        if(typeof numberString !== 'string') {
            throw new Error('arguments must be a string');
        }

        const dotPosition = numberString.indexOf('.');
        const numberParts = numberString.split('.');
        const decimalPart = numberParts[1];
        const integerPart = numberParts[0];
        
        if(!decimalPart) {
            return false;
        }

        for(let i = 0; i < decimalPart.length; i++) {
            if(!sequanceOf) {
                sequanceOf = decimalPart[i];
            }
            if(decimalPart[i] === sequanceOf) {
                if(sequanceStartsAt === null) {
                    sequanceStartsAt = integerPart.length + i;
                };
                sequanceCount++
            } else {
                if(sequanceCount < 10) {
                    sequanceStartsAt = null;
                    sequanceOf = decimalPart[i];
                    sequanceCount = 1;
                    continue;
                }
            }
        }

        return sequance = {
            count: sequanceCount, 
            symbol: sequanceOf, 
            startsAt: sequanceStartsAt,
            dotPosition: dotPosition
        };
    }

    _trimRepeatedSequance(number) {
        let sequance = this._checkRepeatedSequance(number);
        let numberDigit = Math.pow(10, sequance.startsAt - sequance.dotPosition);

        if(sequance.count >= 10 && sequance.symbol === "0") {
           number = number.slice(sequance.dotPosition - 1, sequance.startsAt);
        }

        if(sequance.count >= 10 && sequance.symbol === "9") {
            number = (Math.round(number * numberDigit))/numberDigit;
         }

        return number;
    }


    _reduceFontSize(size = 20)  {
        this.fontSize = size;
        this.calculatorDisplay.style.fontSize = this.fontSize + 'px';
    }

    _normaliseFontSize() {
        this.fontSize = 32;
        this.calculatorDisplay.style.fontSize = this.fontSize + 'px';
    }
}



const phoneDisplay = document.querySelector('.phone__display');
const calc = new Calculator(phoneDisplay);



// _checkDecimalAccuracy(number1, number2) {
        // let number1Decimal = ((String(number1)).indexOf('.') + 1) ? String(number1).split('.')[1].length : 0;
        // let number2Decimal = ((String(number2)).indexOf('.') + 1) ? String(number2).split('.')[1].length : 0;
        
        // this.decimalAccuracy = Math.max(number1Decimal, number2Decimal);
        // return this.decimalAccuracy;
    // }

    // _formatDecimal(number) {

        // if(String(number).indexOf('e') + 1) {
        //     this._reduceFontSize();
        //     return number;
        // }

        // number = String(number).split('.');

        // if(number[0].length > 10) {
        //     number[0] = number[0]/Math.pow(10, number[0].length - 1);
        //     let prefix = `e+${String(number[0]).length}`;
        //     return number[0] + prefix;
        // }

        // if(this._checkZeroSequance(number[1])) {
        //     number[1]
        // }

        // number = number.join('.');
   
    // }
    

    // _formatNumber(number) {
    //     let dotIndex = null;
    //     let decimalPart = null;
    //     if(this.dot) {
    //         dotIndex = number.indexOf('.');
    //         decimalPart = number.slice(dotIndex); 
    //     }
    //     let dotIndex = number.indexOf('.');
    //     let decimalPart = number.slice(dotIndex);
    //     number = +number;
    //     number = number.toLocaleString() + decimalPart;
    // }

    // _formatBack(numberString) {
    //     numberString = ((numberString.split(" ")).join(''));
    //     return numberString;
    // }
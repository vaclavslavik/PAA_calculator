/* jshint devel: true */

'use strict';

function getWidth()
{
    xWidth = null;
    if (window.screen !== null)
        xWidth = window.screen.availWidth;

    if (window.innerWidth !== null)
        xWidth = window.innerWidth;

    if (document.body !== null)
        xWidth = document.body.clientWidth;

    return xWidth;
}
function getHeight() {
    xHeight = null;
    if (window.screen !== null)
        xHeight = window.screen.availHeight;

    if (window.innerHeight !== null)
        xHeight = window.innerHeight;

    if (document.body !== null)
        xHeight = document.body.clientHeight;

    return xHeight;
}

var ELastOperation = {
    NONE: 0
    , NUMBER: 1
    , BASE_OPERATION: 2
    , BEGIN_OPERATION: 3
    , END_OPERATION: 4
    , NUMBER_OVERFLOW: 5
};

var Number = function () {
    this.number = "";

    Number.prototype.setInverse = function () {
        if (this.number !== "") {
            if (this.number.charAt(0) === "-") {
                this.number = this.number.substring(1, this.number.length);
            } else {
                this.number = "-" + this.number;
            }
        }
    };

    Number.prototype.setNumber = function (number) {
        this.number = number.toString();
    };

    Number.prototype.addToNumber = function (char) {
        console.log("|" + this.number + "|");
        // může projít [0-9] + [.] -> možné ošetřit
        if (char === ".") {
            var reg = /\./;
            if (!reg.test(this.number)) { // test, jestli se již nevyskytuje destinná čárka dříve
                if (this.number === "") {
                    this.number = "0" + char;
                } else {
                    this.number = this.number + char;
                }
            }
        } else {
            if (char === "0" && (this.number === "0" || this.number === "")) {

            } else {
                this.number = this.number + char;
            }
        }
    };

    Number.prototype.clearNumber = function () {
        this.number = "";
    };

    Number.prototype.clearLastChar = function () {
        if (this.number !== "") {
            this.number = this.number.substr(0, this.number.length - 1);
        }
    };

    Number.prototype.getNumber = function () {
        if (this.number === "") {
            return 0;
        } else {
            return this.number;
        }
    };

};

var EOperation = {
    ADD: "+"
    , MUL: "*"
    , DIV: "/"
    , SUB: "-"
    , BEGIN_BRACKET: "("
    , END_BRACKET: ")"
    , SIN: "sin("
    , COS: "cos("
    , TAN: "tan("
    , POWER: "^"
    , SQRT: "sqrt("
    , EXP: "exp("
    , LOG: "log("
    , ABS: "abs("
    , LN: "ln("
};

var Calculator = function () {
    this.expression = "";
    this.actualNumber = new Number();
    this.lastOperation = ELastOperation.NONE;
    this.bracketLevel = 0;

    Calculator.prototype.addNumber = function (char) {
        if (this.lastOperation !== ELastOperation.NUMBER_OVERFLOW) {
            if (char === "←") {
                this.actualNumber.clearLastChar();
            } else {
                if (char === ",") {
                    char = ".";
                }
                this.actualNumber.addToNumber(char);
            }
            this.lastOperation = ELastOperation.NUMBER;
            this.echo();
        }
    };


    Calculator.prototype.addOperation = function (string) {
        console.log(string);
        if (string === "plus") {
            this.addBaseOperation(EOperation.ADD);
        } else if (string === "-") {
            this.addBaseOperation(EOperation.SUB);
        } else if (string === "div") {
            this.addBaseOperation(EOperation.DIV);
        } else if (string === "mul") {
            this.addBaseOperation(EOperation.MUL);
        } else if (string === "C") {
            this.erase();
        } else if (string === "begin_bracket") {
            this.addBeginOperation(EOperation.BEGIN_BRACKET);
        } else if (string === "end_bracket") {
            this.addEndOperation();
        } else if (string === "is") {
            this.makeResult();
        } else if (string === "sin") {
            this.addBeginOperation(EOperation.SIN);
        } else if (string === "cos") {
            this.addBeginOperation(EOperation.COS);
        } else if (string === "tan") {
            this.addBeginOperation(EOperation.TAN);
        } else if (string === 'pi') {
            this.actualNumber = new Number();
            this.actualNumber.setNumber(Math.PI);
            this.lastOperation = ELastOperation.NUMBER;
        } else if (string === "e") {
            this.actualNumber = new Number();
            this.actualNumber.setNumber(Math.E);
            this.lastOperation = ELastOperation.NUMBER;
        } else if (string === "M+") {
            this.addToMemory();
        } else if (string === "MR") {
            this.getMemory();
        } else if (string === "MC") {
            this.clearMemory();
        } else if (string === "M-") {
            this.subMemory();
        } else if (string === "npower") {
            this.addBaseOperation(EOperation.POWER);
        } else if (string === "power2") {
            if (this.addBaseOperation(EOperation.POWER)) {
                this.actualNumber = new Number();
                this.actualNumber.setNumber(2);
                this.lastOperation = ELastOperation.NUMBER;
            }
        } else if (string === "sqrt") {
            this.addBeginOperation(EOperation.SQRT);
        } else if (string === "exp") {
            this.addBeginOperation(EOperation.EXP);
        } else if (string === "log") {
            this.addBeginOperation(EOperation.LOG);
        } else if (string === "ln") {
            this.addBaseOperation(EOperation.LN);
        } else if (string === "abs") {
            this.addBeginOperation(EOperation.ABS);
        } else if (string === "plusMinus") {
            this.actualNumber.setInverse();
        }
        this.echo();
    };

    Calculator.prototype.addToMemory = function () {
        if ((this.actualNumber !== null) && (this.actualNumber.getNumber() !== null) && (this.actualNumber.getNumber() !== 0) && (this.actualNumber.getNumber() !== "0")) {
            if (localStorage.getItem("memory") === null) {
                localStorage.memory = parseFloat(this.actualNumber.getNumber());
            } else {
                localStorage.memory += parseFloat(this.actualNumber.getNumber());
            }
        }
    };

    Calculator.prototype.subMemory = function () {
        if ((this.actualNumber !== null) && (this.actualNumber.getNumber() !== null) && (this.actualNumber.getNumber() !== 0) && (this.actualNumber.getNumber() !== "0")) {
            if (localStorage.getItem("memory") === null) {
                localStorage.memory = parseFloat(this.actualNumber.getNumber());
            } else {
                localStorage.memory -= parseFloat(this.actualNumber.getNumber());
            }
        }
    };

    Calculator.prototype.getMemory = function () {
        if (localStorage.getItem("memory") !== null) {
            this.actualNumber = new Number();
            this.actualNumber.setNumber(localStorage.getItem("memory"));
            this.lastOperation = ELastOperation.NUMBER;
        }
    };

    Calculator.prototype.clearMemory = function () {
        localStorage.clear("memory");
    };

    Calculator.prototype.addBaseOperation = function (operation) {
        if (this.lastOperation === ELastOperation.BASE_OPERATION) {
            this.lastOperation = ELastOperation.BASE_OPERATION;
            this.expression = this.expression.substr(0, this.expression.length - 1) + operation;
            this.actualNumber = new Number();
            return true;
        } else if (this.lastOperation === ELastOperation.NUMBER) {
            this.lastOperation = ELastOperation.BASE_OPERATION;
            this.expression += this.actualNumber.getNumber() + "" + operation + "";
            this.actualNumber = new Number();
            return true;
        } else if (this.lastOperation === ELastOperation.END_OPERATION) {
            this.lastOperation = ELastOperation.BASE_OPERATION;
            this.actualNumber = new Number();
            this.expression += operation;
            return true;
        }
        return false;
    };

    Calculator.prototype.addBeginOperation = function (operation) {
        if (this.lastOperation === ELastOperation.BASE_OPERATION || this.lastOperation === ELastOperation.NONE || this.lastOperation === ELastOperation.BEGIN_OPERATION) {
            this.expression += operation;
            this.lastOperation = ELastOperation.BEGIN_OPERATION;
            this.bracketLevel++;
        }
    };

    Calculator.prototype.addEndOperation = function () {
        if ((this.lastOperation === ELastOperation.NUMBER) && (this.bracketLevel >= 1)) {
            this.bracketLevel--;
            this.lastOperation = ELastOperation.END_OPERATION;
            this.expression += this.actualNumber.getNumber() + EOperation.END_BRACKET;
            this.actualNumber = new Number();
        }
    };


    Calculator.prototype.getResult = function (expression) {
        // přepsání potřebných výrazů
        expression = expression.replace(/sin/g, "Math.sin");
        expression = expression.replace(/cos/g, "Math.cos");
        expression = expression.replace(/tan/g, "Math.tan");
        expression = expression.replace(/sqrt/g, "Math.sqrt");
        expression = expression.replace(/log/g, "Math.log(");
        expression = expression.replace(/exp/g, "Math.exp(");
        expression = expression.replace(/abs/g, "Math.abs(");

        // vyrovnání zárovek -> ukončení za uživatele neukončených
        var i;
        var bracketLevel = 0;
        for (i = 0; i < expression.length; i++) {
            if (expression.charAt(i) === EOperation.BEGIN_BRACKET) {
                bracketLevel++;
            } else if (expression.charAt(i) === EOperation.END_BRACKET) {
                bracketLevel--;
            }
        }

        for (i = 0; i < bracketLevel; i++) {
            expression += EOperation.END_BRACKET;
        }



        var expressionPower = expression;
        console.log(expressionPower);

        // v každém kroku najít značku mocniny (^)
        for (var index = 0; index < expressionPower.length; index++) {
            var j = index;
            if (expressionPower.charAt(index) === "^") {
                var downZakladIndex = 0;
                var downMocninaIndex = 0;
                var downPrvniKrok = true;
                var downJdeOzavorku = false;
                var downBracketLevel = 0;
                for (j = index - 1; j >= 0; j--) {
                    if (downPrvniKrok === true) {
                        downPrvniKrok = false;
                        if (expressionPower.charAt(j) === ")") {
                            downJdeOzavorku = true;
                            downBracketLevel++;
                        } else {

                        }
                    } else {
                        if (downJdeOzavorku === true) {
                            if (expressionPower.charAt(j) === "(") {
                                downBracketLevel--;
                            } else if (expressionPower.charAt(j) === ")") {
                                downBracketLevel++;
                            }
                            if (downBracketLevel === 0) {
                                downZakladIndex = j + 1;
                                break;
                            }
                        } else {
                            if (isNaN(parseInt(expressionPower.charAt(j)))) {
                                if (expressionPower.charAt(j) !== ".") {
                                    downZakladIndex = j + 2;
                                }
                                break;
                            }
                        }
                    }
                } // konec down

                var upZakladIndex = 0;
                var upMocninaIndex = 0;
                var upPrvniKrok = true;
                var upJdeOzavorku = false;
                var upBracketLevel = 0;
                for (j = index + 1; j <= expressionPower.length; j++) {
                    if (upPrvniKrok === true) {
                        upPrvniKrok = false;
                        if (expressionPower.charAt(j) === "(") {
                            upJdeOzavorku = true;
                            upBracketLevel++;
                        } else {

                        }
                    } else {
                        if (upJdeOzavorku === true) {
                            if (expressionPower.charAt(j) === ")") {
                                upBracketLevel--;
                            } else if (expressionPower.charAt(j) === "(") {
                                upBracketLevel++;
                            }
                            if (upBracketLevel === 0) {
                                upZakladIndex = j - 1;
                                break;
                            }
                        } else {
                            if (isNaN(parseInt(expressionPower.charAt(j)))) {
                                if (expressionPower.charAt(j) !== ".") {
                                    upZakladIndex = j - 1;
                                    break;
                                }
                            }
                        }
                    }
                }

                //console.log("nalezen na " + index + " ->" + downZakladIndex + "," + upZakladIndex);

                // nalezeno v rámci aktuální mocniny


                var before = expressionPower.substring(0, downZakladIndex - 1);
                var zaklad = expressionPower.substring(downZakladIndex - 1, index);
                var mocnina = expressionPower.substring(index + 1, upZakladIndex + 1);
                var after = expressionPower.substring(upZakladIndex + 1, expressionPower.length);
                var newString = before + "(Math.pow(" + zaklad + "," + mocnina + "))" + after;
                //console.log(newString);
                expressionPower = newString;
                console.log(expressionPower);
            }
        }


        return eval(expressionPower);
    };

    Calculator.prototype.makeResult = function () {
        if (this.lastOperation === ELastOperation.NUMBER) {
            this.expression += this.actualNumber.getNumber();
        } else if (this.lastOperation === ELastOperation.BASE_OPERATION) {
            this.expression = this.expression.substring(0, this.expression.length - 1);
        }
        this.lastOperation = ELastOperation.NUMBER;
        this.actualNumber = new Number();

        this.actualNumber.setNumber(this.getResult(this.expression));
        this.expression = "";
    };


    Calculator.prototype.echo = function () {
        if (this.actualNumber.getNumber() === "Infinity" || this.actualNumber.getNumber() === "Infinity") {
            document.getElementById("resultLine").innerHTML = "Výsledek je přiliš vysoký";
            this.lastOperation = ELastOperation.NUMBER_OVERFLOW;
        } else {
            document.getElementById("resultLine").innerHTML = this.actualNumber.getNumber();
        }

        document.getElementById("commandLine").innerHTML = this.expression.substring(0, this.expression.length);
        if (localStorage.getItem("memory") === null) {
            document.getElementById("memoryIndicator").innerHTML = "";
        } else {
            document.getElementById("memoryIndicator").innerHTML = "M";
        }
    };

    Calculator.prototype.erase = function () {
        this.expression = "";
        this.actualNumber = new Number();
        this.lastOperation = ELastOperation.NONE;
    };


};

var calculator = new Calculator();

function main() {
    changeResolution();
    window.addEventListener("resize", changeResolution);
    //document.getElementsByTagName("body").addEventListener("onresize", changeResolution);

    var operations = document.getElementsByClassName("operations");
    var numbers = document.getElementsByClassName("numbers");
    for (var i = 0; i < numbers.length; i++) {
        numbers[i].addEventListener("click", addChar);
        numbers[i].number = numbers[i].innerHTML;
    }

    for (i = 0; i < operations.length; i++) {
        operations[i].addEventListener("click", addOperation);
        console.log("naveseni: " + operations[i].id + " : " + i);
        operations[i].operation = operations[i].id;
    }
    calculator.echo();
    //changeResolution();

}
;

function addChar(event) {
    calculator.addNumber(event.target.number);
}
;

function addOperation(event) {
    //console.log(event.target.operation);
    calculator.addOperation(event.target.operation);

}
;

function changeResolution() {
    //alert(window.innerWidth+" x "+window.innerHeight)
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {

        var totalWidth = window.innerWidth - 20;
        var totalHeight = window.innerHeight - 40;
        if (totalHeight < 400) {
            totalHeight = 400;
        }
        //alert(totalHeight+" x "+totalWidth);
        var margin = 10;
        var displayHeight = 70;



        var buttonWidth = totalWidth / 6 - margin;
        var buttonHeight = (totalHeight - displayHeight) / 6 - 2 * margin;
        //alert(buttonHeight);
        document.getElementById("calculator").setAttribute("style", "width:" + totalWidth + "px");
        var buttons = document.getElementsByClassName("button");
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].setAttribute("style", "width:" + buttonWidth + "px;height:" + Math.round(buttonHeight) + "px");
        }

    }
}




window.addEventListener("load", main);

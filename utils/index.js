
/*
    -----------------------------------------------

    Defining utility functions for changing themes
     - "removeTheme" function
     - "addTheme" function

     -----------------------------------------------
*/
function removeTheme(themeNumber) {

    let smallButtons = document.getElementsByClassName("small-button")
    document.querySelector("body").classList.remove(`body-${themeNumber}`)
    document.getElementById("title-and-themes-container").classList.remove(`title-and-themes-container-${themeNumber}`)
    document.getElementById("theme-one-click").classList.remove(`theme-one-click-${themeNumber}`)
    document.getElementById("theme-two-click").classList.remove(`theme-two-click-${themeNumber}`)
    document.getElementById("theme-three-click").classList.remove(`theme-three-click-${themeNumber}`)
    document.getElementById("change-theme").classList.remove(`change-theme-${themeNumber}`)
    document.getElementById("display").classList.remove(`display-${themeNumber}`)
    document.getElementById("small-display").classList.remove(`small-display-${themeNumber}`)
    document.getElementById("display-input").classList.remove(`display-input-${themeNumber}`)
    document.getElementById("calc-buttons").classList.remove(`calc-buttons-${themeNumber}`)

    for(let i = 0; i < smallButtons.length; i ++) {
        smallButtons[i].classList.remove(`small-button-${themeNumber}`)
    }

    document.getElementById("reset").classList.remove(`reset-${themeNumber}`)
    document.getElementById("del").classList.remove(`del-${themeNumber}`)
    document.getElementById("equal").classList.remove(`equal-${themeNumber}`)
}

function addTheme(themeNumber) {

    let smallButtons = document.getElementsByClassName("small-button")
    document.querySelector("body").classList.add(`body-${themeNumber}`)
    document.getElementById("title-and-themes-container").classList.add(`title-and-themes-container-${themeNumber}`)
    document.getElementById("theme-one-click").classList.add(`theme-one-click-${themeNumber}`)
    document.getElementById("theme-two-click").classList.add(`theme-two-click-${themeNumber}`)
    document.getElementById("theme-three-click").classList.add(`theme-three-click-${themeNumber}`)
    document.getElementById("change-theme").classList.add(`change-theme-${themeNumber}`)
    document.getElementById("display").classList.add(`display-${themeNumber}`)
    document.getElementById("small-display").classList.add(`small-display-${themeNumber}`)
    document.getElementById("display-input").classList.add(`display-input-${themeNumber}`)
    document.getElementById("calc-buttons").classList.add(`calc-buttons-${themeNumber}`)

    for(let i = 0; i < smallButtons.length; i ++) {
        smallButtons[i].classList.add(`small-button-${themeNumber}`)
    }

    document.getElementById("reset").classList.add(`reset-${themeNumber}`)
    document.getElementById("del").classList.add(`del-${themeNumber}`)
    document.getElementById("equal").classList.add(`equal-${themeNumber}`)
}

/* 
    -----------------------------------------------

    Changing different themes when theme one/two/three is clicked

    -----------------------------------------------
*/

document.getElementById("theme-one-click").addEventListener("click", function(){

        removeTheme("theme-two")
        removeTheme("theme-three")
})

document.getElementById("theme-two-click").addEventListener("click", function(){

    removeTheme("theme-three")
    addTheme("theme-two")
})

document.getElementById("theme-three-click").addEventListener("click", function(){

    removeTheme("theme-two")
    addTheme("theme-three")
})

/*
    --------------------------------

    Utility functions for calculator

    --------------------------------
*/

// Global variable that is used to put result into small display on first operation after calculation
let equalWasLastAction = false

// Triggered when clicking on "point" HTML button or by pressing . key 
const setPoint = () => {

    let inputValue = document.getElementById("display-input").value
    if (inputValue.includes("."))
        return
    
    document.getElementById("display-input").value += "."
}

// Triggered when clicking on "reset" HTML button or by pressing Escape key
const resetFields = () => {

    document.getElementById("display-input").value = ""
    document.getElementById("small-display").innerText = ""
    equalWasLastAction = false
}

// Triggered when clicking on "del" HTML button or by pressing backspace key
const deleteLastCharacter = () => {

    let inputValue = document.getElementById("display-input").value
    if(inputValue.includes("."))
        document.getElementById("display-input").value = document.getElementById("display-input").value.slice(0,-1)
    else if (inputValue.slice(0,-1).length === 0)
        document.getElementById("display-input").value = ""
    else
        document.getElementById("display-input").value = Number(inputValue.replaceAll(",","").slice(0,-1)).toLocaleString()
}

/*
    Operation function receives one argument: 
    op - can have one of four values: +, -, *, /
    Function will exit in case invalid operator is entered 

    Operation function is created and reused for all types of clicks 
    either through keyboard or buttons

    Triggered when clicking on +, -, *, / HTML buttons or when
    pressing same keyboard keys
*/
const operation = (op) => {

    let supportedOperators = ["+", "-", "*", "/"]
    if (!supportedOperators.includes(op))
        return

    let inputValue = document.getElementById("display-input").value
    let display = document.getElementById("small-display").innerText
    
    // Exiting in case input is empty or in case when input ends with "." 
    // in that case user needs to add fraction
    if (!inputValue || inputValue.endsWith(".")) {

        // Changing last symbol in small display if letter is empty and {op} is pressed
        // ignoring this check in case display is empty
        if (display) {
            document.getElementById("small-display").innerText = display.slice(0, -1) + op
        }

        return 
    }

    // Setting last calculation result into small display
    if (equalWasLastAction)
        document.getElementById("small-display").innerText = ""
    equalWasLastAction = false

    document.getElementById("small-display").innerText += inputValue + op
    document.getElementById("display-input").value = ""
}

/*
    First implementation using evaluate:
    - it works, security concerts are solved by cleaning the string
    - Bellow this function is another implementation where entire calculation is 
      done without any ready-to-use functions
    
      Triggered when clicking on "=" HTML button or by pressing enter
*/
const equalWithEvaluate = () => {

    let fullExpression = document.getElementById("small-display").innerText 
    let inputValue = document.getElementById("display-input").value

    // Exiting in case small display (full expression) and input are empty
    if (!inputValue && !fullExpression)
        return

    // If input is empty, removing last letter from expression (+, -, *, /)
    if (!inputValue)
        fullExpression = fullExpression.slice(0, -1)
    
    // Exiting the function if input exists but it is not proper fraction number
    if(inputValue && inputValue.endsWith("."))
        return

    // Adding input to full expression and updating small display
    if (inputValue) {

        fullExpression += inputValue
        document.getElementById("small-display").innerText = fullExpression
    }
        
    fullExpression = fullExpression.replaceAll(",","") // Removing all formating commas
    fullExpression = fullExpression.replace(/[^0-9\+\-\*\/\.]/g, '') // Removing potentially malicious code
    
    /*
         Rounding floating point numbers to two decimal points, otherwise 8.2 - 2 => 6.199999..
         due to the way numbers are represented in memory
    */
    evaluatedExpression = parseFloat(eval(fullExpression).toFixed(2))
    document.getElementById("display-input").value = evaluatedExpression.toString()

    equalWasLastAction = true
}

/*
    Triggered when clicking on "=" HTML button or by pressing enter
*/
const equalWithoutEvaluate = () => {

    let fullExpression = document.getElementById("small-display").innerText 
    let inputValue = document.getElementById("display-input").value

    // Exiting in case small display (full expression) and input are empty
    if (!inputValue && !fullExpression)
        return

    // If input is empty, removing last letter from expression (+, -, *, /)
    if (!inputValue)
        fullExpression = fullExpression.slice(0, -1)
    
    // Exiting the function if input exists but it is not proper fraction number
    if(inputValue && inputValue.endsWith("."))
        return

    // Adding input to full expression and updating small display
    if (inputValue) {

        fullExpression += inputValue
        document.getElementById("small-display").innerText = fullExpression
    }
        
    fullExpression = fullExpression.replaceAll(",","") // Removing all formating commas

    /*
        Creating list of sub expressions: 
        0 + 2 + 3 + 11*2 - 4/5 + 11*6*9*1/2 - 1 would return =>
        ['0', '+2', '+3', '+11*2', '-4/5', '+11*6*9*1/2', '-1']

        The idea is that each sub-expression will be evaluated and final result 
        represents the sum of all sub-expressions. 

        By doing so, operation presedence is kept in mind. 
        E.g. 4-5*3 will be calculated as (4)-(5*3) rather than (4-5)*3

    */
    let subExpressions = fullExpression.match(/(-|\+)?((\d|\.)+(\*|\/)?)+/g) 
    let result = 0
    subExpressions.forEach( (expression) => {
    
        /*
            Matching case where we have:
            1. number
            2. -number
            3. +number
        */
       if (!expression.includes("*") && !expression.includes("/")){
           
            let number = expression.match(/^(\+|-)?[0123456789.]+$/)[0]
            result += parseFloat(number)
       }
       /*
            Maching cases where we have to calculate more complex expression
            that contains multiplication or division
       */
       else {

            let firstNumber = expression.match(/(\+|-)?(\d|\.)+/)[0] // Fetching first number
            expression = expression.replace(firstNumber, "") // Removing first number from the expression
            let accumulator = parseFloat(firstNumber) // Adding first number to accumulator

            while (expression) {

                let nextMatch = expression.match(/(\*|\/)(\d|\.)+/)
                let operation = nextMatch[1]
                let value = nextMatch[2]
                expression = expression.replace(nextMatch[0], "")
                
                switch (operation) {

                    case "*":
                        accumulator *= parseFloat(value)
                        break
                    case "/":
                        accumulator /= parseFloat(value)
                        break
                    default:
                        break
                }
            }

            result += accumulator
       }
    })

    document.getElementById("display-input").value = result.toString()
    equalWasLastAction = true
}

/*
    Triggered when digit HTML button is clicked or when number is pressed via keyboard
*/
const numberEntered = (digitHTMLElement) => {

    
    let newValue = document.getElementById("display-input").value + digitHTMLElement.id
    if(newValue.includes("."))
        document.getElementById("display-input").value = newValue
    else 
        document.getElementById("display-input").value = Number(newValue.replaceAll(",","")).toLocaleString()

    // Scrolling to the rightmost location in the input
    document.getElementById("display-input").scrollLeft = document.getElementById("display-input").scrollWidth
}


/*
    --------------------------------

    When HTML buttons (0-9) are clicked 
    input is updated 

    --------------------------------
*/

let calcDigits = document.querySelectorAll(".digit")
for(let i = 0; i < calcDigits.length; i++) {
    
    document.getElementById(`${calcDigits[i].id}`).addEventListener("click", function() {
        numberEntered(calcDigits[i])
    })
} 

/*
    --------------------------------

    When . is clicked
    input is updated

    --------------------------------
*/

document.getElementById("point").addEventListener ("click",function(){
    setPoint()
})

/*
    --------------------------------

    When +, -, *, / are clicked 
    small display is updated 

    --------------------------------
*/
document.getElementById("plus").addEventListener ("click",function(){
    operation("+")
})

document.getElementById("minus").addEventListener ("click",function(){
    operation("-")
})

document.getElementById("multiply").addEventListener ("click",function(){
    operation("*")
})

document.getElementById("divide").addEventListener ("click",function(){
    operation("/")
})

/*
    --------------------------------

    When reset button is clicked 
    - input is cleared
    - small display is cleared 

    --------------------------------
*/
document.getElementById("reset").addEventListener ("click",function(){
    resetFields()
})

/*
    --------------------------------

    When del button is clicked 
    input is updated

    --------------------------------
*/
document.getElementById("del").addEventListener ("click",function(){
    deleteLastCharacter()
})

/*
    Clicking on equality sign (=)
*/
document.getElementById("equal").addEventListener ("click",function(){
    equalWithoutEvaluate()
})

/*

    ------------------------------------------------

    Adding support for key usage 
    - Users can enter expressions through keyboard 
    - Users can delete (using backspace)
    - Users can evaluate (using enter)

    ------------------------------------------------
*/
document.addEventListener("keydown", function(e){

    e.preventDefault()
    switch (e.key) {
        case "0":
            numberEntered(document.getElementById("0"))
            break
        case "1":
            numberEntered(document.getElementById("1"))
            break
        case "2":
            numberEntered(document.getElementById("2"))
            break
        case "3":
            numberEntered(document.getElementById("3"))
            break
        case "4":
            numberEntered(document.getElementById("4"))
            break
        case "5":
            numberEntered(document.getElementById("5"))
            break
        case "6":
            numberEntered(document.getElementById("6"))
            break
        case "7":
            numberEntered(document.getElementById("7"))
            break
        case "8":
            numberEntered(document.getElementById("8"))
            break
        case "9":
            numberEntered(document.getElementById("9"))
            break
        case ".":
            setPoint()
            break
        case "+":
            operation("+")
            break 
        case "-":
            operation("-")
            break
        case "*":
            operation("*")
            break
        case "/":
            operation("/")
            break
        case "Enter":
            equalWithoutEvaluate()
            break
        case "Backspace":
            deleteLastCharacter()
            break
        case "Escape":
            resetFields()
            break
        default:
            break
    }
})
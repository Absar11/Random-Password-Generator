const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbol");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generate-button");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
// let upperCaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
// let lowerCaseLetters = "abcdefghijklmnopqrstuvwxyz";
// let numberCharacters = "1234567890";
let specialCharacter = "!@#$%^&*()_+~`|}{[]:;?><,./-=\\";

// set password length on the basis of slide value
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
}

function setIndicator(color){
    indicator.style.backgroudColor = color;
}

function getRandomInteger(min, max){
    return Math.floor((Math.random()*(max - min)) + min);
}

function generateRandomNumber(){
    return getRandomInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRandomInteger(97, 123));
}

function generateUpperCase(){
    return String.fromCharCode(getRandomInteger(65,96));
}

function generateSymbol(){
    const randNum = getRandomInteger(0,specialCharacter.length)
    return specialCharacter.charAt(randNum);
}

function calculateStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNumbers = false;
    let hasSpecialChar = false;

    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNumbers = true;
    if(symbolCheck.checked) hasSpecialChar = true;

    if (hasUpper && hasLower && (hasNumbers || hasSpecialChar) && passwordLength >= 8){
        setIndicator("#0f0");
    } else if(
        (hasLower || hasUpper) && (hasNumbers || hasSpecialChar) && passwordLength >= 6
    ){
        setIndicator("#ff0");
    }else{
        setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch(e){
        copyMsg.innerText = "Failed";
        alert('Error Occured in text Copieng');
        console.error(e);
    }
    setTimeout( () => {
        copyMsg.classList.add('active');
    },2000);
}

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value){
        copyContent();
    }
});

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener("change", handleCheckBoxChange);
})

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked){
            checkCount++;
        }
    })
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
};

function shuffledPassword(array){
    //Fisher Yates Method
    for(let i=array.length-1; i>0; i--){
        const j = Math.floor(Math.random()*(i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

generateBtn.addEventListener('click', ()=> {
    if(checkCount <= 0){
        return;
    }
    console.log(`Pass Length: ${passwordLength}`);
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
    
    password = "";
    
    // if(uppercaseCheck.checked){
    //     password += generateUpperCase();
    // }

    // if(lowercaseCheck.checked){
    //     password += generateLowerCase();
    // }

    // if(numbersCheck.checked){
    //     password += generateRandomNumber();
    // }

    // if(symbolCheck.checked){
    //     password += generateSymbol();
    // }

    let funcArr = [];

    if(uppercaseCheck.checked){
        funcArr.push(generateUpperCase);
    }

    if(lowercaseCheck.checked){
        funcArr.push(generateLowerCase);
    }

    if(numbersCheck.checked){
        funcArr.push(generateRandomNumber);
    }

    if(symbolCheck.checked){
        funcArr.push(generateSymbol);
    }

    for(let i=0; i<funcArr.length; i++){
        password += funcArr[i]();
    }

    for(let i=0; i<passwordLength-funcArr.length; i++){
        let index = getRandomInteger(0, funcArr.length);
        password += funcArr[index]();
    }

    // password = shuffledPassword(Array.from(password));
    console.log("Password Generated");
    passwordDisplay.value = password;

    calculateStrength();

})




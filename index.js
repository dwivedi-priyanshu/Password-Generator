const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generator");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbol = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
//store the number of check box checked
let checkCount = 0;
handleSlider();
//set circle color to grey
setIndicator("#ccc");

//set password length
// function handleSlider() {
//     inputSlider.value = passwordLength;
//     lengthDisplay.textContent = passwordLength;
//     const mini = inputSlider.min;
//     const maxi = inputSlider.max;
//     inputSlider.style.backgroundSize = ( (passwordLength-mini)*100 / (maxi-mini) ) + "% 100%";
// }
function handleSlider() {

    inputSlider.value = passwordLength;
    lengthDisplay.textContent = passwordLength;    
    const mini = parseInt(inputSlider.min);
    const maxi = parseInt(inputSlider.max);
    const percentage = ((passwordLength - mini) * 100) / (maxi - mini);

    // Dynamically set the background size via background-image linear gradient
    inputSlider.style.backgroundImage = `linear-gradient(to right, var(--vb-violet) ${percentage}%, var(--lt-violet) ${percentage}%)`;

}


function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0 0 12px 1px ${color}`;
}

//get random integer

function getRandomInteger(min, max) {
    let res = Math.floor(Math.random() * (max - min)) + min;
    return res;
}
//generates random number
function generateRandomNumber() {
    return getRandomInteger(0, 9);
}

function generateLowerCase() {
    return String.fromCharCode(getRandomInteger(97, 123));
}

function generateUpperCase() {
    return String.fromCharCode(getRandomInteger(65, 91));
}

function generateSymbol() {
    let ran = getRandomInteger(0, symbol.length);
    return symbol.charAt(ran);
}

function calStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;

    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNumber = true;
    if (symbolsCheck.checked) hasSymbol = true;

    if (hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if (
        (hasLower || hasUpper) &&
        (hasNumber || hasSymbol) &&
        passwordLength >= 6
    ) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

//copy password
async function copyContent(){
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch(e){
        copyMsg.innerText="failed";
    }

    //copy wala span visible
    copyMsg.classList.add("active");

    //after 2s it will become invisilble
    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },2000);

}
function handleCheckboxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked) checkCount+=1;
    });
    //special condition
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
}
allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('click', handleCheckboxChange)
})

inputSlider.addEventListener("input",(e)=>{
    passwordLength=e.target.value;
    handleSlider();
})

copyBtn.addEventListener("click",()=>{
    if(passwordDisplay.value)
        copyContent(); 
})

function shuffelPassword(array){
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

generateBtn.addEventListener("click",()=>{ 
    //if no checkbox is checked
    if(checkCount<=0) return;


    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }

    //generating password
    password="";
    // if(uppercaseCheck.checked) password=generateUpperCase();
    // if(lowercaseCheck.checked) password=generateLowerCase();
    // if(numbersCheck.checked) password=generateRandomNumber();
    // if(symbolsCheck.checked) password=generateSymbol();
    let funcArr=[];
    if(uppercaseCheck.checked) funcArr.push(generateUpperCase);
    if(lowercaseCheck.checked) funcArr.push(generateLowerCase);
    if(numbersCheck.checked) funcArr.push(generateRandomNumber);
    if(symbolsCheck.checked) funcArr.push(generateSymbol);

    //compulsory addition
    for(let i=0;i<funcArr.length;i++){
        password+=funcArr[i]();
    }
    //remainig characters
    for(let i=0;i<passwordLength-funcArr.length;i++){
        let random=getRandomInteger(0,funcArr.length);
        password+=funcArr[random]();
    }

    //shuffling password
    password=shuffelPassword(Array.from(password));
    passwordDisplay.value=password;
    calStrength();

})
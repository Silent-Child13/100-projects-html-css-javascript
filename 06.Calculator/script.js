const display = document.getElementById("display");
const MAX_INPUT_LENGTH = 30; 
const MAX_DIGITS = 15; 

function appendToDisplay(input) {
  
  const totalDigits = display.value.replace(/[^0-9]/g, '').length;
  const totalCharacters = display.value.length;

  
  if (totalCharacters < MAX_INPUT_LENGTH && (totalDigits < MAX_DIGITS || /[+\-*/]/.test(input))) {
    display.value += input;
    adjustFontSize();
    display.scrollLeft = display.scrollWidth;
  }
}

function clearDisplay() {
  display.value = "";
  adjustFontSize();
}

function backspace() {
  display.value = display.value.slice(0, -1);
  adjustFontSize();
}

function calculate() {
  const expression = display.value.trim();

  
  if (expression === "" || /[^0-9+\-*/().]/.test(expression)) {
    display.value = "Error";
    return;
  }

  try {
    let result = eval(expression);

    
    if (isNaN(result) || !isFinite(result)) {
      display.value = "Error";
    } else {
      
      if (Math.abs(result) > 999999999 || Math.abs(result) < 0.000001) {
        display.value = result.toExponential(10);
      } else {
        display.value = result.toPrecision(10);
      }

      
      if (display.value.length > MAX_INPUT_LENGTH) {
        display.value = display.value.slice(0, MAX_INPUT_LENGTH);
      }
    }

    adjustFontSize();
  } catch (error) {
    display.value = "Error";
    adjustFontSize();
  }
}

function adjustFontSize() {
  const length = display.value.length;
  if (length > 15) {
    display.style.fontSize = '2rem'; 
  } else if (length > 10) {
    display.style.fontSize = '3rem'; 
  } else {
    display.style.fontSize = '5rem'; 
  }
}
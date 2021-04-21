/**************************************************************************************************************
***  General Functions
***************************************************************************************************************/

/**
 * @param String 
 * @returns String object with all {}'s replaced with the specified variables
 */
String.prototype.format = function () {
  var i = 0, args = arguments;
  return this.replace(/{}/g, function () {
    return typeof args[i] != 'undefined' ? args[i++] : '';
  });
};

/**
 * @returns String object of database code from textarea and adds custom
 *          lexicon + parser Prolog code in order to understand sentences
 */
function get_prolog_code() {
  prolog_code = document.getElementById("program").value;
  return prolog_code  
}

/**************************************************************************************************************
***  Answer/Callback Functions
***************************************************************************************************************/

// Callback function
function account_show(name) {
  // Get output container
  var result = document.getElementById("result");
  // Return callback function
  return function(answer) {
    // Valid answer
    if(pl.type.is_substitution(answer)) {
      // Get the amount
      var amount = answer.lookup("Amount");
      // Get the bank
      var bank = answer.lookup("Bank");
      // Get the person
      var person = name != "Y" ? name : answer.lookup("Y");
      // Show answer
      var result_string = '{} has ${} in a {} account'.format(person, amount, bank);
      result.innerHTML = result.innerHTML + "<div>" + result_string + "</div>";
    }
  };
}

// Callback function
function bank_show(name) {
  // Get output container
  var result = document.getElementById("result");
  // Return callback function
  return function(answer) {
    // Valid answer
    if(pl.type.is_substitution(answer)) {
      // Get the bank
      var bank_name = name != "Y" ? name : answer.lookup("Y");
      // Show answer
      var result_string = '{}'.format(bank_name);
      result.innerHTML = result.innerHTML + "<div>" + result_string + "</div>";
    }
  };
}

function prolog_query_show() {
  // Get output container
  var result = document.getElementById("result");
  // Return callback function
  return function(answer) {
    // Valid answer
    if(pl.type.is_substitution(answer)) {
      var val = answer.lookup("X");
      // Show answer
      result.innerHTML = result.innerHTML + "<div>" + val + "</div>";
    }
  };
}

function sentence_query_show() {
  // Get output container
  var result = document.getElementById("result");
  // Return callback function
  return function(answer) {
    // Valid answer
    if(pl.type.is_substitution(answer)) {
      var val = answer.lookup("X");
      // Show answer
      result.innerHTML = result.innerHTML + "<div>" + val + "</div>";
    }
  };
}

/**************************************************************************************************************
***  Functions to consult Prolog code *************************************************************************
***************************************************************************************************************/
  
// Show the account of a person
function account(name) {
  // Create session
  var session = pl.create();
  // Get program
  var program = get_prolog_code();
  // Clear output
  document.getElementById("result").innerHTML = "";
  // Consult program
  session.consult(program);
  // Query goal
  var string_query = 'account(Id, {}, Bank, Amount).'.format(name);
  session.query(string_query);
  // Find answers
  session.answers(account_show(name));
}

// Check if bank exists
function bank(bank_name) {
  // Create session
  var session = pl.create();
  // Get program
  var program = get_prolog_code();
  // Clear output
  document.getElementById("result").innerHTML = "";
  // Consult program
  session.consult(program);
  // Query goal
  var string_query = 'bank({}).'.format(bank_name);
  session.query(string_query);
  // Find answers
  session.answers(bank_show(bank_name));
}

// Run user prolog query
function prolog_query(name) {
  // Create session
  var session = pl.create();
  // Get program
  var program = get_prolog_code();
  // Clear output
  document.getElementById("result").innerHTML = "";
  // Consult program
  session.consult(program);
  // Query goal
  //var string_query = 'location(X, canada).';
  var string_query = name;
  session.query(string_query);
  // Find answers
  session.answers(prolog_query_show());
}

function sentence_query(query) {
  query_list = query.split(" ");
  query = query_list.join(",");
  query = '[' + query + ']';

  // Create session
  var session = pl.create();
  // Get program
  var program = get_prolog_code();
  // Clear output
  document.getElementById("result").innerHTML = "";
  // Consult program
  session.consult(program);
  // Query goal
  var string_query = 'what({}, X).'.format(query);
  session.query(string_query);
  // Find answers
  session.answers(sentence_query_show(query));
}

/**************************************************************************************************************
***  Events
***************************************************************************************************************/

function setbg(color, id) {
  document.getElementById(id).style.background=color
}

function click_english_button() {
  var txt = document.getElementById("english_query_textinput").value;
  txt != "" ? txt : "Y";
  sentence_query(txt);
}

function click_prolog_button() {
  var txt = document.getElementById("prolog_query_textinput").value;
  txt != "" ? txt : "Y";
  prolog_query(txt);
}

// Key pressed while in english query input textbox
function english_query_keypress() {
  english_query_input = document.getElementById("english_query_textinput");

  if (english_query_input) {
    english_query_input.onkeyup = function(e){
      if(e.keyCode == 13){    // If key == Enter
        click_english_button();
      }
    }
  }
}

// Key pressed while in prolog query input textbox
function prolog_query_keypress() {
  prolog_query_input = document.getElementById("prolog_query_textinput");

  if (prolog_query_input) {
    prolog_query_input.onkeyup = function(e){
      if(e.keyCode == 13){    // If key == Enter
        click_prolog_button();
      }
    }
  }
}

english_query_keypress();
prolog_query_keypress();

/**************************************************************************************************************
***************************************************************************************************************
***************************************************************************************************************/
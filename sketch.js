String.prototype.format = function () {
  var i = 0, args = arguments;
  return this.replace(/{}/g, function () {
    return typeof args[i] != 'undefined' ? args[i++] : '';
  });
};
  
  // Callback function
  function likes_show(name) {
    // Get output container
    var result = document.getElementById("result");
    // Return callback function
    return function(answer) {
      // Valid answer
      if(pl.type.is_substitution(answer)) {
        // Get the value of the food
        var food = answer.lookup("X");
        // Get the person
        var person = name != "Y" ? name : answer.lookup("Y");
        // Show answer
        result.innerHTML = result.innerHTML + "<div>" + person + " likes " + food + "</div>";
      }
    };
  }

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
  
  
  // Show the likes of a person
  function likes(name) {
    // Create session
    var session = pl.create(1000);
    // Get program
    var program = document.getElementById("program").value;
    // Clear output
    document.getElementById("result").innerHTML = "";
    // Consult program
    session.consult(program);
    // Query goal
    var string_query = 'likes({}, X).'.format(name);
    session.query(string_query);
    // Find answers
    session.answers(likes_show(name), 1000);
  }

  // Show the account of a person
  function account(name) {
    // Create session
    var session = pl.create(1000);
    // Get program
    var program = document.getElementById("program").value;
    // Clear output
    document.getElementById("result").innerHTML = "";
    // Consult program
    session.consult(program);
    // Query goal
    var string_query = 'account(Id, {}, Bank, Amount).'.format(name);
    session.query(string_query);
    // Find answers
    session.answers(account_show(name), 1000);
  }
  
  /** EVENTS */
  
  // onClick #button
  function clickButton() {
    // Get person
    var name = document.getElementById("name").value;
    name = name != "" ? name : "Y";
    // Get likes
    //likes(name);
    account(name);
  }
  
  // onChange #name
  function changeName() {
    var name = document.getElementById("name").value;
    document.getElementById("button").value = name != "" ? "What does " + name  + " like?" : "See all likes";
  }
  changeName();
  
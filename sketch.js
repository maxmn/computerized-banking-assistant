/**************************************************************************************************************/
/**************************************************************************************************************/

var lexicon =
'article(a). article(an). article(any). \
common_noun(bank,X) :- bank(X).\
common_noun(city,X) :- city(X).\
common_noun(country,X) :- country(X).\
common_noun(man,X) :- gender(X,male).\
common_noun(male,X) :- gender(X,male).\
common_noun(boy,X) :- gender(X,female).\
common_noun(woman,X) :- gender(X,female).\
common_noun(female,X) :- gender(X,female).\
common_noun(girl,X) :- gender(X,female).\
common_noun(owner,X) :- account(_,X,_,_).\
common_noun(person,X) :- person(X).\
common_noun(account,X) :- account(X,_,_,_).\
common_noun(balance,X) :- account(_,_,_,X).\
common_noun(amount,X) :- account(_,_,_,X).\
common_noun(canadian,X) :- lives(X,City), location(City, canada).\
common_noun(american,X) :- lives(X,City), location(City, usa).\
/* account OF balance  */ preposition(of,X,Y) :- account(X,_,_,Y). \
/* balance OF account  */ preposition(of,X,Y) :- account(Y,_,_,X). \
/* account OF person   */ preposition(of,X,Y) :- account(X,Y,_,_).\
/* person OF account   */ preposition(of,X,Y) :- account(Y,X,_,_).\
/* person FROM city    */ preposition(from,X,Y) :- lives(X,Y).                        \
/* person FROM country */ preposition(from,X,Y) :- lives(X,City), location(City, Y).\
/* person FROM bank    */ preposition(from,X,Y) :- account(_,X,Y,_).   \
/* bank FROM city      */ preposition(from,X,Y) :- bank(X), location(X, Y).\
/* bank FROM country   */ preposition(from,X,Y) :- bank(X), location(X, City), location(City, Y).\
/* city FROM country   */ preposition(from,X,Y) :- city(X), location(X, Y).\
/* account FROM ban    */ preposition(from,X,Y) :- account(X,_,Y,_).\
/* city IN country     */ preposition(in,X,Y) :- city(X), location(X,Y).\
/* account IN bank     */ preposition(in,X,Y) :- account(X,_,Y,_).\
/* bank IN city        */ preposition(in,X,Y) :- bank(X), location(X,Y).\
/* bank IN country     */ preposition(in,X,Y) :- location(X,City), location(City, Y).\
/* person IN bank      */ preposition(in,X,Y) :- account(_,X,Y,_).\
/* person WITH account */ preposition(with,X,Y) :- account(Y,X,_,_).\
/* bank WITH account   */ preposition(with,X,Y) :- account(Y,_,X,_).\
/* city WITH bank      */ preposition(with,X,Y) :- city(X), location(Y,X).\
/* bank WITH person    */ preposition(with,X,Y) :- account(_,Y,X,_).\
/* account WITH balance*/ preposition(with,X,Y) :- account(X,_,_,Y).\
proper_noun(City) :- city(City).\
proper_noun(Country) :- country(Country).\
proper_noun(Man) :- gender(Man,male).\
proper_noun(Woman) :- gender(Woman,female).\
proper_noun(Bank) :- bank(Bank).\
adjective(canadian,X) :- lives(X,City), location(City,canada).\
adjective(canadian,X) :- location(X,City), location(City,canada).\
adjective(canadian,X) :- location(X,canada).\
adjective(american,X) :- lives(X,City), location(City,usa).\
adjective(american,X) :- location(X,City), location(City,usa).\
adjective(american,X) :- location(X,usa).\
adjective(female,X) :- gender(X,female).\
adjective(male,X) :- gender(X,male).\
adjective(local,X) :- lives(X,City), location(City,canada).\
adjective(local,X) :- location(X,City), location(City,canada).\
adjective(local,X) :- location(X,canada).  \
adjective(foreign,X) :- lives(X,City), location(City,usa).\
adjective(foreign,X) :- location(X,City), location(City,usa).\
adjective(foreign,X) :- location(X,usa). \
adjective(small,X) :- account(X,_,_,B), B < 1000.\
adjective(small,B) :- account(_,_,_,B), B < 1000.\
adjective(medium,X) :- account(X,_,_,B), B >= 1000, B =< 10000.\
adjective(medium,B) :- account(_,_,_,B), B >= 1000, B =< 10000.\
adjective(large,X) :- account(X,_,_,B), B > 10000.\
adjective(large,B) :- account(_,_,_,B), B > 10000.\
adjective(old,X) :- created(X,_,_,_,Year), Year < 2020.\
adjective(recent,X) :- created(X,_,_,_,2020).\
'

var parser = 
'what(Words, Ref) :- np(Words, Ref).\
np([Name],Name) :- proper_noun(Name).\
np([Art|Rest], Who) :- not Art=the, article(Art), np2(Rest, Who).\
np([the|Rest], Who) :- np2(Rest, Who), not (np2(Rest,Who2), not Who=Who2).\
np2([Adj|Rest],Who) :- adjective(Adj,Who), np2(Rest, Who).\
np2([Noun|Rest], Who) :- common_noun(Noun, Who), mods(Rest,Who).\
mods([], _).\
mods(Words, Who) :-\
  appendLists(Start, End, Words),\
  prepPhrase(Start, Who),	mods(End, Who).\
prepPhrase([between,X,and,Y], B) :- \
    number(X), number(Y), B >= X, B =< Y.\
prepPhrase([Prep|Rest], Who) :-\
  preposition(Prep, Who, Ref), np(Rest, Ref).\
appendLists([], L, L).\
appendLists([H|L1], L2, [H|L3]) :-  appendLists(L1, L2, L3).'

/**************************************************************************************************************/
/**************************************************************************************************************/

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
  database = document.getElementById("program").value;
  return database + lexicon + parser  
}

/**************************************************************************************************************/
/**************************************************************************************************************/

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

// Callback function
function bank_show(name) {
  // Get output container
  var result = document.getElementById("result");
  // Return callback function
  return function(answer) {
    // Valid answer
    if(pl.type.is_substitution(answer)) {
      // Get the bank
      //var bank = answer.lookup("Bank");
      // Get the person
      var bank_name = name != "Y" ? name : answer.lookup("Y");
      // Show answer
      var result_string = '{}'.format(bank_name);
      result.innerHTML = result.innerHTML + "<div>" + result_string + "</div>";
    }
  };
}

/**************************************************************************************************************/
/**************************************************************************************************************/
  
// Show the likes of a person
function likes(name) {
  // Create session
  var session = pl.create(1000);
  // Get program
  var program = get_prolog_code();
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
  var program = get_prolog_code();
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

// Check if bank exists
function bank(bank_name) {
  // Create session
  var session = pl.create(1000);
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
  session.answers(bank_show(bank_name), 1000);
}

/**************************************************************************************************************/
/**************************************************************************************************************/
/** EVENTS */

// onClick #button
function clickButton() {
  // Get person
  var name = document.getElementById("name").value;
  name = name != "" ? name : "Y";
  // Get likes
  //likes(name);
  bank(name);
}

// onChange #name
function changeName() {
  var name = document.getElementById("name").value;
  document.getElementById("button").value = name != "" ? "What does " + name  + " like?" : "See all likes";
}
changeName();

/**************************************************************************************************************/
/**************************************************************************************************************/
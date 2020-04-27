var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'follow this syntax to make an request => url/noOfQuestions/noOfDigitsInMinuend/noOfDigitsInSubtrahend/<false or true>'
  });
});

router.get('/:noOfQuestions/:noOfDigitsInMinuend/:noOfDigitsInSubtrahend/:flag', function (req, res, next) {
  let { err, questions } = api(req.params.noOfQuestions, req.params.noOfDigitsInMinuend, req.params.noOfDigitsInSubtrahend, req.params.flag)
  console.log('que ', questions);
  console.log('err ', questions);
  res.render('subtraction', { title: 'Express', questions: questions, err: err });
});

module.exports = router;



function api(noOfQues, noOfDigitsInMinuend, noOfDigitsInSubtrahend, flag) {
  let questions = [];
  try {
    if (!noOfQues || isNaN(noOfQues)
      || !noOfDigitsInMinuend || isNaN(noOfDigitsInMinuend)
      || !noOfDigitsInSubtrahend || isNaN(noOfDigitsInSubtrahend)
      || flag == null) {
      throw "Input Parameters Not Correct."
    }
    if (flag == "false") {
      flag = false;
    }
    if (noOfDigitsInMinuend > 10 || noOfDigitsInSubtrahend > 10) {
      throw "Input Number of digits can not be more than 10."
    }

    if (noOfDigitsInSubtrahend > noOfDigitsInMinuend) {
      throw "No of digits in Subtrahend can not be more than Minuend as negative solution is not allowed."
    }

    if (noOfDigitsInSubtrahend == 1 && noOfDigitsInMinuend == 1 && flag == true) {
      throw "Borrowing not possible in this case."
    }

    for (let index = 0; index < noOfQues; index++) {
      questions.push(makeQuestion(noOfDigitsInMinuend, noOfDigitsInSubtrahend, flag));
    }
  }

  catch (err) {
    console.log(err);
    return { err: err, questions: null };
  }
  return { err: null, questions: questions };
}


function makeQuestion(noOfDigitsInMinuend, noOfDigitsInSubtrahend, flag) {
  let questionValidated = false;
  let finalMinuend, finalSubtrahend;
  let options = [];
  while (!questionValidated) {
    let { minuend, subtrahend } = generateMinuendAndSubtrahend(noOfDigitsInMinuend, noOfDigitsInSubtrahend);
    if ((minuend - subtrahend < 10) && flag == true) {
      continue;
    }
    let arrm = minuend.toString().split("").reverse();
    let arrs = subtrahend.toString().split("").reverse();

    if (flag) {
      let diff = (minuend - subtrahend) + "";
      for (let index = 0; index < diff.length - 1; index++) {
        if (arrm[index] > arrs[index]) {
          let temp = arrs[index];
          arrs[index] = arrm[index];
          arrm[index] = temp;
          break;
        }
      }
    } else {
      for (let index = 0; index < arrs.length; index++) {
        if (arrs[index] > arrm[index]) {
          let temp = arrs[index];
          arrs[index] = arrm[index];
          arrm[index] = temp;
        }
      }
      // for loop ends.
    }

    finalMinuend = Number(arrm.reverse().join(""));
    finalSubtrahend = Number(arrs.reverse().join(""));
    questionValidated = validate(finalMinuend, finalSubtrahend, arrm, arrs, flag); // failSafe
    let indx = Math.floor(Math.random() * arrs.length);
    options = [
      finalMinuend - finalSubtrahend,
      finalMinuend + finalSubtrahend,
      Math.abs(finalMinuend - arrs[indx] * Math.pow(10, indx + 1)),
      Math.abs(finalSubtrahend - arrs[indx] * Math.pow(10, indx + 1)),
    ];
    shuffle(options);
  }
  return {
    minuend: finalMinuend,
    subtrahend: finalSubtrahend,
    options,
    answer: finalMinuend - finalSubtrahend,
  };
}

function getRandomNumber(noOfDigits) {
  // check for ones digit.
  return Math.floor(Math.random() * (Math.pow(10, noOfDigits) - Math.pow(10, noOfDigits - 1)) + (Math.pow(10, noOfDigits - 1)));
}

function generateMinuendAndSubtrahend(noOfDigitsInMinuend, noOfDigitsInSubtrahend) {
  let minuend = getRandomNumber(noOfDigitsInMinuend);
  let subtrahend = getRandomNumber(noOfDigitsInSubtrahend);
  if (subtrahend > minuend) {
    let temp = minuend;
    minuend = subtrahend;
    subtrahend = temp;
  }
  return { minuend, subtrahend };
}

function validate(minuend, subtrahend, arrm, arrs, flag) {
  if (minuend < subtrahend) { return false };
  if (flag) {
    for (let index = 0; index < arrs.length; index++) {
      if (arrs[index] > arrm[index]) {
        return true;
      }
    }
    return false;
  }
  return true;
}


function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

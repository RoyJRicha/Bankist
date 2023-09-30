'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (movement, i) {
    const type = movement > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${movement} EUR</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce(function (acc, mov) {
    return acc + mov;
  }, 0);
  labelBalance.textContent = `${account.balance} EUR`;
};

const calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter(function (mov) {
      return mov > 0;
    })
    .reduce(function (acc, mov) {
      return acc + mov;
    }, 0);

  labelSumIn.textContent = `${incomes} EUR`;

  const deposits = account.movements
    .filter(function (mov) {
      return mov < 0;
    })
    .reduce(function (acc, mov) {
      return acc + mov;
    }, 0);

  labelSumOut.textContent = `${Math.abs(deposits)} EUR`;

  const interest = account.movements
    .filter(function (mov) {
      return mov > 0;
    })
    .map(function (deposit) {
      return (deposit * account.interestRate) / 100;
    })
    .filter(function (interest, i, arr) {
      // console.log(arr);
      return interest >= 1;
    })
    .reduce(function (acc, interest) {
      return acc + interest;
    }, 0);

  labelSumInterest.textContent = `${Math.abs(interest)} EUR`;
};

const createUsernames = function (accounts) {
  accounts.forEach(function (account) {
    account.username = account.owner
      .toLowerCase()
      .split(' ')
      .map(function (word) {
        return word[0];
      })
      .join('');
  });
};
createUsernames(accounts);
// console.log(accounts);

const updateUI = function (currentAccount) {
  // Display Movements
  displayMovements(currentAccount.movements);
  // Display balance
  calcDisplayBalance(currentAccount);
  // Display Summary
  calcDisplaySummary(currentAccount);
};

// Event handlers
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(function (acc) {
    return acc.username === inputLoginUsername.value;
  });
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and Welcome Message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginUsername.blur();
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(function (acc) {
    return acc.username === inputTransferTo.value;
  });

  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();
  inputTransferTo.blur();

  if (
    amount > 0 &&
    receiverAcc &&
    amount <= currentAccount.balance &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    // Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    currentAccount.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  const confirmUsername = inputCloseUsername.value;
  const confirmPin = Number(inputClosePin.value);

  if (
    currentAccount.username === confirmUsername &&
    currentAccount.pin === confirmPin
  ) {
    const index = accounts.findIndex(function (acc) {
      return acc.username === currentAccount.username;
    });
    console.log(index);

    accounts.splice(index, 1);

    // HIDE UI
    containerApp.style.opacity = 0;
  }

  inputClosePin.value = inputCloseUsername.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

/*
let arr = ['a', 'b', 'c', 'd', 'e'];

// Slice
console.log(arr.slice(2));
console.log(arr.slice(2, 4));
console.log(arr.slice(-2));
console.log(arr.slice(-1));
console.log(arr.slice(1, -2));
console.log(arr.slice());
console.log([...arr]);

// Splice - Mutates original array, takes part of the array and returns it effecting the original array
// console.log(arr.splice(2));
arr.splice(-1);
arr.splice(1, 2);
console.log(arr);

// Reverse - Mutates original array
arr = ['a', 'b', 'c', 'd', 'e'];

const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse());
console.log(arr2);

// Concat
const letters = arr.concat(arr2);
// One way with concat
console.log(letters);
// Another way with splicing
console.log([...arr, ...arr2]);

// Join - joins elements of an array together
console.log(letters.join(' - '));
*/

/*
const arr = [23, 11, 64];
console.log(arr[0]);
console.log(arr.at(0));

// Getting last element with traditional ways
console.log(arr[arr.length - 1]);
console.log(arr.slice(-1)[0]);
// Getting last element with 'at'
console.log(arr.at(-1));
console.log(arr[-1]);
console.log('jonas'.at(0));
console.log('jonas'.at(-1));
*/

/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const movement of movements) {
for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`Movement ${i + 1}: You deposited ${movement}`);
  } else {
    console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
  }
}

console.log('=====FOR EACH=====');
// Loops through passing in the value of each iteration of the array into the function that gets ran each iterationw
movements.forEach(function (movement, i, array) {
  if (movement > 0) {
    console.log(`Movement ${i + 1}: You deposited ${movement}`);
  } else {
    console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
  }
});

// Fundamental difference is that you cannot 'continue' or 'break' out of a .forEach method
// other than that it comes down to personal preference.
*/

/*
// Map
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function(value, key, map) {
  console.log(`${key}: ${value}`);
})

// Set
const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
console.log(currenciesUnique);
currenciesUnique.forEach(function(value, _, map) {
  console.log(`${value}: ${value}`);
})
*/

/*
// Challenge #1

const checkDogs = function(dogsJulia, dogsKate) {
  const dogsJuliaCorrected = dogsJulia.slice();
  dogsJuliaCorrected.splice(0, 1);
  dogsJuliaCorrected.splice(-2);
  // dogsJuilia.slice(1, 3);
  const dogs = dogsJuliaCorrected.concat(dogsKate);
  console.log(dogs);

  dogs.forEach(function(dog, i){
    if (dog >= 3){
      console.log(`Dog number ${i + 1} is an adult, and is ${dog} years old`);
    } else {
      console.log(`Dog number ${i + 1} is still a puppy`);
    }
  })
}
checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);
*/

/*
// MAP method
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const eurToUsd = 1.1;

const movementsUsd = movements.map(function(value) {
  return value * eurToUsd;
})

// const movementsUsd = movements.map(value => value * eurToUsd);

console.log(movements);
console.log(movementsUsd);

const movementsUsdFor = [];
for(const value of movements) {
  movementsUsdFor.push(value * eurToUsd);
}
console.log(movementsUsdFor);

const movementsDescriptions = movements.map(function (movement, i, array) {
  let statement;
  return `Movement ${i + 1}: You ${movement > 0 ? 'deposited' : 'withdrew'} ${Math.abs(movement)}`;
});

console.log(movementsDescriptions);

// movementsDescriptions.forEach(function(movement) {
//   console.log(movement);
// })
*/

/*
// FILTER method
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const deposits = movements.filter(function (mov) {
  return mov > 0;
});
console.log(movements);
console.log(deposits);

const withdrawals = movements.filter(function(mov) {
  return mov < 0;
})
console.log(withdrawals);
*/

/*
// REDUCE method
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// accumulator is like a snowball
const balance = movements.reduce(function (acc, curr, i, arr) {
  console.log(`Iteration ${i}: ${acc}`);
  return acc + curr;
}, 0);
console.log(balance);

let balance2 = 0;

for (const mov of movements) {
  balance2 += mov;
}
console.log(balance2);

// Maximum Value
const max = movements.reduce(function (acc, curr, i, arr) {
  if (acc > curr) {
    return acc;
  } else {
    return curr
  }
}, movements[0]);
console.log(max);
*/

/*
// Challenge #2
const calcAverageHumanAge = function(ages) {
  const humanAges = ages.map(function(age) {
    if (age <= 2) {
      return age * 2;
    } else {
      return 16 + age * 4;
    }
  })
  const adultDogs = humanAges.filter(function(age) {
    return age >= 18;
  })
  console.log(humanAges);
  console.log(adultDogs);

  const average = adultDogs.reduce(function(acc, age) {
    return acc + age;
  }, 0) / adultDogs.length;
  console.log(average);
}
calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
*/

/*
// Chaining methods
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const eurToUsd = 1.1;
console.log(movements);

// PIPELINE
const totalDepositsUSD = movements
  .filter(function (move) {
    return move > 0;
  })
  .map(function (move) {
    return move * eurToUsd;
  })
  // .map(function (move, i, arr) {
  //   console.log(arr);
  //   return move * eurToUsd;
  // })
  .reduce(function (acc, move) {
    return acc + move;
  }, 0);

console.log(totalDepositsUSD);
*/

/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
console.log(movements);
// Checks for equality
console.log(movements.includes(-130));

// Would like to know if any deposites (positive movement)
// Checks for a condition
const anyDeposits = movements.some(function (mov) {
  return mov > 1500;
});
console.log(anyDeposits);

// EVERY
console.log(account4.movements.every(mov => mov > 0));

// Separate callback
const deposit = move => move > 0;
console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));
*/

/*
const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat());

const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log(arrDeep.flat(2));

// One way
const overallBalance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance);

// flatMap (only goes one level deep)
const overallBalance2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance2);
*/

/*
// Sort - sorts by strings
// With Strings
const owners = ['Jonas', 'Zack', 'Adam', 'Martha'];
console.log(owners.sort());
console.log(owners);

// Numbers
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
console.log(movements);
// console.log(movements.sort());

// return < 0 then a before b (keep order)
// return > 0 then b before a (switch order)
// return 0 then positions unchanged
// ascending
movements.sort((a, b) => {
  // if(a > b){
  //   return 1;
  // }
  // if(b > a) {
  //   return -1;
  // }

  return a - b;
});
console.log(movements);

// descending
movements.sort((a, b) => {
  // if(a < b){
  //   return 1;
  // }
  // if(b < a) {
  //   return -1;
  // }
  return b - a;
});
console.log(movements);
*/

const arr = [1, 2, 3, 4, 5, 6, 7];
// More ways of creating and filling arrays
const x = new Array(7);
console.log(x);

// FILL method
x.fill(1, 3, 5);
x.fill(1);
console.log(x);

arr.fill(23, 2, 6);
console.log(arr);

// Array.from
const y = Array.from({ length: 7 }, function () {
  return 1;
});
console.log(y);

const z = Array.from({ length: 7 }, (_, i) => i + 1);
console.log(z);

const movementUI = Array.from(document.querySelectorAll('.movements__value'));
console.log(movementUI);

labelBalance.addEventListener('click', function () {
  const movementUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('EUR', ''))
  );
  console.log(movementUI);
});

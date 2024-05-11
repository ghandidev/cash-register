const purchaseForm = document.getElementById('purchase-form');
const inputCash = document.getElementById('cash');
const changeDue = document.getElementById('change-due');
const btnPurchase = document.getElementById('purchase-btn');
const screenPrice = document.querySelector(
  '.container > .border-screen > .screen'
);
const drawer = document.querySelector('.drawer > .open-drawer');
const cashInDrawer = document.querySelector('.container > .list-container');
const buttons = document.querySelectorAll('.n-btn');

let price = 1.87;
let cid = [
  ['PENNY', 1.01],
  ['NICKEL', 2.05],
  ['DIME', 3.1],
  ['QUARTER', 4.25],
  ['ONE', 90],
  ['FIVE', 55],
  ['TEN', 20],
  ['TWENTY', 60],
  ['ONE HUNDRED', 100],
];

screenPrice.textContent = `Total: $ ${price}`;

const showCid = () => {
  cashInDrawer.innerHTML = '';
  const p = document.createElement('p');
  p.textContent = 'Change in drawer:';
  cashInDrawer.appendChild(p);

  cid.forEach((item) => {
    const key = item[0];
    const value = item[1];

    const listItem = document.createElement('li');
    listItem.textContent = `${key}: $${value.toFixed(2)}`;
    cashInDrawer.appendChild(listItem);
  });
};
showCid();

const createListItem = (text) => {
  const listItem = document.createElement('li');
  listItem.innerText = text;
  return listItem;
};

const calculateChange = () => {
  let cash = parseFloat(inputCash.value);
  let change = cash - price;

  if (cash < price) {
    alert('Customer does not have enough money to purchase the item');
    changeDue.classList.add('hide');
  } else if (cash === price) {
    changeDue.innerText = 'No change due - customer paid with exact cash';
    drawer.classList.remove('open');
  } else {
    let changeArr = getChangeToGive(change, cid);
    let totalCashInDrawer = cid.reduce((acc, item) => acc + item[1], 0);

    if (totalCashInDrawer < change || changeArr.length === 0) {
      changeDue.innerText = 'Status: INSUFFICIENT_FUNDS';
      drawer.classList.add('close');
    } else {
      let changeDueText = 'Status: OPEN';
      drawer.classList.add('open');
      if (totalCashInDrawer === change) {
        changeDueText = 'Status: CLOSED';
      }
      drawer.classList.replace('close', 'open');
      changeDue.innerText = changeDueText;
      const changeMsg = document.createElement('ul');
      changeArr.forEach((arr) => {
        const listItem = document.createElement('li');
        listItem.innerText = `${arr[0]}: $${arr[1].toFixed(2)}`;
        changeMsg.appendChild(listItem);
      });
      changeDue.appendChild(changeMsg);

      cid.forEach((item) => {
        let currencyName = item[0];
        let currencyValue = item[1];
        changeArr.forEach((changeItem) => {
          if (changeItem[0] === currencyName) {
            item[1] -= changeItem[1];
          }
        });
      });
      showCid();
    }
  }
};

const getChangeToGive = (change, cid) => {
  let currencyUnit = {
    'ONE HUNDRED': 100.0,
    TWENTY: 20.0,
    TEN: 10.0,
    FIVE: 5.0,
    ONE: 1.0,
    QUARTER: 0.25,
    DIME: 0.1,
    NICKEL: 0.05,
    PENNY: 0.01,
  };

  let changeToGive = [];

  for (let i = cid.length - 1; i >= 0; i--) {
    let currencyName = cid[i][0];
    let currencyTotal = cid[i][1];
    let currencyValue = currencyUnit[currencyName];

    let currencyToGive = Math.min(
      currencyTotal,
      Math.floor(change / currencyValue) * currencyValue
    );
    if (currencyToGive > 0) {
      changeToGive.push([currencyName, currencyToGive]);
      change -= currencyToGive;
      change = change.toFixed(2);
    }
  }

  if (change > 0) {
    return [];
  }
  return changeToGive;
};

const handlePurchase = () => {
  if (inputCash.value.trim() === '') {
    return;
  }
  changeDue.classList.remove('hide');
  calculateChange();
  inputCash.value = '';
};

purchaseForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Evita que el formulario se envíe
  handlePurchase();
});

btnPurchase.addEventListener('click', () => {
  handlePurchase();
});

inputCash.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    handlePurchase();
  }
});

drawer.addEventListener('click', () => {
  changeDue.classList.add('hide');
  drawer.classList.replace('open', 'close');
});

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const value = button.textContent;
    inputCash.value += value;
  });
});

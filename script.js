const inputCash = document.getElementById('cash');
const changeDue = document.getElementById('change-due');
const btnPurchase = document.getElementById('purchase-btn');
const screenPrice = document.querySelector(
  '.container > .border-screen > .screen'
);
const drawer = document.querySelector('.drawer > .open-drawer');
const cashInDrawer = document.querySelector('.container > .list-container');

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

const insertCid = () => {
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
insertCid();

const calculateChange = () => {
  let cash = parseFloat(inputCash.value);
  let change = cash - price;

  if (cash < price) {
    alert('Customer does not have enough money to purchase the item');
  } else if (change === 0) {
    changeDue.innerText = 'No change due - customer paid with exact cash';
  } else {
    let changeArr = getChangeToGive(change, cid);

    if (changeArr.length === 0) {
      changeDue.innerText = 'Status: INSUFFICIENT_FUNDS';
    } else {
      let changeMsg = 'Status: OPEN ';
      changeArr.forEach((arr) => {
        changeMsg += `${arr[0]}: $${arr[1].toFixed(2)} `;
      });
      changeDue.innerText = changeMsg;

      // Actualizar valores en el array cid
      changeArr.forEach((changeItem) => {
        let currencyName = changeItem[0];
        let currencyValue = changeItem[1];
        cid.forEach((item) => {
          if (item[0] === currencyName) {
            item[1] -= currencyValue;
          }
        });
      });

      // Actualizar la visualización en el documento
      insertCid();
    }
  }
};

// Función para obtener el cambio a devolver al cliente
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

btnPurchase.addEventListener('click', () => {
  changeDue.classList.remove('hide');
  drawer.classList.add('open');
  drawer.classList.remove('close');
  calculateChange();
});

drawer.addEventListener('click', () => {
  changeDue.classList.add('hide');
  drawer.classList.replace('open', 'close');
  change = '';
});

/* // Función para obtener el total en el cajón
 let changeAvailable = getCidTotal(cid);

const getCidTotal = (cid) => {
  return cid.reduce((acc, curr) => acc + curr[1], 0);
}; */

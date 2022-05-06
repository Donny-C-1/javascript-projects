"use strict"
const f_currency = document.querySelector('#f_Currencies');
const to_currency = document.querySelector('#t_Currencies');
const from_input = document.querySelector('#fval');
const to_input = document.querySelector('#tval');

setup();

function retrieve(from, to, id, amount = 1, sid) {
  const patt1 = /[^\d|\.]/;
  const patt2 = /\.+/;

  if (from == to) {
    document.getElementById(id).value = amount;
    return;
  }
  if (amount == "" || patt1.test(amount)) {
    console.warn('Wrong figure found');
    return;
  }
  if (patt2.test(amount)) {
    amount = parseInt(amount) == 0? 1: parseInt(amount);
    document.getElementById(sid).value = amount;
  }
  fetch(`https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`)
    .then(resp => resp.json())
    .then(data => {
      document.getElementById(id).value = data.rates[to];
      console.log(`Success: ${data.rates[to]}`);
    })
}

function setEvent() {
  f_currency.oninput = function () {
    retrieve(to_currency.value, f_currency.value, 'fval', to_input.value, 'tval')
  }
  to_currency.oninput = function () {
    retrieve(f_currency.value, to_currency.value, 'tval', from_input.value, 'fval');
  }
  from_input.oninput = function() {
    retrieve(f_currency.value, to_currency.value, 'tval', from_input.value, 'fval');
  }
  to_input.oninput = function() {
    retrieve(to_currency.value, f_currency.value, 'fval', to_input.value, 'tval');
  }
}

function setup() {
  const host = 'api.frankfurter.app';
  fetch(`https://${host}/currencies`)
    .then(resp => resp.json())
    .then((data) => {
      const dFrag = document.createDocumentFragment();
      for (let x in data) {
        let opt = document.createElement('option');
        opt.value = x;
        opt.textContent = data[x];
        dFrag.appendChild(opt);
      }
      f_currency.appendChild(dFrag);
      to_currency.innerHTML = f_currency.innerHTML;
      setEvent();
    });
}
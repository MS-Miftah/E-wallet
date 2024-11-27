document.querySelector("#ewallet-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const type = document.querySelector(".add__type").value;
  const description = document.querySelector(".add__description").value;
  const value = document.querySelector(".add__value").value;

  if (description && value) {
    addItem(type, description, value);
    resetForm();
  } else {
    alert("Please fill up all your data!");
  }
  console.log(type, description, value);
});

//Add items to UI
const addItem = (type, description, value) => {
  let time = dateFormate();

  const html = `<div class="item">
      <div class="item-description-time">
        <div class="item-description">
          <p>${description}</p>
        </div>
        <div class="item-time">
          <p>${time}</p>
        </div>
      </div>
      <div class="item-amount ${
        type === "+" ? "income-amount" : "expense-amount"
      }">
        <p>${type}$${sep(value)}</p>
      </div>
    </div>`;

  document.querySelector(".collection").insertAdjacentHTML("afterbegin", html);

  setToLS(type, description, value, time);
};

// reset form after submit
const resetForm = () => {
  document.querySelector(".add__type").value = "+";
  document.querySelector(".add__description").value = "";
  document.querySelector(".add__value").value = "";
};

// show time in UI
const dateFormate = () => {
  const date = new Date().toLocaleTimeString("en-us", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  let newFormate = date.split(",")[0].split(" ");
  let day = newFormate[1];
  let month = newFormate[0];
  let time = date.split(",")[1];

  return `${day} ${month}, ${time}`;
};

// save data to Local Storage
const getToLS = () => {
  let items = localStorage.getItem("i");
  return items ? JSON.parse(items) : [];
};

const setToLS = (type, description, value, time) => {
  let lsValue = getToLS();
  let instantValue = { type, description, value, time };

  lsValue.push(instantValue);
  localStorage.setItem("i", JSON.stringify(lsValue));

  income();
  expense();
  balance();
};

const showFromLS = () => {
  const lsValue = getToLS();

  for (let value of lsValue) {
    const html = `<div class="item">
    <div class="item-description-time">
      <div class="item-description">
        <p>${value.description}</p>
      </div>
      <div class="item-time">
        <p>${value.time}</p>
      </div>
    </div>
    <div class="item-amount ${
      value.type === "+" ? "income-amount" : "expense-amount"
    }">
      <p>${value.type}$${sep(value.value)}</p>
    </div>
  </div>`;

    document
      .querySelector(".collection")
      .insertAdjacentHTML("afterbegin", html);
  }
};
showFromLS();

// show balance in UI
const income = () => {
  const lsValue = getToLS();
  let amount = lsValue
    .filter((item) => item.type === "+")
    .reduce((sum, inc) => sum + parseInt(inc.value), 0);
  document.querySelector(".income__amount p").innerText = `$${sep(amount)}`;
};
income();

const expense = () => {
  const lsValue = getToLS();
  let amount = lsValue
    .filter((item) => item.type === "-")
    .reduce((sum, inc) => sum + parseInt(inc.value), 0);
  document.querySelector(".expense__amount p").innerText = `$${sep(amount)}`;
};
expense();

const balance = () => {
  const lsValue = getToLS();
  let amount = lsValue.reduce((sum, inc) => {
    return inc.type === "+"
      ? sum + parseInt(inc.value)
      : sum - parseInt(inc.value);
  }, 0);
  document.querySelector(".balance__amount p").innerText = `$${sep(amount)}`;

  document.querySelector("header").className = amount >= 0 ? "green" : "red";
};
balance();

function sep(num) {
  num = parseInt(num);
  return num.toLocaleString();
}

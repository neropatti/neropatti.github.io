console.log("LMAO");

var order = [];
const items = ["kahvi", "pulla", "koira", "kissa", "sammakko", "sade", "--- CLEAR ---"];
const prices = {
    "kahvi": 1,
    "pulla": 2,
    "koira": 5,
    "kissa": 3,
    "sammakko": 8,
    "sade": 500,
    "--- CLEAR ---": 0.5,
};
const tallyandorder = document.getElementById("tallyandorder");

const buttons = document.getElementById("itembuttons");
let ii = 0;
for (const child of buttons.children) {
    console.log(child.tagName);
    child.addEventListener("click", click.bind(items[ii]));
    const paragraph = document.createElement("p");
    const text_node = document.createTextNode(items[ii]);
    paragraph.appendChild(text_node);
    child.append(paragraph);
    ii += 1;
}

function click(event) {
    event.preventDefault();
    //console.log(event.target, "was clicked!");
    let order_identifier = this;
    if (order_identifier == "--- CLEAR ---") {
        order = []
    } else {
        order.push(order_identifier);
    }
    //console.log("Current order:", order);
    let price = 0;
    let amounts = {};
    for (item of items) {
        amounts[item] = 0;
    }
    for (item of order) {
        price += prices[item];
        amounts[item] += 1;
    }
    let order_text = "";
    for (const [item, amount] of Object.entries(amounts)) {
        if (amount == 0) {
            continue;
        }
        order_text += item + " x" + amount + ", ";
    }
    tallyandorder.innerText = price + "€ " + order_text;
}

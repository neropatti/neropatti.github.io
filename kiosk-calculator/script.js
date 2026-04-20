console.log("LMAO");

const items = ["kahvi", "pulla", "koira", "kissa", "sammakko", "sade", "--- CLEAR ---"];
var order_amounts = {};
function clear_order() {
    for (const item of items) {
        order_amounts[item] = 0;
    }
}
clear_order();
const prices = {
    "kahvi": 1,
    "pulla": 2,
    "koira": 5,
    "kissa": 3,
    "sammakko": 8,
    "sade": 500,
    "--- CLEAR ---": 0.5,
};
var text_nodes = {};

const tallyandorder = document.getElementById("tallyandorder");

const buttons = document.getElementById("itembuttons");
let ii = 0;
for (const child of buttons.children) {
    console.log(child.tagName);
    child.addEventListener("click", click.bind(items[ii]));
    if (ii != 6) {
            const item = items[ii];
            const text_node = document.createTextNode("  - " + item + " (0) +  ");
            const text_node_2 = document.createTextNode("( 0€ )");
            child.appendChild(text_node);
            child.appendChild(document.createElement("br"));
            child.appendChild(text_node_2);
            child.appendChild(document.createElement("br"));
            child.appendChild(document.createTextNode(prices[item] + "€ per kpl"));
            text_nodes[items[ii]] = [text_node, text_node_2];
    }
    //child.append(paragraph);
    ii += 1;
}

function click(event) {
    event.preventDefault();
    //console.log(event.target, "was clicked!");
    let click_x_pos = event.offsetX / event.target.clientWidth;
    let order_identifier = this;
    if (order_identifier == "--- CLEAR ---") {
        clear_order()
    } else {
        if (click_x_pos >= 0.5) {
            order_amounts[order_identifier] += 1;
        } else {
            order_amounts[order_identifier] = Math.max(0, order_amounts[order_identifier] - 1);
        }
    }
    //console.log("Current order:", order_amounts);
    let price = 0;
    let order_text = "";
    for (const [item, amount] of Object.entries(order_amounts)) {
        if (item == "--- CLEAR ---") {
            continue;
        }
        var [text_node, text_node_2] = text_nodes[item];
        text_node.nodeValue = "  - " + item + " (" + amount + ") +  ";
        let item_price = prices[item] * amount
        text_node_2.nodeValue = "( " + item_price + "€ )"
        price += item_price;
        if (amount == 0) {
            continue;
        }
        order_text += item + " x" + amount + ", ";
    }
    tallyandorder.innerText = price + "€ " + order_text;
}

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
const emojis = {
    "kahvi": "☕️",
    "pulla": "🍰️",
    "koira": "🐶️",
    "kissa": "🐈️",
    "sammakko": "🐸️",
    "sade": "🌧️",
    "--- CLEAR ---": "❌️",
};
var text_nodes = {};

const tallyandorder = document.getElementById("tallyandorder");
const price_fixing_button = document.getElementById("pricefixingbutton");

price_fixing_button.addEventListener("click", priceadjust);

function priceadjust() {
    change_page.bind(2).call();
    console.log("TESTING TESTING");
    // TODO: Make the price changing page and switch to that when this button is clicked!!
}

const page1 = document.getElementById("page1");
const page2 = document.getElementById("page2");

const item_buttons = document.getElementById("itembuttons");
let ii = 0;
for (const child of item_buttons.children) {
    console.log(child.tagName);
    child.addEventListener("click", click_item.bind(items[ii]));
    if (ii != 6) {
            const item = items[ii];
            const text_node = document.createTextNode("  - " + item + " (0) +  ");
            const text_node_2 = document.createTextNode("( 0€ )");
            const text_node_3 = document.createTextNode("");
            child.appendChild(text_node_3);
            child.appendChild(document.createElement("br"));
            child.appendChild(text_node);
            child.appendChild(document.createElement("br"));
            child.appendChild(text_node_2);
            child.appendChild(document.createElement("br"));
            child.appendChild(document.createTextNode(prices[item] + "€ per kpl"));
            text_nodes[items[ii]] = [text_node, text_node_2, text_node_3];
    }
    //child.append(paragraph);
    ii += 1;
}

const vaihtoraha_buttons = document.getElementById("vaihtorahabuttons");

ii = 0;
for (const child of vaihtoraha_buttons.children) {
    child.appendChild(document.createTextNode(ii));
    child.appendChild(document.createElement("br"));
    child.appendChild(document.createTextNode(ii));
    ii += 1;
}

const page_change_buttons = [document.getElementById("tovaihtorahat"), document.getElementById("toitemshop")];

ii = 0;
for (const button of page_change_buttons) {
    let target_page = 1 - ii;
    button.addEventListener("click", change_page.bind(target_page));
    console.log("LMAO");
    ii += 1;
}

var current_page = 0;
change_page.bind(0).call();

function change_page() {
    current_page = this;
    console.log(current_page);
    var page1style = "none";
    var page2style = "none";
    var pricepagestyle = "none";
    if (current_page == 0) {
        page1style = "flex";
    }
    if (current_page == 1) {
        page2style = "flex";
    }
    if (current_page == 2) {
        pricepagestyle = "flex";
    }
    for (child of page1.children) {
        child.style.display = page1style;
    }
    for (child of page2.children) {
        child.style.display = page2style;
    }
}

function click_item(event) {
    document.getElementById("calculator").requestFullscreen();
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
        let [text_node, text_node_2, text_node_3] = text_nodes[item];
        text_node.nodeValue = "  - " + item + " (" + amount + ") +  ";
        let item_price = prices[item] * amount
        text_node_2.nodeValue = "( " + item_price + "€ )"
        price += item_price;
        text_node_3.nodeValue = emojis[item].repeat(amount);
        if (amount == 0) {
            continue;
        }
        order_text += item + " x" + amount + ", ";
    }
    tallyandorder.innerText = price + "€ " + order_text;
}

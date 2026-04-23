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

for (const item of items) {
    let saved_price = localStorage.getItem(item);
    if (saved_price != null) {
        prices[item] = saved_price;
    }
}

const emojis = {
    "kahvi": "☕️",
    "pulla": "🍰️",
    "koira": "🐶️",
    "kissa": "🐈️",
    "sammakko": "🐸️",
    "sade": "🌧️",
    "--- CLEAR ---": "❌️",
};
const number_inputs = {};
var text_nodes = {};

const tallyandorder = document.getElementById("tallyandorder");
const price_fixing_button = document.getElementById("pricefixingbutton");

price_fixing_button.addEventListener("click", priceadjust);

function priceadjust() {
    change_page.bind(2).call();
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
            const text_node_2 = document.createTextNode("( 0.00€ )");
            const text_node_3 = document.createTextNode("");
            const text_node_4 = document.createTextNode(prices[item] + "€ per kpl");
            child.appendChild(text_node_3);
            child.appendChild(document.createElement("br"));
            child.appendChild(text_node);
            child.appendChild(document.createElement("br"));
            child.appendChild(text_node_2);
            child.appendChild(document.createElement("br"));
            child.appendChild(text_node_4);
            text_nodes[items[ii]] = [text_node, text_node_2, text_node_3, text_node_4];
    }
    //child.append(paragraph);
    ii += 1;
}

const vaihtoraha_buttons = document.getElementById("vaihtorahabuttons");

ii = 0;
for (const child of vaihtoraha_buttons.children) {
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

const pricepage = document.getElementById("pricepage");

document.getElementById("exitpricechange").addEventListener("click", adjust_prices);

ii = 0;
for ([item, price] of Object.entries(prices)) {
    if (item == "--- CLEAR ---") {
        continue;
    }
    let number_input = document.createElement("input");
    number_inputs[item] = number_input;
    let this_input_id = "numberpriceinput" + String(ii);
    number_input.id = this_input_id;
    let label = document.createElement("label");
    let div = document.createElement("div");
    pricepage.appendChild(div);
    pricepage.appendChild(document.createElement("p"));
    pricepage.appendChild(document.createElement("p"));
    label.htmlFor = this_input_id;
    label.innerHTML = items[ii];
    number_input.type = "number";
    div.appendChild(label);
    div.appendChild(number_input);
    let button_count = 6;
    let p = ii / button_count;
    let totalbuttonareaheight = 90;
    let add_y = (100 - totalbuttonareaheight) / 2;
    div.style.height = String((totalbuttonareaheight * 0.9) / button_count) + "%";
    number_input.style.left = "20%";
    ii += 1;
}

console.log(number_inputs);

function prepare_for_price_adjusting() {
    for ([item, price] of Object.entries(prices)) {
        if (item == "--- CLEAR ---") {
            continue;
        }
        let number_input = number_inputs[item];
        number_input.value = price;
    }
}

function adjust_prices() {
    change_page.bind(0).call();
    for (item of items) {
        if (item == "--- CLEAR ---") {
            continue;
        }
        let number = parseFloat(number_inputs[item].value);
        if (isNaN(number)) {
            continue;
        }
        prices[item] = number;
        localStorage.setItem(item, number)
        // TODO: Update the text saying how much each item costs ("1€ per kpl" for example)
        // TODO: Store shit with cookies!! (and do vaihtorahat lmao)
    }
    update_tally();
}

var current_page = 0;
change_page.bind(0).call();

function change_page() {
    current_page = this;
    var page1style = "none";
    var page2style = "none";
    var pricepagestyle = "none";
    var tallystyle = "flex";
    if (current_page == 0) {
        page1style = "flex";
    }
    if (current_page == 1) {
        page2style = "flex";
    }
    if (current_page == 2) {
        pricepagestyle = "flex";
        tallystyle = "none";
        prepare_for_price_adjusting()
    }
    for (child of page1.children) {
        child.style.display = page1style;
    }
    for (child of page2.children) {
        child.style.display = page2style;
    }
    tallyandorder.style.display = tallystyle;
    pricepage.style.display = pricepagestyle;
}

function click_item(event) {
    // TODO: Similar function for vaihtorahat!!
    // TODO: Save orders that have happened so we can look at stats after the event :))
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
    update_tally();
}

function update_tally() {
    let price = 0;
    let order_text = "";
    for (const [item, amount] of Object.entries(order_amounts)) {
        if (item == "--- CLEAR ---") {
            continue;
        }
        let [text_node, text_node_2, text_node_3, text_node_4] = text_nodes[item];
        text_node.nodeValue = "  - " + item + " (" + amount + ") +  ";
        let item_price = prices[item] * amount
        text_node_2.nodeValue = "( " + item_price.toFixed(2) + "€ )"
        price += item_price;
        text_node_3.nodeValue = emojis[item].repeat(amount);
        text_node_4.nodeValue = prices[item] + "€ per kpl";
        if (amount == 0) {
            continue;
        }
        order_text += item + " x" + amount + ", ";
    }
    tallyandorder.innerText = price.toFixed(2) + "€ " + order_text;
}

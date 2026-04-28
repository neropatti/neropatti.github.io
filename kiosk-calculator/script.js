console.log("LMAO");

var current_order_id = Number(localStorage.getItem("next_order_id"));

if (current_order_id == null) {
    current_order_id = 0;
}

// TODO: Load all of the orders so far into a list so that we can inspect them!!
// Note down the total cost as well, the prices of shit could change ig
// Also we don't need to note down the current order ID, we can just load until we hit a null and then we know we have loaded everything there is to load

for (let i = 0; i < current_order_id; i++) {
    console.log(localStorage.getItem("order_" + String(i)));
}
console.log("Current order ID: " + String(current_order_id));

document.getElementById("downloadorderhistory").addEventListener("click", save_order_history);

function save_order_history() {
    let order_history = "aika,kahvi,tee,piirakka,pillimehu,mokkapala,tyhjä,10snt,20snt,50snt,1€,2€,5€,10€,20€,50€\n";
    for (let i = 0; i < current_order_id; i++) {
        order_history += localStorage.getItem("order_" + String(i)) + "\n";
    }
    download("tilaukset_" + String(Date.now()) + ".csv", order_history);
}

/*

*/

const items = ["kahvi", "tee", "piirakka", "pillimehu", "mokkapala", " ", "--- CLEAR ---"];
const moneys = ["10snt", "20snt", "50snt", "1€", "2€", "5€", "10€", "20€", "50€"];
var order_amounts = {};
function clear_order() {
    for (const item of items) {
        order_amounts[item] = 0;
    }
    for (const money of moneys) {
        order_amounts[money] = 0;
    }
}
clear_order();
const prices = {
    "kahvi": 2,
    "tee": 2,
    "piirakka": 2,
    "pillimehu": 1,
    "mokkapala": 3,
    " ": 0,
    "--- CLEAR ---": 0,
    "10snt": -0.1,
    "20snt": -0.2,
    "50snt": -0.5,
    "1€": -1,
    "2€": -2,
    "5€": -5,
    "10€": -10,
    "20€": -20,
    "50€": -50,
};

for (const item of items) {
    let saved_price = localStorage.getItem(item);
    if (saved_price != null) {
        prices[item] = saved_price;
    }
}

const emojis = {
    "kahvi": "☕️",
    "tee": "🍵",
    "piirakka": "🥟️",
    "pillimehu": "🍹️",
    "mokkapala": "🍰️",
    " ": " ",
    "--- CLEAR ---": "❌️",
    "10snt": "🪙",
    "20snt": "🪙",
    "50snt": "🪙",
    "1€": "🪙",
    "2€": "🪙",
    "5€": "🪙",
    "10€": "💶",
    "20€": "💶",
    "50€": "💶",
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
    let money = moneys[ii];
    let t1 = document.createTextNode("0");
    let t2 = document.createTextNode("");
    child.appendChild(t2);
    child.appendChild(document.createElement("br"));
    child.appendChild(document.createTextNode("- " + money + " +"));
    child.appendChild(document.createElement("br"));
    child.appendChild(t1);
    child.addEventListener("click", click_item.bind(money));
    text_nodes[money] = [t1, t2];
    ii += 1;
}

const confirm_order_button = document.getElementById("confirmorderbutton");

confirm_order_button.addEventListener("click", log_and_clear_order);

function log_and_clear_order() {
    let order_log_string = String(Date.now());
    for (const [item, amount] of Object.entries(order_amounts)) {
        if (item == "--- CLEAR ---") {
            continue;
        }
        // We log items that were not in the order, that's fine, makes it easier
        // to do spreadsheet shenanigans later!!
        order_log_string += "," + String(amount)
    }
    localStorage.setItem("order_" + String(current_order_id), order_log_string);
    current_order_id += 1;
    localStorage.setItem("next_order_id", String(current_order_id));
    clear_order();
    change_page.bind(0).call();
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
    if (item == "--- CLEAR ---" || moneys.includes(item)) {
        continue;
    }
    let number_input = document.createElement("input");
    number_inputs[item] = number_input;
    let this_input_id = "numberpriceinput" + String(ii);
    number_input.id = this_input_id;
    number_input.inputmode = "numeric";
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

//console.log(number_inputs);

function prepare_for_price_adjusting() {
    for ([item, price] of Object.entries(prices)) {
        if ((item == "--- CLEAR ---") || moneys.includes(item)) {
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
        for (money of moneys) {
            order_amounts[money] = 0;
        }
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
    update_tally()
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
    update_tally();
}

function update_tally() {
    let price = 0;
    let order_text = "";
    for (const [item, amount] of Object.entries(order_amounts)) {
        if (item == "--- CLEAR ---") {
            continue;
        }
        let item_price = prices[item] * amount
        if (items.includes(item)) {
            let [text_node, text_node_2, text_node_3, text_node_4] = text_nodes[item];
            text_node.nodeValue = "  - " + item + " (" + amount + ") +  ";
            text_node_2.nodeValue = "( " + item_price.toFixed(2) + "€ )";
            text_node_3.nodeValue = emojis[item].repeat(amount);
            text_node_4.nodeValue = prices[item] + "€ per kpl";
        } else if (moneys.includes(item)) {
            let [text_node_1, text_node_2] = text_nodes[item];
            text_node_1.nodeValue = String(amount);
            text_node_2.nodeValue = emojis[item].repeat(amount);
        }
        price += item_price;
        if (amount == 0) {
            continue;
        }
        if ((current_page == 0 && items.includes(item)) || (current_page == 1 && moneys.includes(item))) {
            order_text += item + " x" + amount + ", ";
        }
    }
    let used_text = Math.abs(price).toFixed(2) + "€ " + order_text;
    if (current_page == 1) {
        if (price.toFixed(2) == 0.00) {
            used_text = "TASARAHA!! Asiakas antoi " + order_text;
            // TODO: Display total amount of money that the customer gave us!!
        } else if (price < 0.0) {
            used_text = "VAIHTORAHA: " + Math.abs(price).toFixed(2) + "€. Asiakas antoi " + order_text;
            // TODO: Display the total amount given here as well!!
        } else {
            used_text = "Maksamatta " + used_text;
        }
    }
    tallyandorder.innerText = used_text;
}

// https://stackoverflow.com/questions/3665115/how-to-create-a-file-in-memory-for-user-to-download-but-not-through-server
function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

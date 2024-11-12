const firebaseConfig = {
    apiKey: "AIzaSyDOXFuUHxJskq1IVgICRmpSS_q23H9gdog",
    authDomain: "fbms-7faff.firebaseapp.com",
    databaseURL: "https://fbms-7faff-default-rtdb.firebaseio.com",
    projectId: "fbms-7faff",
    storageBucket: "fbms-7faff.appspot.com",
    messagingSenderId: "962563092455",
    appId: "1:962563092455:web:53ec857808cc6bd7251742",
    measurementId: "G-RCL51WR36Y"
  };
  //initialization
firebase.initializeApp(firebaseConfig);
//refrence for the database
var reservation_form = firebase.database().ref('reservation-form');
//event handling
document.getElementById("reservation-form").addEventListener("submit",SubmitForm);
//function callling
function SubmitForm(e){
    e.preventDefault();
    console.log("table reserved");
    alert("You have reserved your table successfully!!!!!!");
    var date = document.getElementById("date").value;
    var time = document.getElementById("time").value;
    var party_size = document.getElementById("party_size").value;
    var contactNumber= document.getElementById("contactNumber").value;
    console.log(date,time,party_size,contactNumber);
    savemessage(date,time,party_size,contactNumber);
    e.default();
}
function savemessage(date,time,party_size,contactNumber){
const reservationdb=reservation_form.push();
const now = new Date();
reservationdb.set({
    date : new Date().toISOString() ,
    time : `${now.getHours()}:${now.getMinutes()}` ,
    party_size: Number(party_size),
    contactNumber : Number(contactNumber)
});
console.log("connected to db and successfully booked your table");
}
//menu management
let orders = [];
let totalItems = 0;
let totalPrice = 0;

// Example function to add items to the order
function addToOrder(item, price) {
    orders.push({ name: item, price: price, quantity: 1 });
    updateOrderList();
}

// Function to update the order list dynamically
function updateOrderList() {
    const orderList = document.getElementById("order-list");
    const totalItemsSpan = document.getElementById("total-items");
    const totalPriceSpan = document.getElementById("total-price");

    // Reset list
    orderList.innerHTML = '';

    if (orders.length === 0) {
        orderList.innerHTML = '<p>No orders placed yet.</p>';
        totalItemsSpan.innerText = '0';
        totalPriceSpan.innerText = '0.00';
        return;
    }

    orders.forEach((order, index) => {
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <h4>${order.name}</h4>
            <div class="item-details">
                <div class="quantity-adjust">
                    <button onclick="decreaseQuantity(${index})">-</button>
                    <input type="text" value="${order.quantity}" readonly>
                    <button onclick="increaseQuantity(${index})">+</button>
                </div>
            </div>
            <button class="remove-btn" onclick="removeOrder(${index})">Remove</button>
        `;
        orderList.appendChild(orderItem);
    });

    totalItems = orders.reduce((acc, order) => acc + order.quantity, 0);
    totalPrice = orders.reduce((acc, order) => acc + (order.price * order.quantity), 0);

    totalItemsSpan.innerText = totalItems;
    totalPriceSpan.innerText = totalPrice.toFixed(2);
}

// Function to increase quantity
function increaseQuantity(index) {
    orders[index].quantity += 1;
    updateOrderList();
}

// Function to decrease quantity
function decreaseQuantity(index) {
    if (orders[index].quantity > 1) {
        orders[index].quantity -= 1;
        updateOrderList();
    }
}

function filterMenu() {
    const category = document.getElementById("category").value;
    const menuItems = document.querySelectorAll(".menu-item");

    menuItems.forEach(item => {
        const itemCategory = item.getAttribute("data-category");
        
        if (category === "all" || category === itemCategory) {
            item.style.display = "block"; // Show matching items
        } else {
            item.style.display = "none"; // Hide non-matching items
        }
    });
}

// Function to remove an order
function removeOrder(index) {
    orders.splice(index, 1);
    updateOrderList();
}

// Function to finalize the order and navigate to Billing
function finalizeOrder() {
    alert('Order finalized! Redirecting to billing...');
    displayOrderInBilling();

    // Navigate to the Billing section using scrollIntoView
    const billingSection = document.getElementById('billing');
    if (billingSection) {
        billingSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Function to display the order summary in the Billing section
function displayOrderInBilling() {
    const billSummary = document.getElementById('bill-summary');

    if (orders.length === 0) {
        billSummary.innerHTML = '<p>No orders placed yet.</p>';
        return;
    }

    // Generate a detailed order list
    const orderList = orders.map(order => {
        const subtotal = (order.price * order.quantity).toFixed(2);
        return `
            <li class="order-item">
                <span class="item-name">${order.name}</span>
                <span class="item-quantity">Quantity: ${order.quantity}</span>
                <span class="item-price">Price: $${order.price.toFixed(2)}</span>
                <span class="item-subtotal">Subtotal: $${subtotal}</span>
            </li>
        `;
    }).join('');

    const totalPrice = orders.reduce((acc, order) => acc + (order.price * order.quantity), 0).toFixed(2);

    // Display the order summary
    billSummary.innerHTML = `
        <h3>Your Order Summary</h3>
        <ul class="order-list">${orderList}</ul>
        <p class="total-price"><strong>Total: $${totalPrice}</strong></p>
    `;
}



//staff form database
// Reference for the staff database
var staff_form = firebase.database().ref('staffs');

// Event handling for "Add Staff" button click
function addStaff() {
    console.log("Adding staff member");

    // Get values from the form fields
    var staffName = document.getElementById("staff-name").value;
    var joiningDate = document.getElementById("joining-date").value;
    var jobRole = document.getElementById("job-role").value;

    // Create a new list item
    const staffList = document.getElementById('staff-list').querySelector('ul');
    const newStaff = document.createElement('li');
    newStaff.textContent = `${staffName} - Joined on: ${joiningDate}, Job: ${jobRole}`;

    // Add the new staff to the list
    staffList.appendChild(newStaff);

    // Call saveStaff function with the values
    saveStaff(staffName, joiningDate, jobRole);

    // Alert the user and clear the form
    alert("Staff member added successfully!");
    document.getElementById("staff-form").reset();
}

// Function to save the staff data to Firebase
function saveStaff(staffName, joiningDate, jobRole) {
    const staffdb = staff_form.push();
    staffdb.set({
        staffName: staffName,
        joiningDate: new Date(joiningDate).toISOString(),  // Store as ISO string
        jobRole: jobRole
    });
    console.log("Connected to db and successfully added staff member");
}


//for feedback form

// Reference for the feedback database
var feedback_form = firebase.database().ref('feedback');

// Event handling for feedback form submission
document.getElementById("feedback-form").addEventListener("submit", SubmitFeedback);

// Function to handle form submission
function SubmitFeedback(e) {
    e.preventDefault();
    console.log("Feedback submitted");

    // Retrieve values from the feedback form fields
    var name = document.getElementById("name").value;
    var feedback = document.getElementById("feedback").value;

    // Call saveFeedback function with the retrieved values
    saveFeedback(name, feedback);

    // Alert the user and reset the form
    alert(`Thank you, ${name}! Your feedback has been submitted.`);
    document.getElementById("feedback-form").reset();
}

// Function to save feedback data to Firebase
function saveFeedback(name, feedback) {
    const feedbackdb = feedback_form.push();
    feedbackdb.set({
        name: name,
        feedback: feedback,
        timestamp: new Date().toISOString()  // Store submission time as ISO string
    });
    console.log("Feedback saved to the database");
}


//for billing

// Reference for the database
var billing_db = firebase.database().ref('billing');

// Function to process payment and save billing details to Firebase
function processPayment() {
    // Get order items and total price
    const orderItems = document.querySelectorAll("#bill-summary .order-item");
    const orderData = [];
    let totalAmount = 0;

    // Loop through each item to gather order details
    orderItems.forEach((item) => {
        const itemName = item.querySelector(".item-name").textContent;
        let itemPriceText = item.querySelector(".item-price").textContent;

        // Check and clean up price text for different prefixes
        console.log(`Original price text for ${itemName}:`, itemPriceText);
        itemPriceText = itemPriceText
            .replace("Price: $", "")
            .replace("$", "")
            .replace("Price: Rs", "")
            .replace("Rs", "");

        // Parse the cleaned text to a float
        const itemPrice = parseFloat(itemPriceText.trim());

        // Validate the parsed price
        if (isNaN(itemPrice)) {
            console.error(`Invalid price for item: ${itemName}. Original price text: ${itemPriceText}`);
            alert(`Error: Invalid price for item "${itemName}". Please ensure all prices are numbers.`);
            return;
        }

        // Skip "Total" line item, if any
        if (itemName !== "Total") {
            orderData.push({ name: itemName, price: itemPrice });
            totalAmount += itemPrice;
        }
    });

    // Check if totalAmount is zero after parsing
    if (totalAmount === 0 && orderData.length > 0) {
        alert("Error processing payment: total amount is zero. Check item prices.");
        return;
    }

    // Store billing details in Firebase
    const billingEntry = billing_db.push();
    billingEntry.set({
        orderItems: orderData,
        totalAmount: totalAmount,
        timestamp: new Date().toISOString()  // Record payment time
    });
    console.log("Connected with database and updated");
    // Alert the user and reset the UI
    alert("Payment processed successfully!");
    clearBillingSummary();
}

// Helper function to clear the billing summary UI
function clearBillingSummary() {
    document.getElementById("bill-summary").innerHTML = `
        <p id="no-orders">No orders yet.</p>
    `;
}

// Reporting & Analytics
function generateReport() {
    const reportOutput = document.getElementById('report-output');
    if (!reportOutput) return; // Exit if not on report page

    reportOutput.innerHTML = ''; // Clear previous report content

    if (!orders || orders.length === 0) {
        reportOutput.innerHTML = `<p>No orders available.</p>`;
        return;
    }

    // Generate report for each order
    let reportContent = '<h2>Order Report</h2>';
    reportContent += '<ul>';

    // Calculate total and create order details
    let totalSales = 0;
    orders.forEach((order, index) => {
        totalSales += order.price * order.quantity;
        reportContent += `
            <li>
                <strong>Order #${index + 1}</strong><br>
                Product: ${order.name}<br>
                Quantity: ${order.quantity}<br>
                Price: $${order.price.toFixed(2)}<br>
                Subtotal: $${(order.price * order.quantity).toFixed(2)}
            </li>`;
    });

    reportContent += '</ul>';
    reportContent += `<p><strong>Total Sales:</strong> $${totalSales.toFixed(2)}</p>`;

    // Display the generated report
    reportOutput.innerHTML = reportContent;
    reportOutput.style.display = 'flex'; // Display the box
}

// Trigger report generation if on report page
window.addEventListener('load', () => {
    if (window.location.pathname.endsWith('report.html')) {
        generateReport();
    }
});

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const db = "https://grocery-wishlist-default-rtdb.firebaseio.com";

const appSettings = {
    databaseURL: db
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")
const cartCount = document.getElementById("cart-count");
const error = document.getElementById("error");


addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value
     
    if(inputValue === ""){
        error.textContent = "Please add an item!";
        return;
    }
    error.textContent = '';
    
    push(shoppingListInDB, inputValue)
    
    clearInputFieldEl()
})

function itemCount(items){
    let count = 0;
      count = items.length;
      
    if(count === 1){
        cartCount.textContent = `There is ${count} item in your cart`;
    } else if(count > 1){
        cartCount.textContent = `There are ${count} items in your cart`;
    }
}

onValue(shoppingListInDB, function(snapshot) {
     let count = 0;
     cartCount.textContent = `There are ${count} items in your cart`;
  
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
        
        itemCount(itemsArray);
       
        clearShoppingListEl()
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            
            appendItemToShoppingListEl(currentItem)
        }    
    } else {
        shoppingListEl.innerHTML = "No items here... yet"
    }
    
})

function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

function clearInputFieldEl() {
    inputFieldEl.value = ""
}

function appendItemToShoppingListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]
    
    let newEl = document.createElement("li")
    
    newEl.textContent = itemValue
    
    newEl.addEventListener("click", function() {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        
        remove(exactLocationOfItemInDB)
    })
    
    shoppingListEl.append(newEl)
}
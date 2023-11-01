import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

/* this line links the firebase database with the app */
const appSettings = {
    databaseURL: "insert-your-rtdb-link"
}

/* add the type attribute to the script import of the HTML file as 'module' */
/* initializeApp() is imported from the firebase-app.js file */
/* getDatabase() and  ref() and other functions are imported from firebase-database.js*/

const app = initializeApp(appSettings)
const database = getDatabase(app)
/* setting a reference point as 'ShoppingList' */
const shoppingListInDB = ref(database, "shoppingList")

const inputFieldElement = document.getElementById("input-field")
const addButtonElement = document.getElementById("add-button")
const shoppingListElement = document.getElementById("shopping-list")

/* action on clicking the `add to cart button` */
addButtonElement.addEventListener("click", function(){
    /* push the input field value to the database */
    let inputValue = inputFieldElement.value
    push(shoppingListInDB, inputValue)

    clearInputField()
})

/* here we are calling onValue() function
onValue() subscribes to a certain path in the realtime database 
to watch for changes*/
onValue(shoppingListInDB, (snapshot)=>{
    if(snapshot.exists()){
        let shoppingList = Object.entries(snapshot.val())
        clearShoppingList()
        for(let i=0; i<shoppingList.length; i++){
            let currentItem = shoppingList[i]
            let currentItemKey = currentItem[0]
            let currentItemValue = currentItem[1]
            appendItemToList(currentItem)
    }
    } else {
        shoppingListElement.innerHTML = `<div class="text-container"><p class="text">No items here... yet</p></div>`
    }
    
})

/* clearing out the typed out value from the input field after it's added to the database */
function clearInputField(){
    inputFieldElement.value = ''
}

/* clear the shopping list from the list element */
function clearShoppingList(){
    shoppingListElement.innerHTML = ''
}

/* adding the input from the input field to the unordered list */
function appendItemToList(item){
    // shoppingListElement.innerHTML += `<li>${inputVal}</li>`
    let itemID = item[0]
    let itemValue = item[1]
    let  newElement = document.createElement("li")
    newElement.textContent = itemValue
    newElement.addEventListener("dblclick", ()=>{
        let locationOfItemOnDB = ref(database, `shoppingList/${itemID}`)
        remove(locationOfItemOnDB)
    })
    shoppingListElement.append(newElement)
}

'use strict' 


 /* *******************************
  * CLIENT LIST EVENT LISTENER
  ****************************** */
 // Get a list of cart items in client's cart based on client account_id 
 let cartList = document.querySelector("#clientList")
 cartList.addEventListener("change", function () { 

  let account_id = cartList.value 
  let cartIdURL = "/cart/getCList/"+ account_id 

  fetch(cartIdURL) 
  .then(function (response) { 
   if (response.ok) { 
    return response.json(); 
   } 
   throw Error("Network response was not OK"); 
  }) 
  .then(function (data) { // data is the object returned by fetch. 
   buildClientList(data); 
  }) 
  .catch(function (error) { 
   console.error('There was a problem: ', error.message) 
  }) 
 })

 /* *******************************
  * BUILD CLIENT LIST
  * Build client list HTML 
  * table components and inject into DOM 
  ****************************** */
 // 
function buildClientList(cartListData) { 
 let cartDisplay = document.getElementById("inventoryDisplay");
 

  // Set up the table header column labels 
  let dataTable = '<thead>'; 
  dataTable += '<tr><th>Client Cart</th><td>&nbsp;</td></tr>'; 
  dataTable += '</thead>'; 
  // Set up the table body 
  dataTable += '<tbody>'; 
  // Iterate over all vehicles in the array and put each in a row 
  cartListData.forEach(function (element) { 
    dataTable += `<tr><td>${element.inv_make} ${element.inv_model}</td>`; 
    dataTable += `<td><form action="/cart/${element.cart_id}/${element.account_id}" method="post"<button title='Click to remove from cart'><button>Remove</button></form></td></tr>`; 
  }) 
  dataTable += '</tbody>'; 

 // Display the contents in the Cart Management view 
 cartDisplay.innerHTML = dataTable; 
}


  






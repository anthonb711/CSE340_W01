'use strict' 


 /* *******************************
  * CLASSIFICATION EVENT LISTENER
  ****************************** */
 // Get a list of items in inventory based on the classification_id 
 let classList = document.querySelector("#classificationList")
 classList.addEventListener("change", function () { 
  let classification_id = classList.value 
  let classIdURL = "/inv/getInventory/"+ classification_id 

  fetch(classIdURL) 
  .then(function (response) { 
   if (response.ok) { 
    return response.json(); 
   } 
   throw Error("Network response was not OK"); 
  }) 
  .then(function (data) { // data is the object returned by fetch. 

   buildInventoryList(data); 
  }) 
  .catch(function (error) { 
   console.error('There was a problem: ', error.message) 
  }) 
 })

 /* *******************************
  * BUILD INVENTORY LIST
  * Build inventory items into HTML 
  * table components and inject into DOM 
  ****************************** */
 // 
function buildInventoryList(invListData) { 
 let inventoryDisplay = document.getElementById("inventoryDisplay"); 
 // Set up the table header column labels 
 let dataTable = '<thead>'; 
 dataTable += '<tr><th>Vehicle Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>'; 
 dataTable += '</thead>'; 
 // Set up the table body 
 dataTable += '<tbody>'; 
 // Iterate over all vehicles in the array and put each in a row 
 invListData.forEach(function (element) { 
  dataTable += `<tr><td>${element.inv_make} ${element.inv_model}</td>`; 
  dataTable += `<td><button><a href='/inv/edit/${element.inv_id}' title='Click to update'>Modify</a></button></td>`; 
  dataTable += `<td><button><a href='/inv/delete/${element.inv_id}' title='Click to delete'>Delete</a></button></td></tr>`; 
 }) 
 dataTable += '</tbody>'; 
 // Display the contents in the Inventory Management view 
 inventoryDisplay.innerHTML = dataTable; 
}


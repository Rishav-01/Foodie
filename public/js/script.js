let addIngredientsBtn = document.getElementById("addIngredientsBtn");
let ingredientList = document.querySelector(".ingredientList");
let ingredientDiv = document.querySelectorAll(".ingredientDiv")[0];
// console.log(ingredientDiv);

addIngredientsBtn.addEventListener("click", function () {
  let newIngredients = ingredientDiv.cloneNode(true);
  let input = newIngredients.getElementsByTagName("input")[0];
  // console.log(input);
  input.value = "";
  ingredientList.appendChild(newIngredients);
});

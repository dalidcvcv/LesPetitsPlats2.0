class IndexView {
  constructor(
    ingredientsList,
    ustensilsList,
    appareilsList,
    recipes,
    categoryLists
  ) {
    this.ingredientsList = ingredientsList;
    this.ustensilsList = ustensilsList;
    this.appareilsList = appareilsList;
    this.categoryLists = categoryLists;
    this.recipes = recipes;
    this.dropdownMenu = new DropdownMenu();
    this.dropdownMenu.createMenus(
      ingredientsList,
      ustensilsList,
      appareilsList
    );
    this.addFilterEventListener();
    this.createRecipesCounter();
    this.recipesCounter(recipes);
    this.ValideConditionSearch();
    this.resultsSearchBar = [];
    this.searchText = "";
    this.filteredRecipes = [];
  }

  // Construit le code HTML pour afficher la recette
  generateRecipeCards(recipes) {
    const mainContainer = document.querySelector(".container-cards");
    let html = "";
    recipes.forEach((recipe) => {
      html += `
    <figure class="card-container" tabindex="0">
      <img src="assets/images/${recipe.image}" alt="${recipe.name}">
      <figcaption>
        <span>${recipe.time}min</span>
        <h2>${recipe.name}</h2>
        <h3>RECETTE</h3>
        <p>${recipe.description}</p>
        <h3>INGRÉDIENTS</h3>
        <ul class="ul-card-ingredients">`;

      // Récupération des ingrédients de la recette
      recipe.ingredients.forEach((ingredient) => {
        const name = ingredient.ingredient;
        const quantity = ingredient.quantity;
        const unit = ingredient.unit || "";

        html += `
    <li class="li-card-ingredients">
      <h4>${name}</h4>
      <p>${quantity ? `${quantity} ${unit}` : ""}</p>
    </li>`;
      });

      html += `</ul></figcaption>
    </figure>`;
    });

    mainContainer.innerHTML = html;
  }

  // Création d'un élément aside pour le compteur de recettes
  createRecipesCounter() {
    const recipesCounter = document.createElement("aside");
    recipesCounter.classList.add("recipesCounter");
    const searchSection = document.querySelector(".searchSection");
    searchSection.appendChild(recipesCounter);
  }

  // Met à jour le compteur de recettes dans l'interface
  recipesCounter(filteredRecipes) {
    const recipesCounter = document.querySelector(".recipesCounter");
    recipesCounter.textContent = `${filteredRecipes.length} recettes`;
  }

  // Ajout d'un écouteur d'événements pour les filtres
  addFilterEventListener() {
    document.addEventListener("tagFilterChange", () => {this.doFilter();});
    // Màj de this.categoryLists en fonction des détails de l'événement
    document.addEventListener("filterChange", (event) => {this.categoryLists = event.detail;this.doFilter();});
  }

  // Applique les filtres et affiche les résultats dans l'interface
  doFilter() {
    // Crée un nouveau tableau avec Spread Operator (pour ne pas modifier le tableau d'origine)
    let filteredRecipes = [...this.recipes];

    // Applique les filtres par ingrédients, ustensiles, et appareils
    filteredRecipes = this.filterByIngredient(filteredRecipes, this.dropdownMenu.categoryLists.Ingrédients);
    filteredRecipes = this.filterByUstensile(filteredRecipes, this.dropdownMenu.categoryLists.Ustensiles);
    filteredRecipes = this.filterByAppareil(filteredRecipes, this.dropdownMenu.categoryLists.Appareils);

    // Applique le filtre de recherche texte si la longueur du texte est supérieure ou égale à 3
    if (this.searchText.length >= 3) {
      filteredRecipes = this.filterBySearchText(filteredRecipes, this.searchText);
    }
    // Affiche la liste des recettes filtrées dans l'interface
    this.generateRecipeCards(filteredRecipes);
    // Met à jour le compteur de recettes filtrées dans l'interface
    this.recipesCounter(filteredRecipes);
    // Effectue la correspondance des items de recettes pour la barre de recherche
    this.matchingRecipesItems(filteredRecipes);

    return filteredRecipes; // Retourne le tableau des recettes filtrées
  }

  //return la liste des reettes filtrées par ingrédient
  filterByIngredient(filteredRecipesIngredients, listIngredient) {
    const filteredByIngredient = filteredRecipesIngredients.filter((recipe) => listIngredient.every((ingredient) => recipe.ingredients.some((item) => item.ingredient.toLowerCase() === ingredient.toLowerCase())));
    return filteredByIngredient;
  }

  // Methode qui retourne la liste des recettes filtrées par ustensile
  filterByUstensile(filteredRecipesUstensiles, listUstensile) {
    const filteredByUstensile = filteredRecipesUstensiles.filter((recipe) => listUstensile.every((ustensile) => recipe.ustensils.some((item) => item === ustensile.toLowerCase())));
    return filteredByUstensile;
  }

  // Methode qui retourne la liste des recettes filtrées par appareil
  filterByAppareil(filteredRecipesAppareils, listAppareil) {
    const filteredByAppareil = filteredRecipesAppareils.filter((recipe) => listAppareil.every((appareil) => recipe.appliance === appareil));
    return filteredByAppareil;
  }

  // Methode qui retourne la liste des recettes filtrées par titre
  searchByTitle(search, recipes) {
    const searchByTitle = recipes.filter((recipe) => recipe.name.toLowerCase().includes(search.toLowerCase()));
    return searchByTitle;
  }

  // Methode qui retourne la liste des recettes filtrées par description
  searchByDescription(search, recipes) {
    const searchByDescription = recipes.filter((recipe) => recipe.description.toLowerCase().includes(search.toLowerCase()));
    return searchByDescription;
  }

  // Methode qui retourne la liste des recettes filtrées par ingrédient
  searchByIngredient(search, recipes) {
    const searchByIngredient = recipes.filter((recipe) => recipe.ingredients.some((ingredient) => ingredient.ingredient.toLowerCase().includes(search.toLowerCase())));
    return searchByIngredient;
  }

  // Methode qui filtre les recettes par texte de recherche
  // filterBySearchText(filteredRecipes, searchText) {
  //   const filterBySearchText = filteredRecipes.filter((recipe) => [recipe.name, recipe.description, 
  //     recipe.ingredients.map((ingredient) => ingredient.ingredient.toLowerCase()),].some((text) => text.includes(searchText.toLowerCase())));
  //   return filterBySearchText;
  // }

  // Autre implémentation de la fonction filterBySearchText utilisant une boucle for
  filterBySearchText(filteredRecipes, searchText) {
    const filteredBySearchText = [];

    for (const recipe of filteredRecipes) {
      const { name, description, ingredients } = recipe;
      const recipeTexts = [name, description, ...ingredients.map(ingredient => ingredient.ingredient)];

      if (recipeTexts.some(text => text.toLowerCase().includes(searchText.toLowerCase()))) {
        filteredBySearchText.push(recipe);
      }
    }

    return filteredBySearchText;
  }

  // Initialise la condition de recherche et ajoute des gestionnaires d'événements
  ValideConditionSearch() {
    const inputSearch = document.querySelector("#inputSearch");
    inputSearch.value = "";

    // Gestion d'événement pour la saisie dans le champ de recherche
    inputSearch.addEventListener("input", () => {
      const search = inputSearch.value.trim();
      const deleteTextCross = document.getElementById("deleteTextCross");

      // Affiche ou masque l'icône de suppression en fonction de la longueur de la recherche
      if (search.length >= 1) {
        deleteTextCross.classList.remove("hidden");
      } else {
        deleteTextCross.classList.add("hidden");
      }

      // Gestionnaire d'événement pour la suppression du texte de recherche
      deleteTextCross.addEventListener("click", () => {
        inputSearch.value = "";
        deleteTextCross.classList.add("hidden");
        let filteredRecipes = [...this.recipes];
        this.generateRecipeCards(filteredRecipes);
        this.recipesCounter(filteredRecipes);
        this.matchingRecipesItems(filteredRecipes);
      });

      this.searchText = search;
      this.doFilter();
      let filteredRecipes = this.doFilter();

      // Affiche un message si aucune recette ne correspond à la recherche
      if (filteredRecipes.length === 0) {
        const recipesContainer = document.querySelector(".container-cards");
        recipesContainer.textContent = `Aucune recette ne contient '${this.searchText}' vous pouvez chercher «tarte aux pommes », « poisson », etc.`;
        recipesContainer.classList.add("msgRecipeNul");
      }
    });
  }

  // Affiche les items correspondants dans la barre de recherche en fonction des résultats
  matchingRecipesItems(resultsSearchBar) {
    const filteredIngredients = new Set();
    const filteredUstensils = new Set();
    const filteredAppliances = new Set();

    // Ajouter tous les ingrédients à l'ensemble
    resultsSearchBar.forEach((recipe) => recipe.ingredients.forEach((ingredient) => filteredIngredients.add(ingredient.ingredient.toLowerCase())));
    // Ajouter tous les ustensiles à l'ensemble
    resultsSearchBar.forEach((recipe) => recipe.ustensils.forEach((ustensil) => filteredUstensils.add(ustensil.toLowerCase())));
    // Ajouter l'appareil à l'ensemble
    resultsSearchBar.forEach((recipe) => filteredAppliances.add(recipe.appliance.toLowerCase()));
    
    // Affiche ou masque les éléments des filtres en fonctionnant des recettes trouvées
    const listeItems = document.querySelectorAll("#category li");
  
    listeItems.forEach((li) => {
      const liText = li.textContent.toLowerCase();
      const displayItemsLi = filteredIngredients.has(liText) || filteredUstensils.has(liText) || filteredAppliances.has(liText);
      li.style.display = displayItemsLi ? "block" : "none";
    });
  }
}

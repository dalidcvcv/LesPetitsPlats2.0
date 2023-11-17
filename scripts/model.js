class Model {
    // Methode qui retour la liste des recettes sous forme de tableau
    async getDataRecipes() {
      // Appel asynchrone à la méthode fetch pour récupérer les données du fichier JSON
      const recipeResponse = await fetch("data/recipes.json");
      // Attente de la résolution de la promesse JSON
      const data = await recipeResponse.json(); 
      // Retourne la liste des recettes depuis les données
      return data.recipes;}

    // Methode pour récupérer la liste des ingrédients
    async getIngredients() {     
      // Appel de la méthode getDataRecipes pour obtenir les données des recettes
      const recipesData = await this.getDataRecipes();
      const ingredientsList = []; // Initialisation d'une liste vide pour stocker les ingrédients

      // Parcourt chaque recette et chaque ingrédient pour les ajouter à la liste
      recipesData.forEach((recipe) => {recipe.ingredients.forEach((ingredient) => {ingredientsList.push(ingredient.ingredient);});});
      return { ingredientsList }; // Retourne un objet contenant la liste des ingrédients
    }

    // Methode pour récupérer la liste des ustensiles
    async getUstensils() {
      // Appel de la méthode getDataRecipes pour obtenir les données des recettes
      const recipesData = await this.getDataRecipes();
      const ustensilsList = []; // Initialisation d'une liste vide pour stocker les ustensiles
      
      // Parcourt chaque recette et chaque ustensile pour les ajouter à la liste
      recipesData.forEach((recipe) => {recipe.ustensils.forEach((ustensil) => {ustensilsList.push(ustensil);});});
      return { ustensilsList }; // Retourne un objet contenant la liste des ustensiles
    }

    // Methode pour récupérer la liste des appareils
    async getAppareils() {
      // Appel de la méthode getDataRecipes pour obtenir les données des recettes
      const recipesData = await this.getDataRecipes();
      const appareilsList = []; // Initialisation d'une liste vide pour stocker les appareils

      // Parcourt chaque recette pour ajouter l'appareil à la liste
      recipesData.forEach((recipe) => {appareilsList.push(recipe.appliance);});
      return { appareilsList }; // Retourne un objet contenant la liste des appareils
    }
   }
  
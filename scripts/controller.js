class Controller {
  async initPage() {
    // Création d'une instance de la classe Model
    let model = new Model();
    const recipes = await model.getDataRecipes(); // Récupération des données des recettes

    // Récupération de la liste des ingrédients depuis le modèle
    const ingredientsListData = await model.getIngredients();
    // Formatage de la liste d'ingrédients avec l'aide de la classe Utils
    let formattedIngredientList = Utils.formatList(ingredientsListData.ingredientsList, "ingredients");

    // Récupération de la liste des ustensiles depuis le modèle
    const ustensilsListData = await model.getUstensils();
    // Formatage de la liste d'ustensiles avec l'aide de la classe Utils
    let formattedUstensilList = Utils.formatList(ustensilsListData.ustensilsList, "ustensils");

    // Récupération de la liste des appareils depuis le modèle
    const appareilsListData = await model.getAppareils();
    // Formatage de la liste d'appareils avec l'aide de la classe Utils
    let formattedAppareilList = Utils.formatList(appareilsListData.appareilsList, "appareils");

    // Création d'une instance de la classe IndexView avec les listes formatées et les recettes
    let indexView = new IndexView(formattedIngredientList, formattedAppareilList, formattedUstensilList, recipes);
    
    // Affichage de la liste des recettes sur la page
    indexView.generateRecipeCards(recipes);
  }
}

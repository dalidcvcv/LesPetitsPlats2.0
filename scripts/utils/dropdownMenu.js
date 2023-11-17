class DropdownMenu {
  constructor() {
    this.searchArticle = document.querySelector(".searchArticle");
    this.ulListSelected = document.getElementById("items-selected");
    this.categoryLists = { Ingrédients: [], Appareils: [], Ustensiles: [] };
  }

  //Méthode de construction et affichage des menus
  buildHTML(listObjet, title) {
    // Création de la <div> pour le menu déroulant
    const divDropDown = document.createElement("div");
    divDropDown.classList.add("dropdownMenu");
    // Génèration d'un ID pour la <div>
    divDropDown.id = `${title.toLowerCase()}DropDown`;
    // Création de la structure HTML pour le menu déroulant
    divDropDown.innerHTML = `
      <h3 class="toggleBtn">${title}</h3>
      <input type="text" placeholder="rechercher" id="input-${title}" class="input-category-search">
      <span class="span-category-search"><i class="fa-solid fa-xmark hidden" id="deleteTextCross-${title}"></i><i class="fa-solid fa-magnifying-glass"></i></span>
      <div class="scrollable-container">
      <ul id="category"></ul>
      </div>
    `;
    // Génére les éléments de la liste
    const category = divDropDown.querySelector("#category");

    for (let item of listObjet) {
      let li = document.createElement("li");
      li.innerText = item;
      category.appendChild(li);
      // Ajout d'un écouteur d'événements pour ajouter et afficher les filtres
      li.addEventListener("click", (e) => {
        this.addFilterItems(e.target.innerText, title);
        this.displayFilterItems(e.target.innerText, title);
        li.removeEventListener("click", () => {});
      });
    }

    // Ajout de l'élément <div> complet dans la section de recherche
    this.searchArticle.appendChild(divDropDown);

    // Ajout un gestionnaire d'événements pour appeller la methode toggleList
    const toggleBtn = divDropDown.querySelector(".toggleBtn");
    toggleBtn.addEventListener("click", () => {
      this.toggleList(divDropDown);
    });
  }
  
  // Méthode pour ajouter des éléments filtrés à la liste
  addFilterItems(itemName, searchCategory) {
    // Liste correspondante à la catégorie
    const categoryList = this.categoryLists[searchCategory];

    // Vérifie si l'élément n'est pas déjà dans la liste
    if (categoryList.indexOf(itemName) === -1) {
      categoryList.push(itemName);
    }

    // Déclenche un événement personnalisé pour indiquer un changement de filtre
    let customEvent = new CustomEvent("tagFilterChange");
    document.dispatchEvent(customEvent);
  }

  // Méthode pour afficher les éléments filtrés dans une liste déroulante
  displayFilterItems(itemName, category) {
    if (!this.ulListSelected.querySelector(`li[data-item="${itemName}"]`)) {
      // Crée un nouvel élément HTML <li>
      const itemSelected = document.createElement("li");
      itemSelected.classList.add("item");
      itemSelected.textContent = itemName;
      itemSelected.setAttribute("data-item", itemName);
      itemSelected.setAttribute("data-category", category);

      // Crée un élément <i> pour l'icône de croix
      const icon = document.createElement("i");
      icon.classList.add("fa-solid", "fa-xmark");

      icon.addEventListener("click", () => {
        const categoryList = this.categoryLists[category];
        const index = categoryList.indexOf(itemName);
        this.ulListSelected.removeChild(itemSelected);
        categoryList.splice(index, 1);

        // Déclenche un événement personnalisé pour indiquer un changement de filtre
        const filterChangeEvent = new CustomEvent("filterChange", {
          detail: this.categoryLists,
        });
        document.dispatchEvent(filterChangeEvent);
      });

      // Ajout l'icône à l'élément <li>
      itemSelected.appendChild(icon);

      // Ajout le nouvel élément <li> à la liste <ul>
      this.ulListSelected.appendChild(itemSelected);
      return this.categoryLists;
    }
  }

  // Initialisation des fonctionnalités de recherche pour chaque catégorie
  initSearchItems(title, list) {
    this.inputValue = '';
    const inputElement = document.getElementById(`input-${title}`);

    // Ajout d'un écouteur d'événements pour la saisie utilisateur
    inputElement.addEventListener("input", (event) => {
      this.inputValue = event.target.value; 
      this.handleSearch(title, list, this.inputValue);

      // Affichage de la croix de suppression du texte lorsqu'il y a une saisie
      if (this.inputValue.length >= 1) {
        const deleteTextCrossElem = document.getElementById(
          `deleteTextCross-${title}`
        );
        deleteTextCrossElem.classList.remove("hidden");
      }
    });

    // Ajout d'un écouteur d'événements pour la suppression du texte
    const deleteTextCrossElem = document.getElementById(`deleteTextCross-${title}`);
    deleteTextCrossElem.addEventListener("click", () => {
      inputElement.value = "";
      this.inputValue = "";
      deleteTextCrossElem.classList.add("hidden");
      this.handleSearch(title, list, this.inputValue);
      
    });
  }
  
  //Filtrer et afficher/masquer les éléments d'une liste en fonction d'une recherche.
  handleSearch(list, title, inputValue) {
    //Filtrer les éléments de la liste en fonction de la recherche
    const filteredList = title.filter((item) =>
      item.toLowerCase().includes(inputValue.toLowerCase())
    );

    // Créer l'identifiant unique pour la liste de déroulement
    let divId = list.replace(/^input-/i, "").toLowerCase() + "DropDown";

    // Sélectionner tous les éléments <li> de la liste de déroulement
    let HTMLItems = document.querySelectorAll(`#${divId} li`);

    // Parcourir les éléments <li> et afficher/masquer en fonction des correspondances de recherche
    for (let li of HTMLItems) {
      const liText = li.textContent.toLowerCase();
      // Vérifier si l'élément doit être affiché
      const displayListItems = filteredList.some((filteredItem) =>
        liText.includes(filteredItem.toLowerCase())
      );
      // Afficher ou masquer l'élément en fonction de la recherche
      if (displayListItems) {
        li.style.display = "block";
      } else {
        li.style.display = "none";
      }
    }
  }

  // Méthode de création des menus pour les ingrédients et les ustensiles
  createMenus(ingredientsList, appareilsList, ustensilsList) {
    this.buildHTML(ingredientsList, "Ingrédients");
    this.initSearchItems("Ingrédients", ingredientsList);

    this.buildHTML(appareilsList, "Appareils");
    this.initSearchItems("Appareils", appareilsList);

    this.buildHTML(ustensilsList, "Ustensiles");
    this.initSearchItems("Ustensiles", ustensilsList);
  }

  //Methode d'ouverture et fermeture des menus
  toggleList(divDropDown) {
    const scrollableContainer = divDropDown.querySelector(".scrollable-container");
    const input = divDropDown.querySelector(".input-category-search");
    const span = divDropDown.querySelector(".span-category-search");
    const h3 = divDropDown.querySelector("h3");

    // Bascule la classe "open" pour les éléments ul, input et span
    scrollableContainer.classList.toggle("open");
    input.classList.toggle("open");
    span.classList.toggle("open");
    h3.classList.toggle("open");

    // Modification du border-radius de la <div>
    if (scrollableContainer.classList.contains("open")) {
      divDropDown.style.borderRadius = "11px 11px 0 0";
    } else {
      divDropDown.style.borderRadius = "11px";
    }
  }
}

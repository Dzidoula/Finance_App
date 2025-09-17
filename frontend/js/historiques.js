/*import { afficherListe,add_historique_funct,submitInfo,closeModal,getData ,getStats} from "./functions.js";

const gene_liste = [];

const response = await fetch('/data/historiques.json'); 
if (!response.ok) {
  throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
}
//let data = await response.json();
//console.log('Données JSON brutes ..........:', JSON.stringify(data, null, 2));

let donne = await getData();
let data = donne["result"];
console.log('Données JSON brutes ..........:', JSON.stringify(donne, null, 2));
getStats()
const section_affichage = document.querySelector(".affichage");


// document.addEventListener('DOMContentLoaded', afficherListe);
//afficherListe(data); 

const links = document.querySelectorAll('nav a');
links.forEach(link => {

  // Afficher la section correspondant au lien cliqué
  const sectionId = link.getAttribute('href');
  

  link.addEventListener('click', async (event) => {
    //event.preventDefault(); // Empêche le comportement par défaut du lien (scroll)
    if (sectionId === '#historiques') {
      console.log('Mise à jour des historiques');
      console.log("::::::::::::::::::::", sectionId);
      section_affichage.innerHTML = `<h2>HISTORIQUES</h2>`;
      const add_historique = document.createElement("button");
      add_historique.className = "btn-add";
      add_historique.innerHTML = '<i class="fas fa-plus"></i> Add';
      add_historique.addEventListener('click', ()=>{
        const div = document.createElement("div");
        div.id = "infoModal";
        div.className = "modal";

        const div_under = document.createElement("div");
        //div_under.id = "infoModal";
        div_under.className = "modal-content";
        div_under.innerHTML = `<h2> Remplis les infos suivantes</h2>`;
        const div_form = document.createElement('div');
        // Création du champ Type
        const typeGroup = document.createElement('div');
        typeGroup.className = 'form-group';
        const typeLabel = document.createElement('label');
        typeLabel.className = 'type';
        typeLabel.textContent = 'Type :';
        const typeSelect = document.createElement('select');
        typeSelect.id = 'type';
        typeSelect.name = 'choix';
        const typeDefaultOption = document.createElement('option');
        typeDefaultOption.value = '';
        typeDefaultOption.disabled = true;
        typeDefaultOption.selected = true;
        typeDefaultOption.textContent = 'Sélectionnez une option';
        typeSelect.appendChild(typeDefaultOption);
        ['revenu', 'depense'].forEach(type => {
          const option = document.createElement('option');
          option.value = type;
          option.textContent = type.charAt(0).toUpperCase() + type.slice(1);
          typeSelect.appendChild(option);
        });
        typeGroup.appendChild(typeLabel);
        typeGroup.appendChild(typeSelect);
        
        // Création du champ Description
        const descriptionGroup = document.createElement('div');
        descriptionGroup.className = 'form-group';
        const descriptionLabel = document.createElement('label');
        descriptionLabel.setAttribute('for', 'sous_categorie');
        descriptionLabel.textContent = 'Sous Catégorie :';
        const descriptionInput = document.createElement('input');
        descriptionInput.id = 'sous_categorie';
        descriptionGroup.appendChild(descriptionLabel);
        descriptionGroup.appendChild(descriptionInput);

        // Création du champ Montant
        const montantGroup = document.createElement('div');
        montantGroup.className = 'form-group';
        const montantLabel = document.createElement('label');
        montantLabel.setAttribute('for', 'montant');
        montantLabel.textContent = 'Montant :';
        const montantInput = document.createElement('input');
        montantInput.id = 'montant';
        montantInput.type = 'number';
        montantGroup.appendChild(montantLabel);
        montantGroup.appendChild(montantInput);

        // Ajout des éléments au conteneur div_form
        div_form.appendChild(typeGroup);
        div_form.appendChild(descriptionGroup);
        div_form.appendChild(montantGroup);
        
        const bouton_submit = document.createElement('button');
        bouton_submit.id = "submit-btn";
        bouton_submit.className = "submit-btn";
        bouton_submit.textContent = "Soumettre";
        bouton_submit.addEventListener('click', ()=>{
          submitInfo()
          
        });
        
        const bouton_cancel = document.createElement('button');
        bouton_cancel.id = "cancel-btn";
        bouton_cancel.className = "cancel-btn";
        bouton_cancel.textContent="Annuler";
        bouton_cancel.addEventListener('click', ()=>{closeModal()});


        div_form.appendChild(bouton_cancel);
        div_form.appendChild(bouton_submit);
        div_under.appendChild(div_form);
        div.appendChild(div_under);
        section_affichage.appendChild(div);
        add_historique_funct();
      });
      const filtreSelect = document.createElement('select');
      filtreSelect.id = 'filtre';
      filtreSelect.name = 'choix';
      const filtreDefaultOption = document.createElement('option');
      filtreDefaultOption.value = '';
      filtreDefaultOption.disabled = true;
      filtreDefaultOption.selected = true;
      filtreDefaultOption.textContent = 'Sélectionnez une option';
      filtreSelect.appendChild(filtreDefaultOption);
      ['all','revenu', 'depense'].forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type.charAt(0).toUpperCase() + type.slice(1);
        filtreSelect.appendChild(option);
      });
      // a
      filtreSelect.addEventListener('change', async ()=>{
        const type = document.getElementById('filtre').value;
        if (type){
          const payload = {
            "type":type
          };
          const datas = await getData(payload);
          data = datas["result"];
          link.click();
          document.getElementById('filtre').value = type;
          console.log("this ........ ", data);
        }
        
      })
      section_affichage.appendChild(filtreSelect);
      section_affichage.appendChild(add_historique);
      console.log('Données JSON brutes ..........:', JSON.stringify(data, null, 2));
      afficherListe(data); // Recharge la liste des historiques
      
    };
    if (sectionId === '#home') {
      console.log('Dashboard...');
      console.log("::::::::::::::::::::", sectionId);
      let stats = await getStats();
      console.log("STATS .......... ",stats);

      section_affichage.innerHTML = "";
      


      Object.entries(stats["result"]).forEach(([cle, valeur]) => {
        console.log(`${cle}: ${valeur}`);
        // Création du carré
        const square = document.createElement('div');
        square.id = 'square_' + cle;
        square.addEventListener('mouseover', () => {
          square.style.transform = 'translateY(-4px)';
        });
        square.addEventListener('mouseout', () => {
            square.style.transform = 'translateY(0)';
        });
        // Création de l'élément pour le montant
        const amount = document.createElement('span');
        amount.id = 'amount_' + cle;
        amount.textContent = valeur + "F";
        // Création de l'étiquette "actif"
        const actif = document.createElement('span');
        actif.id = cle;
        actif.textContent = cle;
        // Ajout des éléments au carré
        square.appendChild(amount);
        square.appendChild(actif);
        section_affichage.appendChild(square);
      });
      //section_affichage.appendChild(square);
      
      //afficherListe();//  Recharge la liste des historiques
    };

    if (sectionId === '#about') {
      console.log('A propos...');
      section_affichage.innerHTML = "";
      console.log("::::::::::::::::::::", sectionId);
      //afficherListe(); // Recharge la liste des historiques
    };
  });
});






















document.addEventListener('DOMContentLoaded', () => {
  // Charger la liste au démarrage
  // afficherListe();
  
  //const sections = {
  //  "#historiques":document.getElementById('historiques-liste'),
  //  "#home":document.getElementById('home'),
  //  "#about":document.getElementById('about'),
  //};
  // Écouter les clics sur les liens du menu
  
  const links = document.querySelectorAll('nav a');
  links.forEach(link => {

    // Afficher la section correspondant au lien cliqué
    const sectionId = link.getAttribute('href');
    console.log("::::::::::::::::::::    ", sectionId);

    link.addEventListener('click', (event) => {
      //event.preventDefault(); // Empêche le comportement par défaut du lien (scroll)
      if (sectionId === '#historiques') {
        console.log('Mise à jour des historiques...');
        section_affichage.innerHTML = "";
        afficherListe(data); // Recharge la liste des historiques
        
      };
      if (sectionId === '#home') {
        console.log('Dashboard...');
        section_affichage.innerHTML = "";
        //afficherListe(); // Recharge la liste des historiques
      };

      if (sectionId === '#about') {
        console.log('A propos...');
        section_affichage.innerHTML = "";
        //afficherListe(); // Recharge la liste des historiques
      };
    });
  });
});
*/


import { afficherListe, add_historique_funct, submitInfo, closeModal, getData, getStats, createFinancialChart, createModal } from "./functions.js";

const gene_liste = [];

const section_affichage = document.querySelector(".affichage");

// Fonction pour gérer la navigation et l'affichage des sections
async function handleNavigation(sectionId, other_params={}, filtreValue="all") {
  section_affichage.innerHTML = "";

  if (sectionId === '#historiques') {
    console.log('Mise à jour des historiques');
    let donne;
    if (other_params){
      donne = await getData(other_params);
    }else{
      donne = await getData();
      
    };
    let data = donne["result"];
    
    // Créer le conteneur principal pour les historiques
    const historiquesContainer = document.createElement('div');
    historiquesContainer.className = 'historiques-container';
    
    // En-tête avec titre et contrôles
    const header = document.createElement('div');
    header.className = 'historiques-header';
    header.innerHTML = '<h2>HISTORIQUES</h2>';
    
    // Conteneur pour les contrôles (filtre + bouton)
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'controls-container';
    
    // Filtre
    const filtreContainer = document.createElement('div');
    filtreContainer.className = 'filtre-container';
    
    const filtreIcon = document.createElement('i');
    filtreIcon.className = "fas fa-filter";
    
    const filtreSelect = document.createElement('select');
    filtreSelect.id = 'filtre';
    filtreSelect.name = 'choix';
    filtreSelect.className = 'filtre-select';
    
    const filtreDefaultOption = document.createElement('option');
    filtreDefaultOption.value = '';
    filtreDefaultOption.disabled = true;
    filtreDefaultOption.selected = true;
    filtreDefaultOption.textContent = 'Filtrer par type';
    filtreSelect.appendChild(filtreDefaultOption);
    
    ['all', 'revenu', 'depense'].forEach(type => {
      const option = document.createElement('option');
      option.value = type;
      option.textContent = type.charAt(0).toUpperCase() + type.slice(1);
      filtreSelect.appendChild(option);
    });
    
    if (filtreValue) {
      filtreSelect.value = filtreValue;
    }
    
    filtreSelect.addEventListener('change', async () => {
      const type = document.getElementById('filtre').value;
      if (type) {
        const payload = { "type": type };
        handleNavigation('#historiques', payload, type);
      }
    });
    
    filtreContainer.appendChild(filtreIcon);
    filtreContainer.appendChild(filtreSelect);
    
    // Bouton d'ajout
    const add_historique = document.createElement("button");
    add_historique.className = "btn-add";
    add_historique.innerHTML = '<i class="fas fa-plus"></i> Ajouter';
    add_historique.addEventListener('click', () => {
      const modal = createModal();
      section_affichage.appendChild(modal);
    });
    
    // Assembler les contrôles
    controlsContainer.appendChild(filtreContainer);
    controlsContainer.appendChild(add_historique);
    
    // Assembler l'en-tête
    header.appendChild(controlsContainer);
    
    // Conteneur pour la liste
    const listeContainer = document.createElement('div');
    listeContainer.className = 'liste-container';
    
    // Assembler le tout
    historiquesContainer.appendChild(header);
    historiquesContainer.appendChild(listeContainer);
    section_affichage.appendChild(historiquesContainer);
    
    // Afficher la liste dans le conteneur dédié
    afficherListe(data, listeContainer);
    //handleNavigation('#historiques');

  } else if (sectionId === '#home') {
    console.log('Dashboard...');
    let stats = await getStats();
    section_affichage.innerHTML = "";
    
    // Create dashboard container
    const dashboardContainer = document.createElement('div');
    dashboardContainer.style.width = '100%';
    dashboardContainer.style.display = 'flex';
    dashboardContainer.style.flexDirection = 'column';
    dashboardContainer.style.gap = '20px';
    
    // Create stats cards container
    const statsContainer = document.createElement('div');
    statsContainer.style.display = 'flex';
    statsContainer.style.flexWrap = 'wrap';
    statsContainer.style.gap = '20px';
    statsContainer.style.justifyContent = 'center';
    
    Object.entries(stats["result"]).forEach(([cle, valeur]) => {
      const square = document.createElement('div');
      square.id = 'square_' + cle;
      square.addEventListener('mouseover', () => {
        square.style.transform = 'translateY(-4px)';
      });
      square.addEventListener('mouseout', () => {
        square.style.transform = 'translateY(0)';
      });
      const amount = document.createElement('span');
      amount.id = 'amount_' + cle;
      amount.textContent = valeur + "F";
      const actif = document.createElement('span');
      actif.id = cle;
      actif.textContent = cle;
      square.appendChild(amount);
      square.appendChild(actif);
      statsContainer.appendChild(square);
    });
    
    // Create chart container
    const chartContainer = document.createElement('div');
    chartContainer.style.width = '100%';
    chartContainer.style.maxWidth = '800px';
    chartContainer.style.margin = '20px auto';
    chartContainer.style.backgroundColor = 'white';
    chartContainer.style.borderRadius = '16px';
    chartContainer.style.padding = '20px';
    chartContainer.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
    
    const chartTitle = document.createElement('h3');
    chartTitle.textContent = 'Analyse Financière';
    chartTitle.style.textAlign = 'center';
    chartTitle.style.marginBottom = '20px';
    chartTitle.style.color = '#333';
    
    const canvas = document.createElement('canvas');
    canvas.id = 'financialChart';
    canvas.style.maxHeight = '400px';
    
    chartContainer.appendChild(chartTitle);
    chartContainer.appendChild(canvas);
    
    dashboardContainer.appendChild(statsContainer);
    dashboardContainer.appendChild(chartContainer);
    section_affichage.appendChild(dashboardContainer);
    
    // Create the chart
    createFinancialChart(stats["result"]);

  } else if (sectionId === '#about') {
    console.log('A propos...');
    section_affichage.innerHTML = "";
    // Ajoute ici le contenu de la section "A propos" si besoin
  }
}

// Ajout d'un seul gestionnaire d'événement pour la navigation
document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('nav a');
  links.forEach(link => {
    link.addEventListener('click', async (event) => {
      event.preventDefault(); // Empêche le scroll ou le changement de page
      const sectionId = link.getAttribute('href');
      await handleNavigation(sectionId);
    });
  });

  // Affiche la section par défaut au chargement (par exemple, #historiques)
  handleNavigation('#historiques');
});

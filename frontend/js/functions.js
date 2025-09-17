function suppression_tache(index,liElement){
    console.log("index ... :",index)
    liElement.remove()
}

export function add_historique_funct(){
  const modal = document.getElementById('infoModal');
  if (modal) {
    modal.style.display = 'flex';
  } else {
    console.warn("Modal not found, cannot open");
  }
}

export function submitInfo(){
  console.log("submitInfo");
  
  // Get form values
  const type = document.getElementById("type").value;
  const sous_categorie = document.getElementById("sous_categorie").value;
  const montant = document.getElementById("montant").value;
  
  // Frontend validation
  if (!type) {
    alert("Veuillez sélectionner un type de transaction");
    return;
  }
  
  if (!sous_categorie.trim()) {
    alert("Veuillez saisir une sous-catégorie");
    return;
  }
  
  if (!montant || isNaN(montant) || parseFloat(montant) <= 0) {
    alert("Veuillez saisir un montant valide (nombre positif)");
    return;
  }
  
  const payload = {
    "status": 1,
    'type': type,
    'sous_categorie': sous_categorie.trim(),
    'montant': parseFloat(montant)
  }
  
  // Show loading state
  const submitBtn = document.getElementById("submit-btn");
  const originalText = submitBtn.textContent;
  submitBtn.textContent = "Envoi...";
  submitBtn.disabled = true;
  
  postData(payload).then(result => {
    // Reset form
    const typeSelect = document.getElementById("type");
    const sousCategorieInput = document.getElementById("sous_categorie");
    const montantInput = document.getElementById("montant");
    
    if (typeSelect) typeSelect.value = "";
    if (sousCategorieInput) sousCategorieInput.value = "";
    if (montantInput) montantInput.value = "";

    const filtreselect = document.getElementById("filtre");
    if (filtreselect) {
      filtreselect.value = "all";
      filtreselect.dispatchEvent(new Event('change', {bubbles:true}));
    }
    
    console.log("submitInfo", payload);
    
    // Fermer le modal
    closeModal();
  }).catch(error => {
    console.error("Error submitting data:", error);
    alert("Erreur lors de l'ajout de la transaction. Veuillez réessayer.");
  }).finally(() => {
    // Reset button state
    if (submitBtn) {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

export function closeModal(){
  console.log("closeModal");
  const modal = document.getElementById('infoModal');
  if (modal) {
    modal.style.display = 'none';
  } else {
    console.warn("Modal not found, removing from parent if exists");
    // Si le modal n'existe pas, on essaie de le supprimer du parent
    const section_affichage = document.querySelector(".affichage");
    if (section_affichage) {
      const existingModal = section_affichage.querySelector('#infoModal');
      if (existingModal) {
        existingModal.remove();
      }
    }
  }
}
export async function afficherListe(liste, container = null) {
  try {
    console.log('Début du chargement...');
    
    const section_affichage = container || document.querySelector(".affichage");
    
    

    const ul = document.createElement('ul');
    ul.id = 'historiques-liste';
    // Vider la liste existante
    ul.innerHTML = '';
    const copie_liste = liste;
    // Parcourir les transactions
    liste.forEach((item,index) => {
    if (item){   
      const li = document.createElement('li');
      li.className = 'transaction-card';
      li.dataset.index = index;

      // Créer la partie info (catégorie, sous-catégorie, date, icône)
      const infoDiv = document.createElement('div');
      infoDiv.className = 'transaction-info';

      const categorySpan = document.createElement('span');
      categorySpan.className = `category ${item.type === 'revenu' ? 'green' : 'red'}`;
      categorySpan.textContent = item.type;

      const subCategorySpan = document.createElement('span');
      subCategorySpan.className = 'subcategory';
      subCategorySpan.textContent = item.sous_categorie;

      const dateSpan = document.createElement('span');
      dateSpan.className = 'date';
      dateSpan.textContent = item.created_date;

      //const iconSpan = document.createElement('span');
      //iconSpan.className = 'icon';
      //iconSpan.textContent = item.icone;

      const corbeilleBouton = document.createElement('button');
      corbeilleBouton.className = 'supprimer';
      corbeilleBouton.innerHTML = '<i class="fas fa-trash"></i>';

      // Ajouter un event class="fas fa-trash"></i> 
      corbeilleBouton.addEventListener('click',()=>{
        const index_id = copie_liste[index]["id"];
        copie_liste.fill('',index,index+1);
        const liste = copie_liste.filter(x => 
          x !== ''
        );
        const del_payload = {
          "id":index_id
        };
        const result = deleteData(del_payload);
        console.log("Suppression .............  index_id  ...............", result)
        suppression_tache(index, li);
      });
      
      infoDiv.appendChild(categorySpan);
      infoDiv.appendChild(subCategorySpan);
      infoDiv.appendChild(dateSpan);
      //infoDiv.appendChild(iconSpan);

      // Créer la partie montant
      const amountSpan = document.createElement('span');
      amountSpan.className = `amount ${item.type === 'revenu' ? 'green' : 'red'}`;
      amountSpan.textContent = `${item.type === 'revenu' ? '+' : '-'}${Math.abs(item.montant)} F`;

      // Ajouter les éléments au <li>
      li.appendChild(infoDiv);
      li.appendChild(amountSpan);
      li.appendChild(corbeilleBouton);
      ul.appendChild(li);
      
      section_affichage.appendChild(ul);}
    });
    console.log('Liste ajoutée au DOM');
  } catch (error) {
    console.error('Erreur :', error);
  }
}






export async function getData(params={}) {
  try {
    const url = 'http://localhost:8002/historiques';
    const query_params = new URLSearchParams(params).toString();
    const ful_url = query_params ? `${url}?${query_params}` : url;
    const response = await fetch(ful_url, {
      method: 'GET', // Méthode HTTP
      headers: {
        'Content-Type': 'application/json',
        // Ajoutez des en-têtes si nécessaire, ex: Authorization
        // 'Authorization': 'Bearer votre_token'
      },
      
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json(); // Convertir la réponse en JSON
    console.log(".......***********.......  ",data); // Traiter les données
    return data;
  } catch (error) {
    console.error('Erreur lors de la requête GET:', error);
  }
}

export async function getStats() {
  try {
    const url = 'http://localhost:8002/stats';

    const response = await fetch(url, {
      method: 'GET', // Méthode HTTP
      headers: {
        'Content-Type': 'application/json',
        // Ajoutez des en-têtes si nécessaire, ex: Authorization
        // 'Authorization': 'Bearer votre_token'
      },
      
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json(); // Convertir la réponse en JSON
    console.log(".......*****STATS******.......  ",data); // Traiter les données
    return data;
  } catch (error) {
    console.error('Erreur lors de la requête GET:', error);
  }
}





export async function postData(data) {
  try {
    const response = await fetch('http://localhost:8002/add_historique', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer votre_token'
      },
      body: JSON.stringify(data) // Convertir les données en JSON
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || `Erreur HTTP: ${response.status}`);
    }

    console.log('Réponse POST:', result);
    return result;
  } catch (error) {
    console.error('Erreur lors de la requête POST:', error);
    throw error; // Re-throw to allow calling function to handle
  }
}


export async function deleteData(data) {
  try {
    //const newData = {
    //  name: 'John Doe',
    //  age: 30
    //};

    const response = await fetch('http://localhost:8002/delete_historique', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': 'Bearer votre_token'
      },
      body: JSON.stringify(data) // Convertir les données en JSON
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const result = await response.json();
    console.log('Réponse PUT:', result);
    return result;
  } catch (error) {
    console.error('Erreur lors de la requête PUT:', error);
  }
}

// Utility function to safely get element by ID
function safeGetElementById(id) {
  const element = document.getElementById(id);
  if (!element) {
    console.warn(`Element with ID '${id}' not found`);
  }
  return element;
}

// Utility function to create modal
export function createModal() {
  // Supprimer le modal existant s'il y en a un
  const existingModal = document.getElementById('infoModal');
  if (existingModal) {
    existingModal.remove();
  }
  
  const div = document.createElement("div");
  div.id = "infoModal";
  div.className = "modal";
  div.style.display = "flex"; // Afficher immédiatement

  const div_under = document.createElement("div");
  div_under.className = "modal-content";
  div_under.innerHTML = `<h2> Remplis les infos suivantes</h2>`;
  const div_form = document.createElement('div');

  // Champ Type
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
  typeDefaultOption.textContent = 'Sélectionnez un type';
  typeSelect.appendChild(typeDefaultOption);
  ['revenu', 'depense'].forEach(type => {
    const option = document.createElement('option');
    option.value = type;
    option.textContent = type.charAt(0).toUpperCase() + type.slice(1);
    typeSelect.appendChild(option);
  });
  typeGroup.appendChild(typeLabel);
  typeGroup.appendChild(typeSelect);

  // Champ Description
  const descriptionGroup = document.createElement('div');
  descriptionGroup.className = 'form-group';
  const descriptionLabel = document.createElement('label');
  descriptionLabel.setAttribute('for', 'sous_categorie');
  descriptionLabel.textContent = 'Sous Catégorie :';
  const descriptionInput = document.createElement('input');
  descriptionInput.id = 'sous_categorie';
  descriptionGroup.appendChild(descriptionLabel);
  descriptionGroup.appendChild(descriptionInput);

  // Champ Montant
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

  div_form.appendChild(typeGroup);
  div_form.appendChild(descriptionGroup);
  div_form.appendChild(montantGroup);

  const bouton_submit = document.createElement('button');
  bouton_submit.id = "submit-btn";
  bouton_submit.className = "submit-btn";
  bouton_submit.textContent = "Soumettre";
  bouton_submit.addEventListener('click', () => {
    submitInfo();
  });

  const bouton_cancel = document.createElement('button');
  bouton_cancel.id = "cancel-btn";
  bouton_cancel.className = "cancel-btn";
  bouton_cancel.textContent = "Annuler";
  bouton_cancel.addEventListener('click', () => { closeModal(); });

  div_form.appendChild(bouton_cancel);
  div_form.appendChild(bouton_submit);
  div_under.appendChild(div_form);
  div.appendChild(div_under);
  
  return div;
}

// Chart creation function
export function createFinancialChart(stats) {
  const ctx = document.getElementById('financialChart');
  if (!ctx) return;
  
  // Destroy existing chart if it exists
  if (window.financialChart) {
    window.financialChart.destroy();
  }
  
  window.financialChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Revenus', 'Dépenses'],
      datasets: [{
        data: [stats.revenu, stats.depense],
        backgroundColor: [
          '#4CAF50',
          '#f44336'
        ],
        borderColor: [
          '#45a049',
          '#d32f2f'
        ],
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            font: {
              size: 14
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const value = context.parsed;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return `${context.label}: ${value.toLocaleString()}F (${percentage}%)`;
            }
          }
        }
      }
    }
  });
}


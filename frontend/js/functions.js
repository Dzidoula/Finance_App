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
    const url = 'http://localhost:8000/historiques';
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

export async function getStats(params={}) {
  try {
    const url = 'http://localhost:8000/stats';
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
    console.log(".......*****STATS******.......  ",data); // Traiter les données
    return data;
  } catch (error) {
    console.error('Erreur lors de la requête GET:', error);
  }
}

export async function getStatsSousCtMontant(params={}) {
  try {
    const url = 'http://localhost:8000/stats_sous_categorie';
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
    console.log(".......*****STATS SS CT MT ******.......  ",data); // Traiter les données
    return data;
  } catch (error) {
    console.error('Erreur lors de la requête GET:', error);
  }
}





export async function postData(data) {
  try {
    const response = await fetch('http://localhost:8000/add_historique', {
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

    const response = await fetch('http://localhost:8000/delete_historique', {
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

export function filtreDate(filtreDateValue){
  const filtreContainerDate = document.createElement('div');
  filtreContainerDate.className = 'filtre-container-date';
  
  const filtreIconDate = document.createElement('i');
  filtreIconDate.className = "fas fa-filter";
  
  const filtreSelectDate = document.createElement('select');
  filtreSelectDate.id = 'filtre-date';
  filtreSelectDate.name = 'choix';
  filtreSelectDate.className = 'filtre-select-date';
  
  const filtreDefaultOptionDate = document.createElement('option');
  filtreDefaultOptionDate.value = '';
  filtreDefaultOptionDate.disabled = true;
  filtreDefaultOptionDate.selected = true;
  filtreDefaultOptionDate.textContent = 'Filtrer par date';
  filtreSelectDate.appendChild(filtreDefaultOptionDate);
  
  ['all','day', 'week', 'month','custom'].forEach(type => {
    const option = document.createElement('option');
    option.value = type;
    option.textContent = type.charAt(0).toUpperCase() + type.slice(1);
    filtreSelectDate.appendChild(option);
  });
  
  
  
  /*filtreSelectDate.addEventListener('change', async () => {
    const range = document.getElementById('filtre-date').value;
    const type = document.getElementById('filtre').value;
    let payload = {};
    if (type){
      payload = {"type": type };
    }
    if (range){
      payload["range"] = range;
    }
    handleNavigation('#historiques', payload, type, range);
  });*/
  
  filtreContainerDate.appendChild(filtreIconDate);
  //filtreContainerDate.appendChild(filtreSelectDate);

  return [filtreSelectDate,filtreContainerDate]
}
// Chart creation function
export function createFinancialChart(stats) {
  const ctx = document.getElementById('financialChart1');
  if (!ctx) return;
  
  // Destroy existing chart if it exists
  //if (window.financialChart) {
  //  window.financialChart.destroy();
  //}
  
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

export function createFinancialChart3(type,stats,id) {
  const ctx = document.getElementById(id);
  if (!ctx) return;
  
  // Destroy existing chart if it exists
  //if (window.financialChart) {
  //  window.financialChart.destroy();
  //}
  
  window.financialChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: Object.keys(stats),
        datasets: [{
            label: 'Pourcentage (%)',
            data: Object.values(stats),
            backgroundColor: ['#36A2EB', '#FF6384'],
            borderColor: ['#36A2EB', '#FF6384'],
            borderWidth: 1
        }]
    },
    options: {
        indexAxis: 'y', // Orientation horizontale
        responsive: true,
        plugins: {
            title: { display: true, text: 'Répartition des ' + type + 's (%)' }
        },
        scales: {
            x: { beginAtZero: true, max: 100 }
        }
    }
  });
}


export function createFinancialChart2(type, stats, id, options = {}) {
  const ctx = document.getElementById(id);
  console.warn("stats keys",Object.values(stats));
  if (!ctx) {
    console.error(`Canvas element with id "${id}" not found`);
    return null;
  }

  // Destruction propre du graphique existant Object.keys(stats)
  if (window.financialCharts && window.financialCharts[id]) {
    window.financialCharts[id].destroy();
  }
  
  // Initialisation du stockage des graphiques
  if (!window.financialCharts) {
    window.financialCharts = {};
  }

  // Configuration des couleurs professionnelles
  const colorPalette = options.colors || [
    '#4F46E5', // Indigo moderne
    '#06B6D4', // Cyan
    '#10B981', // Emerald
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#8B5CF6', // Violet
    '#EC4899', // Pink
    '#84CC16', // Lime
    '#F97316', // Orange
    '#6B7280'  // Gray
  ];

  // Génération des couleurs avec transparence
  const backgroundColors = Object.keys(stats).map((_, index) => {
    const color = colorPalette[index % colorPalette.length];
    return color + '20'; // 20 pour 12.5% d'opacité
  });
  
  const borderColors = Object.keys(stats).map((_, index) => {
    return colorPalette[index % colorPalette.length];
  });

  // Configuration du graphique
  const chartConfig = {
    type: options.chartType || 'bar',
    data: {
      labels: Object.keys(stats),
      datasets: [{
        label: options.dataLabel || `Pourcentage (%)`,
        data: Object.values(stats),
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
        // Effet de hover
        hoverBackgroundColor: borderColors.map(color => color + '40'),
        hoverBorderColor: borderColors,
        hoverBorderWidth: 3,
      }]
    },
    options: {
      indexAxis: 'y' ,
      responsive: true,
      maintainAspectRatio: false,
      
      // Configuration des animations
      animation: {
        duration: 1000,
        easing: 'easeInOutQuart'
      },
      
      // Interactions
      interaction: {
        intersect: false,
        mode: 'index'
      },
      
      // Plugins
      plugins: {
        title: {
          display: true,
          text: options.title || `Répartition des ${type}s (%)`,
          font: {
            size: 18,
            weight: 'bold',
            family: "'Inter', 'Segoe UI', sans-serif"
          },
          color: '#1F2937',
          padding: { bottom: 30 }
        },
        
        legend: {
          display: options.showLegend !== false,
          position: 'top',
          align: 'end',
          labels: {
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 20,
            font: {
              size: 12,
              family: "'Inter', 'Segoe UI', sans-serif"
            },
            color: '#4B5563'
          }
        },
        
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(17, 24, 39, 0.95)',
          titleColor: '#F9FAFB',
          bodyColor: '#F9FAFB',
          borderColor: '#374151',
          borderWidth: 1,
          cornerRadius: 8,
          padding: 12,
          font: {
            family: "'Inter', 'Segoe UI', sans-serif"
          },
          callbacks: {
            label: function(context) {
              const value = context.parsed[options.horizontal ? 'x' : 'y'];
              return ` ${context.dataset.label}: ${value.toFixed(1)}%`;
            }
          }
        }
      },
      
      // Configuration des axes
      scales: {
        x: {
          beginAtZero: true,
          max: options.maxValue || 100,
          grid: {
            color: '#F3F4F6',
            lineWidth: 1,
            drawBorder: false
          },
          ticks: {
            font: {
              size: 11,
              family: "'Inter', 'Segoe UI', sans-serif"
            },
            color: '#6B7280',
            callback: function(value) {
              return value + '%';
            }
          },
          title: {
            display: options.xAxisTitle !== false,
            text: options.xAxisTitle || 'Pourcentage (%)',
            font: {
              size: 12,
              weight: '600',
              family: "'Inter', 'Segoe UI', sans-serif"
            },
            color: '#374151'
          }
        },
        
        y: {
          grid: {
            color: options.horizontal ? '#F3F4F6' : 'transparent',
            lineWidth: 1,
            drawBorder: false
          },
          ticks: {
            font: {
              size: 11,
              family: "'Inter', 'Segoe UI', sans-serif"
            },
            color: '#6B7280',
            maxRotation: 0,
            callback: function(value, index) {
              const label = this.getLabelForValue(value);
              // Tronquer les labels trop longs
              return label.length > 20 ? label.substring(0, 20) + '...' : label;
            }
          },
          title: {
            display: options.yAxisTitle !== false && options.horizontal,
            text: options.yAxisTitle || 'Catégories',
            font: {
              size: 12,
              weight: '600',
              family: "'Inter', 'Segoe UI', sans-serif"
            },
            color: '#374151'
          }
        }
      },
      
      // Layout et espacement
      layout: {
        padding: {
          top: 10,
          right: 20,
          bottom: 10,
          left: 10
        }
      }
    }
  };

  // Ajustements spécifiques pour les graphiques horizontaux
  if (options.horizontal) {
    chartConfig.options.indexAxis = 'y';
    chartConfig.options.scales.x.title.text = options.xAxisTitle || 'Pourcentage (%)';
    chartConfig.options.scales.y.title.display = false;
  }

  try {
    // Création du graphique
    const chart = new Chart(ctx, chartConfig);
    
    // Stockage de la référence
    window.financialCharts[id] = chart;
    
    // Ajout d'une classe CSS pour le styling du container
    ctx.parentElement.classList.add('financial-chart-container');
    
    return chart;
    
  } catch (error) {
    console.error('Erreur lors de la création du graphique:', error);
    return null;
  }
}



// Pour l'afficher avec animation
/*export function showDatePicker() {
    const customDiv = document.getElementById('customDate');
    if (customDiv){
      customDiv.style.display = 'block';
      console.warn("Succes ...........",customDiv.style.display )
    }else{
      console.warn("Echec ...........")
    }
    
    //setTimeout(() => customDiv.classList.add('show'), 30);
}
*/

export function showDatePicker(customDiv) {
    // const customDiv = document.getElementById('customDate');
    if (customDiv) {
        customDiv.style.display = 'block';
        customDiv.style.visibility = 'visible';
        customDiv.style.opacity = '1';
    } else {
        console.warn("Echec ...........");
    }
}

export function hideDatePicker(customDiv) {
    if (customDiv) {
        customDiv.style.display = 'none';
        customDiv.style.visibility = 'hidden';
        customDiv.style.opacity = '0';
    }
}
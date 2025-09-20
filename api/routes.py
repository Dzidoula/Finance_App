from run import app
from endpoint.database_ressources import DatabaseCall

resource = DatabaseCall()

# Registering the AuthenticationResource with the Falcon app  stats_sous_categorie


app.add_route('/delete_historique', resource,suffix="delete_historique")
app.add_route('/historiques', resource,suffix="historiques")
app.add_route('/add_historique', resource,suffix="add_historique")
app.add_route('/stats', resource,suffix="stats")
app.add_route('/stats_sous_categorie', resource,suffix="stats_sous_categorie")

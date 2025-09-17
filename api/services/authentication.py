import falcon

import json

client_info = 'database/clients.json' 

def get_client(jobpayload):
    with open(client_info, 'r') as f:
        clients = json.load(f)

    for client in clients:
        if client['id'] == jobpayload['id']:
            return client
    return None

def authenticating_client(payload):
     # Assuming the file is named clients.json
    # Lire le fichier existant
    with open(client_info, 'r') as f:
        clients = json.load(f)

    clients.append(payload)

    # Réécrire le fichier avec la nouvelle donnée
    with open(client_info, 'w') as f:
        json.dump(clients, f, indent=4)



    

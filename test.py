import requests
import json

headers = {
    # 'Authorization': f'{self.config["CDN_SERVICE"]["KEY"]}',
    'Content-Type': 'application/json'
}


url = "https://hontogbo.rightcomtech.com/data_analysis-feedback_sentiment/analyze"

payload = {
    'text': "Je le prefere pas merci"
}

#url = f'{self.base_url}{self.base_conf["SENTIMENT_ANALYTICS"]["PATH"]}'

#payload = {
#	'lang': lang,
#	'text': text_content
#}

response = requests.request("POST", url, headers= headers, data=json.dumps(payload))
result = response.json()
print(result["sentiment"])
import pandas as pd
from joblib import Parallel, delayed
import requests

BASE = 'https://render-tron.appspot.com/screenshot/'

def download_certificate(cert_url, fname):
    response = requests.get(BASE + url, stream=True)
    if response.status_code == 200:
        with open(f'Certificates/{fname}.jpg', 'wb') as file:
            for chunk in response:
                file.write(chunk)


file = "https://raw.githubusercontent.com/jjnanthakumar/jjnanthakumar.github.io/master/portfolios.xlsx"
df = pd.read_excel(file, engine= 'openpyxl')
certification_urls = df[['CredentialURL','Title']]
for row in certification_urls.iterrows():
    url = row[1][0]
    title = row[1][1] 
    download_certificate(url, title)

# results = Parallel(n_jobs=2)(delayed(download_certificate)(i) for i in range(10))
# print(results)
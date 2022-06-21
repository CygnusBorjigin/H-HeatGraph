from turtle import st, ycor
from matplotlib.style import available
from tqdm import tqdm
import requests
import json

available_cor = [(a * 0.01, b * 0.01) for a in range(4098, 4733, 2) for b in range(-7372, -6695, 2)]
available_station = {}

for each_cor in tqdm(available_cor):
    response = requests.request("GET", f"https://api.weather.gov/points/{each_cor[0]},{each_cor[1]}")
    result = response.json()
    if response.status_code == 200:
        station_name = result["properties"]["gridId"]
        x_cor = result["properties"]["gridX"]
        y_cor = result["properties"]["gridY"]

        if station_name not in available_station.keys():
            available_station[station_name] = [(x_cor, y_cor)]
        else:
            if (x_cor, y_cor) not in available_station[station_name]:
                available_station[station_name].append((x_cor, y_cor))


with open('weather_station_new_england.json', 'w') as data_file:
    json.dump(available_station, data_file)
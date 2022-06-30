import requests
import json
from tqdm import tqdm
import csv
from statistics import mean

stations = []
with open("all_processed.csv", "r") as data_file:
    result = list(csv.reader(data_file))
    for each_entry in result[1:]:
        stations.extend([[(each_entry[0], each_entry[1], each_entry[2], ),(float(each_entry[3]), float(each_entry[4])), (float(each_entry[5]), float(each_entry[6])), (float(each_entry[7]), float(each_entry[8])), (float(each_entry[9]), float(each_entry[10])), (float(each_entry[11]), float(each_entry[12]))]])
    data_file.close()

stations_info = {}
for each_station in tqdm(stations[:10]):
    station_name = "-".join(each_station[0])
    # coordinate locations
    station_coordinates = each_station[1:5]
    station_x_center = mean([station_coordinates[1][0], station_coordinates[3][0]])
    station_y_center = mean([station_coordinates[0][1], station_coordinates[2][1]])
    station_center = (station_x_center, station_y_center)
    # state and city name
    respond = requests.request("GET", f"https://api.weather.gov/points/{station_y_center},{station_x_center}")
    if respond.status_code == 200:
        if "properties" in respond.json().keys():
            if "city" in respond.json()["properties"]["relativeLocation"]["properties"].keys() and "state" in respond.json()["properties"]["relativeLocation"]["properties"].keys():
                city = respond.json()["properties"]["relativeLocation"]["properties"]["city"]
                state = respond.json()["properties"]["relativeLocation"]["properties"]["state"]
                # write information
                stations_info[station_name] = {
                    "coordinates": station_coordinates,
                    "center": station_center,
                    "relative_location": {
                        "city": city,
                        "state": state
                    }
                }
            else:
                stations_info[station_name] = {
                "coordinates": station_coordinates,
                "center": station_center,
                "relative_location": {
                    "city": "city not found",
                    "state": "state not found"
                }
            }    
        else:
            stations_info[station_name] = {
            "coordinates": station_coordinates,
            "center": station_center,
            "relative_location": {
                "city": "properties not found",
                "state": "properties not found"
            }
        }    
    else:
        stations_info[station_name] = {
            "coordinates": station_coordinates,
            "center": station_center,
            "relative_location": {
                "city": "request_failed",
                "state": "request_failed"
            }
        }

with open('data.json', 'w') as f:
    json.dump(stations_info, f)
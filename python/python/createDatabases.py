import os.path
import json
from tkinter import image_names
from openpyxl import load_workbook
import pandas as pd

DEPARTMENT_ID = "1zyVRTbMPm3bXJf4f_K3UefsuNnBt9JU0qXnM3b1Jrlc"
DEPARTMENT_RANGE_NAME = "Departments"
PROFILE_RANGE_NAME="Profiles"
PROFILE__SLOT_RANGE_NAME = "ProfileSlots"
PROFILE_IMAGE_RANGE_NAME = "images"

PROFILE_ATTRIBUTES = 11
DEPARTMENT_ATTRIBUTES = 4
PROFILE_SLOT_ATTRIBUTES = 18
IMAGE_ATTRIBUTES = 7

def main():

    file_name = '/Users/frankfilippis/Library/CloudStorage/OneDrive-Personal/HG/HG_DATA.xlsx'

    departments = pd.read_excel(file_name, sheet_name=DEPARTMENT_RANGE_NAME)
    profiles = pd.read_excel(file_name, sheet_name=PROFILE_RANGE_NAME)
    images = pd.read_excel(file_name, sheet_name=PROFILE_IMAGE_RANGE_NAME)
    profile_slots = pd.read_excel(file_name, sheet_name=PROFILE__SLOT_RANGE_NAME) 

    convertDepartments(departments)
    convertProfilesSlots(profile_slots)
    convertProfiles(profiles)
    convertImages(images)

def convert_worksheet_to_json(df):
    # Read the Excel worksheet

    # Convert the DataFrame to JSON
    json_data = df.to_json(orient='records')

    return json_data

def convertDepartments(departments):
    with open('./json/departments.json', 'w') as f:
        f.write(convert_worksheet_to_json(departments))
        f.close()

    return
def convertProfilesSlots(profile_slots):
    with open('./json/profile_slots.json', 'w') as f:
        f.write(convert_worksheet_to_json(profile_slots))
        f.close()
    return

def convertProfiles(profiles):
    with open('./json/profiles.json', 'w') as f:
        f.write(convert_worksheet_to_json(profiles))
        f.close()
    return
   

def convertImages(images):
    with open('./json/images.json', 'w') as f:
        f.write(convert_worksheet_to_json(images))
        f.close()
    return
   

if __name__ == "__main__":
    main()
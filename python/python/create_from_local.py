import os.path
import json
from tkinter import image_names
from openpyxl import load_workbook
import pandas as pd

# The ID and range of a sample spreadsheet.
DEPARTMENT_ID = "1zyVRTbMPm3bXJf4f_K3UefsuNnBt9JU0qXnM3b1Jrlc"
DEPARTMENT_RANGE_NAME = "Departments"
PROFILE_RANGE_NAME = "ProfileSlots"
OUTLINES_RANGE_NAME = "Department Outlines"
PROFILE_IMAGE_RANGE_NAME = "images"

DEPARTMENT_ATTRIBUTES = 11
PROFILE_ATTRIBUTES = 18
OUTLINE_ATTRIBUTES = 2
IMAGE_ATTRIBUTES = 7

def main():

    file_name = '/Users/frankfilippis/Library/CloudStorage/OneDrive-Personal/HG/HG_DATA.xlsx'

    departments = pd.read_excel(file_name, sheet_name=DEPARTMENT_RANGE_NAME)
    profiles = pd.read_excel(file_name, sheet_name=PROFILE_RANGE_NAME)
    images = pd.read_excel(file_name, sheet_name=PROFILE_IMAGE_RANGE_NAME)
    printHead()
    convertDepartments(departments)
    convertProfiles(profiles)
    convertImages(images)

def printHead():
        with open('./database.ts', 'a') as f:
            f.write("// Created from Google Sheets\n")
            f.write("import { ProfileSlotsDB } from './Profile';\n")
            f.write("import { ProfileDB } from './Profile';\n")
            f.write("import { ProfileImageDB } from './Profile';\n")
            f.write("export  const DepartmentDatabase : ProfileDB[] = \n")
            f.write("\n")

def convertDepartments(departments):

    with open('./database.ts', 'a') as f:
        column_titles = departments.columns.values.tolist()
        fields=[]
        for field in column_titles:
            fields.append(field)



        f.write("[")

        for index,row in departments.iterrows():
            f.write("{\n")
            
           # rows = [w.replace("\\r\\n", "") for w in rows]
            i=0;
            for column in row:
  

                f.write(f"'{fields[i]}' : '{column}',\n")
                i+=1
                if (i > (DEPARTMENT_ATTRIBUTES-1)):
                    break;
            f.write("},\n")
        f.write("]\n")
        f.write("\n");

        f.close()

    return departments


def convertProfiles(profiles):

    with open('./database.ts', 'a') as f:

        column_titles = profiles.columns.values.tolist()
        fields=[]
        for field in column_titles:
            print(field)
            fields.append(field)

        f.write("export const ProfileDatabase: ProfileSlotsDB[] =")
        f.write("\n")
        f.write("[\n")

        for index,rows in profiles.iterrows():
            f.write("{\n")
            #rows = [w.replace("\\r\\n", "") for w in rows]
            # print(rows)
            i=0;
            for column in rows:
                print(fields[i])
                jsonString = f"'{fields[i]}' : '{column}',\n"
                f.write(f"'{fields[i]}' : '{column}',\n")
                i+=1
                if (i > PROFILE_ATTRIBUTES-1):
                    break;
            f.write("},\n")

        f.write("]\n"); 
        f.write("\n");

        f.close()

    return profiles

def convertImages(images):
    with open('./database.ts', 'a') as f:
 
        column_titles = images.columns.values.tolist()
        fields=[]
        for field in column_titles:
            fields.append(field)
            
        f.write("export const ProfileImageDatabase : ProfileImageDB[] = \n")
        f.write("\n")

        f.write("[")

        for index,rows in images.iterrows():
            f.write("{\n")
                    
            i=0;
            for column in rows:
                f.write(f"'{fields[i]}' : '{column}',\n")
                i+=1
                if (i > IMAGE_ATTRIBUTES-1):
                    break;
            f.write("},\n")
        f.write("]\n")
        f.write("\n");

        f.close()

    return images

if __name__ == "__main__":
    main()
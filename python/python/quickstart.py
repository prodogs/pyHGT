import os.path
import json

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# If modifying these scopes, delete the file token.json.
SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"]

# The ID and range of a sample spreadsheet.
DEPARTMENT_ID = "1zyVRTbMPm3bXJf4f_K3UefsuNnBt9JU0qXnM3b1Jrlc"
DEPARTMENT_RANGE_NAME = "Departments"
PROFILE_RANGE_NAME = "ProfileSlots"
OUTLINES_RANGE_NAME = "Department Outlines"
PROFILE_IMAGE_RANGE_NAME = "ProfileImages"

DEPARTMENT_ATTRIBUTES = 14
PROFILE_ATTRIBUTES = 18
OUTLINE_ATTRIBUTES = 2
IMAGE_ATTRIBUTES = 7

def main():

    creds = None

    if os.path.exists("token.json"):
        print("Loading Credentials From File...")
        creds = Credentials.from_authorized_user_file("token.json", SCOPES)
        print(creds)

    if not creds or not creds.valid:
        print("Requesting New Tokens...")
        if creds and creds.expired and creds.refresh_token:
            print("Refreshing Access Token...")
            creds.refresh(Request())
    else:
        print("Fetching New Tokens...")
        flow = InstalledAppFlow.from_client_secrets_file("credentials.json", SCOPES)
        creds = flow.run_local_server(port=0)
    
    with open("token.json", "w") as token:
        token.write(creds.to_json())

    try:
        service = build("sheets", "v4", credentials=creds)

        sheet = service.spreadsheets()
        result = (
            sheet.values()
            .get(spreadsheetId=DEPARTMENT_ID,range=DEPARTMENT_RANGE_NAME)
            .execute()
        )
        departments = result.get("values", [])

        if not departments:
            print("No Departments data found.")
            return

    except HttpError as err:
        print(err)

    try:
        service = build("sheets", "v4", credentials=creds)

        result = (
            sheet.values()
            .get(spreadsheetId=DEPARTMENT_ID,range=PROFILE_RANGE_NAME)
            .execute()
        )
        profiles = result.get("values", [])

        if not profiles:
            print("No Profile data found.")
            return

    except HttpError as err:
        print(err)

    try:
        service = build("sheets", "v4", credentials=creds)

        result = (
            sheet.values()
            .get(spreadsheetId=DEPARTMENT_ID,range=PROFILE_IMAGE_RANGE_NAME)
            .execute()
        )
        images = result.get("values", [])

        if not profiles:
            print("No Profile data found.")
            return

    except HttpError as err:
        print(err)

    convertDepartments(departments)
    convertProfiles(profiles)
    convertImages(images)


def convertDepartments(departments):
    with open('./database.ts', 'a') as f:

        fields=[]
        for field in departments[0]:
            fields.append(field)

        f.write("// Created from Google Sheets\n")
        f.write("import { ProfileSlotsDB } from './Profile';\n")
        f.write("import { ProfileDB } from './Profile';\n")
        f.write("import { ProfileImageDB } from './Profile';\n")
        f.write("export  const DepartmentDatabase : ProfileDB[] = \n")
        f.write("\n")

        f.write("[")

        for rows in departments[1:]:
            f.write("{\n")
            
            rows = [w.replace("\\r\\n", "") for w in rows]
            
            for i in range(0,DEPARTMENT_ATTRIBUTES):
                f.write(f"'{fields[i]}' : '{rows[i]}',\n")
            f.write("},\n")
        f.write("]\n")
        f.write("\n");

        f.close()

    return departments


def convertProfiles(profiles):
    with open('./database.ts', 'a') as f:
 
        fields=[]
        for field in profiles[0]:
            fields.append(field)

        f.write("export const ProfileDatabase: ProfileSlotsDB[] =")
        f.write("\n")
        f.write("[\n")

        for rows in profiles[1:]:
            f.write("{\n")
            rows = [w.replace("\\r\\n", "") for w in rows]
            # print(rows)
            for i in range(0,PROFILE_ATTRIBUTES-1):
                f.write(f"'{fields[i]}' : '{rows[i]}',\n")
            f.write("},\n")

        f.write("]\n"); 
        f.write("\n");

        f.close()

    return profiles

def convertImages(images):
    with open('./database.ts', 'a') as f:
 
        fields=[]
        for field in images[0]:
            fields.append(field)
            
        f.write("export const ProfileImageDatabase : ProfileImageDB[] = \n")
        f.write("\n")

        f.write("[")

        for rows in images[1:]:
            f.write("{\n")
            
            rows = [w.replace("\\r\\n", "") for w in rows]
        
            for i in range(0,IMAGE_ATTRIBUTES):
                f.write(f"'{fields[i]}' : '{rows[i]}',\n")
            f.write("},\n")
        f.write("]\n")
        f.write("\n");

        f.close()

    return images

if __name__ == "__main__":
    main()
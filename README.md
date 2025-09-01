# Guild Raid Roster / Item Level Check

---

**To Do**



---

## Update Log

---

**Sep 01 2025 v2** (Update)
- Notice Updated
    - Database schema edited
    - Similar logic with Video & Log
    - Add, Edit, Delete, Switch (Show hidden post(s)) only show when logged in
    - Show all posts (including hidden)
        - Show posts view flag false
    - Delete: Remove from database
    - View flag
        - True: Visible for everyone
        - False: Visible for officer when switch on
    - Important / New Flag
        - Put marker on top left
    - Supports linebreaking for Note
    - Collapsed by default, multiple indicator to show user it's expandable
    - Created date / Updated date
    - Updated date show if it's different with Created date

- Manage Video & Log, Video & Log
    - Supports linebreaking for Description

- Add Raider
    - Changed to Modal window instead of expand collapse
    - No auto refresh, just added instantly
    - Visibility increased
    - API slightly changed for better process
    - Server default value Tichondrius, since most of guild members are belong to this server

---

**Sep 01 2025 v1** (Update)
- Manage Video & Log Created (Officer Only)
    - Add, Edit, Delete, Search, Pagination
    - Add, Edit using Modal
- Video & Log Created (No login required)
    - Same with Manage Video & Log, without Add, Edit, Delete
- OfficerNote page removed

---

**Aug 31 2025 v1** 
(Update)
- Refresh All Item Level button updated
    - This button now saves item levels to the database as well
    - (Before, clicking individual cards only saves item levels to the database)
    - This function only saves to database once a day.
    - This makes track item level history easy
- Dark Mode added
    - Manage Raid Roster page visibility increased in both dark, light mode
    - Add Raider / Login form visibility increased in both dark, light mode

(Bug Fix)
- Manage Raid Roster
    - Clicking multiple cards in short time period caused infinite loop on right panel
    - Fixed by adding flag

---

**Aug 29 2025 v2** (Update)
- Datebase resetted, refilled.
- Datebase Schema updated for Log, Youtube link
- Placeholders for new pages added
    - Officer Only
        - OfficerNote: Notice for officers
        - RaidLog: Link for RaidLog(WCL), RaidRecording(YouTube)
        - Update Log
            - Copy of readme.md
    - Common
        - RaidNotice: Notice for common users
- Raid Summary
    - Role Icons updated
    - Visibility updated

---

**Aug 29 2025 v1** (Update)
- DPS now splitted into MELEE DPS, RANGE DPS.
    - Database updated accordingly
    - Summary Page / Add Raider / Edit Raider Updated accordingly

---

**Aug 28 2025 v2** (Stage 2 - Auth / Bug Fix)
- Some code clean up
- Add Raider
    - After a successful add, refresh the page to update the list
    - Add Raider fixed
- Login Implemented
    - Add, Delete, Edit buttons enabled
    - Nav bar has a login button
    - Manage the Roster page now only for logged in officers
    - Manager only menu added, can only be seen by logged in officer

---

**Aug 28 2025 v1** (Stage 1 Final)
- Bug Fix
    - Item level was not updated until each card is clicked. 
    - Added manual fetch button on both summary and manage page.
    - Feedback(snackbar) message added to let user knows data may need update
- Visibility Improved
    - Add Raider toggle button has arrow to show user it's expandable menu.
    - Nav bar hover color change added
- Some codes cleaned up for better visibility.
- Loading circle added to roster summary page

---

**Aug 27 2025 v2** (Stage 1 Final)
- Fixed Local Host urls
- Delete Raider button will stay disabled until security implementation. 
- Edit Raider button will stay disabled until security implementation. 
- Click logo in nav will redirect to home
- Unnecessary codes removed
- Comment regarding disabled buttons added
- Stage 1 Done ( Basic Roster Add / Edit / View)

---

**Aug 27 2025 v1**
- Home
    - Show all raiders in one screen sort by role (Summary)
- Class Icons are added to all pages
    - API updated to show class icons
- Entire site's visibility imporved
- Code comments added / updated
- Add New Raider button will stay disabled until security implementation. 
- Unnecessary files removed
- Import for all files arranged

---

**Aug 25 2025 v1**
- Fix
    - Add Raider success feedback message correctly show
    - Roster now show in alphabetical order (order was keep changing on its own)


---

**Aug 24 2025 v1**
- Most functionality so far seems to be working properly
    - Add Raider
    - Delete Raider
    - Get Item Level, Race, Faction, Class
    - Edit Role
    - Average Item Level
    - Search Raider
    - Links to external site

- Comments updated
- Current Roster
    - Show average item level
- Add Raider
    - Remove possibility of typo on server name input
    - If invalid information is added, it does not add to the database and shows an error pop up
    - duplicate charactor cannot be added
    - A proper error message shows if it failed to add
    - Add applies to UI immediately
- Individual Detail Card
    - Shows all data properly
    - Edit role
    - link to related website
- Individual Card
    - Delete
    - Delete applies to UI immediately
    - Delete button press doesn't make details show during the deleting procedure

---

**Aug 21 2025 v3**
- Current Roster
    - Add Raider form added, works

---

**Aug 21 2025 v2**
- Main Page
    - Add Raider
        - Not yet
    - Current Roster
        -Show names and item level
        -Search raider
        -Click card to view detailed information

---

**Aug 21 2025**
- Basic Functions Added
    - Get blizzard api to check item level
    - Track basic ilvl progress

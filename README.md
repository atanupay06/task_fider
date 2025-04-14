# 🔍 Task Search Automation with Google Apps Script
# 📖 Overview
This Google Apps Script automates the process of searching for tasks across multiple Google Sheets. By specifying search criteria in a central "Search" sheet, users can quickly locate matching tasks from various linked spreadsheets, streamlining task management and oversight.​

# 🚀 Features
Centralized Search Interface: Input search parameters in the "Search" sheet to query across multiple task sheets.​

Multi-Sheet Scanning: Automatically scans specified sheets listed in the "Config" sheet.​

Dynamic Criteria Matching: Matches tasks based on multiple criteria, including date, task ID, batch number, email, drive link, and task link.​

Result Compilation: Displays all matching tasks in the "Search" sheet for easy review.​

User Feedback: Provides alerts indicating the number of matches found or if no matches are detected.​

# 🛠️ How It Works
Setup:

The "Config" sheet contains a list of URLs to other Google Sheets that house task data.​

Each of these sheets should have a tab named "2025" containing the task data.​

Search Process:

Users enter search criteria into cells A2 to F2 of the "Search" sheet.​

Upon running the searchTasks function, the script iterates through each linked sheet, scanning the "2025" tab for rows that match the specified criteria.​

Matching rows are compiled and displayed starting from row 5 of the "Search" sheet.​

Feedback:

After the search, a message box informs the user of the number of matches found and the number of sheets scanned.

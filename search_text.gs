function searchTasks() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var searchSheet = ss.getSheetByName("Search");
  var configSheet = ss.getSheetByName("Config");

  if (!searchSheet || !configSheet) {
    Browser.msgBox("Error: Missing 'Search' or 'Config' sheet.");
    return;
  }

  // Get search criteria from A2:F2
  var searchCriteria = searchSheet.getRange("A2:F2").getValues()[0].map(val => val.toString().trim());
  var hasCriteria = searchCriteria.some(value => value !== "");

  if (!hasCriteria) {
    Browser.msgBox("Please enter at least one search value in A2:F2.");
    return;
  }

  var headers = [
    "DATE", "FP EMP NAME", "TASK ID", "TASK ASSIGNED TO ME", "BATCH #", "FP EMP Email",
    "Drive LINK", "COMMENTS / REMARKS", "TASK TYPE", "FP STATUS", "Expected time",
    "FP Total time taken", "Assignment Timestamp", "SLA Status", "SLA", "TASK LINK",
    "QC DATE", "QC STATUS", "QC SCORE", "QC NAME", "NDF FILE", "FAILURE REASON", "FP JUSTIFICATION"
  ];

  // Column numbers (1-based index)
  var colNumbers = {
    DATE: 1, TASK_ID: 3, BATCH: 5, FP_EMAIL: 6, DRIVE_LINK: 7, TASK_LINK: 16
  };

  var sheetLinks = configSheet.getRange("A:A").getValues().flat().filter(url => url);
  var resultData = [];
  var totalRowsChecked = 0;
  var sheetsChecked = 0;
  var matchedSheets = 0;

  for (var i = 0; i < sheetLinks.length; i++) {
    try {
      var externalSS = SpreadsheetApp.openByUrl(sheetLinks[i]);
      var sheet = externalSS.getSheetByName("2025"); // Only check the "2025" tab

      if (!sheet) continue; // Skip if "2025" tab not found
      sheetsChecked++;

      var data = sheet.getDataRange().getValues();
      if (data.length < 2) continue; // Skip empty sheets

      for (var k = 1; k < data.length; k++) {
        totalRowsChecked++;
        var row = data[k].slice(0, 23).map(cell => cell.toString().trim()); // Keep only the first 23 columns

        // Check only non-empty criteria
        var isMatch = true;
        if (searchCriteria[0] !== "" && row[colNumbers.DATE - 1] !== searchCriteria[0]) isMatch = false;
        if (searchCriteria[1] !== "" && row[colNumbers.TASK_ID - 1] !== searchCriteria[1]) isMatch = false;
        if (searchCriteria[2] !== "" && row[colNumbers.BATCH - 1] !== searchCriteria[2]) isMatch = false;
        if (searchCriteria[3] !== "" && row[colNumbers.FP_EMAIL - 1] !== searchCriteria[3]) isMatch = false;
        if (searchCriteria[4] !== "" && row[colNumbers.DRIVE_LINK - 1] !== searchCriteria[4]) isMatch = false;
        if (searchCriteria[5] !== "" && row[colNumbers.TASK_LINK - 1] !== searchCriteria[5]) isMatch = false;

        if (isMatch) {
          resultData.push(row);
          matchedSheets++;
        }
      }
    } catch (e) {
      Logger.log("Error accessing sheet: " + sheetLinks[i] + " - " + e.message);
    }
  }

  // Clear previous results in row 5 (excluding headers in row 4)
  var lastColumn = headers.length;
  searchSheet.getRange(5, 1, searchSheet.getMaxRows() - 4, lastColumn).clearContent();

  if (resultData.length > 0) {
    searchSheet.getRange(5, 1, resultData.length, lastColumn).setValues(resultData);
    Browser.msgBox("✅ Found " + resultData.length + " matches in " + matchedSheets + " sheets.");
  } else {
    Browser.msgBox("❌ No matches found. Searched " + sheetsChecked + " sheets and checked " + totalRowsChecked + " rows.");
  }
}


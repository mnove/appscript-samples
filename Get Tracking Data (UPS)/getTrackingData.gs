// Get tracking data from UPS (RapidAPI) into a Google Spreadsheet 

// You should be able to use it with other courriers as well 

// Sample Spreadsheet: https://docs.google.com/spreadsheets/d/1bQM8Yv1Hquyo0PSnxUa4MVoYAN_dBsunP1r5PWPMgVc/edit#gid=0


const ss = SpreadsheetApp.getActiveSpreadsheet();
const sourceSheet = ss.getSheetByName("data");     //get the sheet with tracking numbers data


function getTrackingData() {

  var lastRow = sourceSheet.getLastRow();
  var trackingNumbers = sourceSheet.getRange(1, 1, lastRow, 5).getValues();

  
  for (var i = 0; i < trackingNumbers.length; i++) {

    
    //check that the row has not been processed yet
    if (sourceSheet.getRange(i + 1, 5).getValue() !== "processed") { 
      var data = {

        'tracking_number': trackingNumbers[i][1],
        'carrier_code': 'ups',                          // courrier's name
        'data': {}

      };

      // URLFetchApp - RapidAPI  https://rapidapi.com/colinnn/api/order-tracking)
      var response = UrlFetchApp.fetch('https://order-tracking.p.rapidapi.com/trackings/realtime', {
        'method': 'GET',
        'headers': {
          'x-rapidapi-host': 'order-tracking.p.rapidapi.com',
          'x-rapidapi-key': 'yourKey',                                //insert your key here
          'content-type': 'application/json',
          'accept': "application/json"
        },
        'payload': JSON.stringify(data),
        'body': {}
      });
      

      var content = response.getContentText();
      var responseCode = response.getResponseCode();
      Logger.log(responseCode);
      jsonParse = JSON.parse(content);

      var trackingStatus = jsonParse.data.items[0]["status"];
      var trackingLastEvent = jsonParse.data.items[0]["lastEvent"];


      sourceSheet.getRange(i + 1, 3).setValue(trackingStatus);
      sourceSheet.getRange(i + 1, 4).setValue(trackingLastEvent);
      sourceSheet.getRange(i + 1, 6).setValue(responseCode);
      
      //if the parcel's status is "delivered", then set it as "processed", so it does run again for this row
      if (trackingStatus == "delivered") {
        sourceSheet.getRange(i + 1, 5).setValue("processed");
      }

    }
  }
}

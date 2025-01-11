// Function to create the web interface
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Bus Seat Booking');
}

function getSeats(){
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Seats');
  var data = sheet.getDataRange().getValues();
  return data;
}

function getCurrentSeats(nim) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Seats');
  var data = sheet.getDataRange().getValues();

  for (var i = 0; i < data.length; i++) {
    if (data[i][1] == nim) {
      return data[i][0];
    }
  }
  return null;
}

function checkNIMInSpreadsheet(nim) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Participants');
  var data = sheet.getDataRange().getValues();
  
  for (var i = 0; i < data.length; i++) {
    if (String(data[i][0]).trim() === String(nim).trim()) {
      return {
        isValid: true,
        name: data[i][1], // Assuming the name is in the second column
        currentSeats : getCurrentSeats(nim)
      };
    }
  }
  
  return { isValid: false, name: '', currentSeats: ''};
}

function bookSeat(seatId, nim, name, contact) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Seats');
  var data = sheet.getDataRange().getValues();

  for (var i = 0; i < data.length; i++) {
    if (data[i][0] == seatId) {
      if (data[i][1]) {
        return 'Seat already booked!'; // Seat is already booked
      } else {
        sheet.getRange(i + 1, 2).setValue(nim); // Update status to booked
        sheet.getRange(i + 1, 3).setValue(name);  // Set passenger Name
        sheet.getRange(i + 1, 4).setValue(contact);  // Set passenger Contact
        return 'Seat booked successfully!';
      }
    }
  }
  return 'Seat not found!';
}

function changeSeat(seatId, nim, name, contact) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Seats');
  var data = sheet.getDataRange().getValues();

  var currentSeat = getCurrentSeats(nim);
  for (var l = 0; l < data.length; l++) {
    if (String(data[l][0]).trim() === String(currentSeat).trim()) {
      var name = sheet.getRange(l + 1, 3).getValue();
      var contact = sheet.getRange(l + 1, 4).getValue();
      sheet.getRange(l + 1, 2).setValue('');
      sheet.getRange(l + 1, 3).setValue('');
      sheet.getRange(l + 1, 4).setValue('');
      break;
    }
  }

  bookSeat(seatId, nim, name, contact);
  return "Seat changed successfully!"
}
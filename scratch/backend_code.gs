// ==========================================
// WITHU - Google Apps Script Backend (Code.gs)
// ==========================================

const SHEET_NAME = "Orders"; // ชื่อชีตที่เก็บข้อมูล (แก้ให้ตรงกับของคุณ)

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    if(data.apiKey !== "WITHU_SECRET_2026") {
      return ContentService.createTextOutput(JSON.stringify({status: "error", message: "Unauthorized"}))
             .setMimeType(ContentService.MimeType.JSON);
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME) || SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    
    if (data.action === 'submitOrder') {
      const orderId = Utilities.getUuid();
      const timestamp = new Date();
      
      const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      
      data.cart.forEach(item => {
        let newRow = [];
        for (let i = 0; i < headers.length; i++) {
          let h = String(headers[i]).toLowerCase().trim();
          if (h === 'orderid') newRow.push(orderId);
          else if (h === 'time' || h === 'timestamp') newRow.push(timestamp);
          else if (h === 'table') newRow.push(data.table);
          else if (h === 'menu') newRow.push(item.menu);
          else if (h === 'details' || h === 'note') newRow.push(item.note || item.details || "");
          else if (h === 'price') newRow.push(item.price);
          else if (h === 'qty') newRow.push(item.qty);
          else if (h === 'total') newRow.push(item.total);
          else if (h === 'status') newRow.push("active");
          else if (h === 'delivery') newRow.push(data.delivery || ""); 
          else if (h === 'slipimage') newRow.push(data.slipImage || ""); 
          else newRow.push("");
        }
        sheet.appendRow(newRow);
      });

      return ContentService.createTextOutput(JSON.stringify({status: "success"}))
             .setMimeType(ContentService.MimeType.JSON);
             
    } else if (data.action === 'updateStatus') {
      data.rowNums.forEach(rowNum => {
         const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
         let statusCol = headers.findIndex(h => String(h).toLowerCase().trim() === 'status') + 1;
         if(statusCol > 0) {
            sheet.getRange(rowNum, statusCol).setValue(data.status);
         }
      });
      return ContentService.createTextOutput(JSON.stringify({status: "success"}))
             .setMimeType(ContentService.MimeType.JSON);
    }
    
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({status: "error", message: err.toString()}))
           .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME) || SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    let orders = [];

    let fingerprint = data.length + "_" + (data.length > 1 ? data[data.length-1].join("") : "");

    for (let i = 1; i < data.length; i++) {
      let row = data[i];
      let obj = { rowNum: i + 1 };
      
      for (let j = 0; j < headers.length; j++) {
        let h = String(headers[j]).toLowerCase().trim();
        if (h === 'orderid') obj.orderId = row[j];
        if (h === 'time' || h === 'timestamp') obj.time = row[j];
        if (h === 'table') obj.table = row[j];
        if (h === 'menu') obj.menu = row[j];
        if (h === 'details' || h === 'note') obj.details = row[j];
        if (h === 'price') obj.price = row[j];
        if (h === 'qty') obj.qty = row[j];
        if (h === 'total') obj.total = row[j];
        if (h === 'status') obj.status = row[j];
        if (h === 'delivery') obj.delivery = row[j]; 
        if (h === 'slipimage') obj.slipImage = row[j]; 
      }
      
      if (obj.status !== 'void' && obj.status !== 'completed' && obj.status !== 'ยกเลิก') {
        orders.push(obj);
      }
    }

    return ContentService.createTextOutput(JSON.stringify({ orders: orders, fingerprint: fingerprint }))
           .setMimeType(ContentService.MimeType.JSON);
           
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({status: "error", message: err.toString()}))
           .setMimeType(ContentService.MimeType.JSON);
  }
}


// Create a custom timestamp function in Google Appscript, that you can use in Google Sheets 



/**
*
*Get timestamp
*
*@customfunction
*/

function TIMESTAMP() {

  var today = new Date();
  var date = (today.getMonth()+1)+'-'+today.getDate()+'-'+today.getFullYear();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date+' '+time;
  return dateTime;

}

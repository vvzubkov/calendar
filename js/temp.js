document.getElementsByClassName(genVar.clTable)[0].innerHTML ='';
for (var i=0; i < 5; i++) {
    document.getElementsByClassName(genVar.clTable)[0].innerHTML += ('<tr class="cl-table-row"></tr>');
    for (var j=0; j < 7; j++) {
        var row = document.getElementsByClassName(genVar.clRow)[i];
        var dayName = '';
        if ( i == 0) {dayName = genVar.curDate.getDayName()}
        row.innerHTML +=
            ('<td class="cl-table-col hd-trigger" hd-trigger="add-edit-ev">'+
            '<div>'+
            '<p><span class="day-of-week">'+ dayName +'</span>, ' +
            '<span class="day-of-month">'+genVar.curDate.getDate()+'</span></p>'+
            '<p class="event-title"></p>'+
            '<p class="event-participants"></p>'+
            '<p class="event-description"></p>'+
            '</div>'+
            '</td>');
        var col = row.getElementsByClassName(genVar.clCol)[j];
        todayCheck(curDate, todayDate, col);
        curDate.setDate(curDate.getDate() + 1);
    }
}
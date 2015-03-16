/**
 * Created by Vova.Zubkov on 16.03.2015.
 */

var calendar = calendar || {},
    data = JSON.parse(localStorage.getItem("calendar"));

data = data || {};
(function (calendar, data) {

    var genVar = {
        trigger: [].slice.call(document.querySelectorAll('.hd-trigger')),
        blocks: [].slice.call(document.querySelectorAll('.hd-block')),
        clBlock: document.querySelector('.cl-block'),
        clTable: document.querySelector('.cl-table'),
        dayList: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
        monthList: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        todayDate: new Date(),
        curDate: new Date()
    };

    (function () {
        Date.prototype.getMonthName = function () {
            return genVar.monthList[this.getMonth()];
        };
        Date.prototype.getDayName = function () {
            return genVar.dayList[this.getDay()];
        };
    })();

    calendar.init = function () {

    }

})(calendar, data);
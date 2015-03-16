/**
 * Created by Vova.Zubkov on 16.03.2015.
 */

var calendar = calendar || {},
    data = JSON.parse(localStorage.getItem("calendar"));

data = data || {};
(function (calendar, data) {

    var genVar = {
            trigger: '.hd-trigger',
            block: '.hd-block',
            clBlock: '.cl-block',
            clTable: '.cl-table',
            clTitle: '.month-year-title',
            clRow: '.cl-table-row',
            clCol: '.cl-table-col',
            dayList: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
            monthList: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
            todayDate: new Date(),
            curDate: new Date()
        },
        tempData = {
            id: '',
            title: '',
            date: {
                day:'',
                month:'',
                year:''
            },
            description: ''
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
        genVar.todayDate = new Date();
        genVar.curDate = new Date();

        tempData.id = genVar.todayDate.getTime();
        data[tempData.id] = tempData;
        localStorage.setItem("calendar", JSON.stringify(data));
        data = JSON.parse(localStorage.getItem("calendar"));
        localStorage.clear();
        console.log(data);

        genVar.curDate.setDate(genVar.curDate.getDate() - genVar.curDate.getDay() + 1);

        document.querySelector(genVar.clTitle).innerHTML = genVar.curDate.getMonthName() + ' ' + genVar.curDate.getFullYear();

        [].slice.call(document.querySelectorAll(genVar.clRow)).forEach(function (row, i) {
            [].slice.call(row.querySelectorAll(genVar.clCol)).forEach(function (col, j) {
                col.querySelector('.day-of-month').innerHTML = '' + genVar.curDate.getDate();

                for(var x in data)
                {
                    if ( parseInt(data[x].date.day,10) == parseInt(genVar.curDate.getDay(), 10) &&
                        parseInt(data[x].date.month,10) == parseInt(genVar.curDate.getMonthName(), 10) &&
                        parseInt(data[x].date.year,10) == parseInt(genVar.curDate.getFullYear(), 10))
                    {
                        col.setAttribute('date-id', '' + parseInt(genVar.curDate.getTime(), 10));
                    }
                }
                if ( genVar.curDate.getDate() == genVar.todayDate.getDate() &&
                    genVar.curDate.getMonth() == genVar.todayDate.getMonth() &&
                    genVar.curDate.getFullYear() == genVar.todayDate.getFullYear())
                {
                    col.classList.add('today')
                }
                else if (col.classList.contains('today'))
                {
                    col.classList.remove('today')
                }
                genVar.curDate.setDate(genVar.curDate.getDate() + 1);
            })
        });
    };

    calendar.addEvent = function () {

    };

    calendar.addEventShort = function () {

    };

    calendar.removeEvent = function () {

    };

    function eventHandling () {
        [].slice.call(document.querySelectorAll(genVar.trigger)).forEach(function (elTrigger, i) {
            var block = document.querySelector('.hd-block[hd-block="' + elTrigger.getAttribute('hd-trigger') + '"]'),
                close = [].slice.call(block.querySelectorAll('.hd-close'));
            elTrigger.addEventListener('click', function (e) {
                e.preventDefault();
                if (!elTrigger.classList.contains('active')) {
                    [].slice.call(document.querySelectorAll(genVar.trigger)).forEach(function (elt, i) {
                        elt.classList.remove('active');
                    });
                    [].slice.call(document.querySelectorAll(genVar.block)).forEach(function (elb, i) {
                        elb.classList.remove('visible');
                    });

                    setTimeout(function () {
                        elTrigger.classList.add('active');
                        block.classList.add('visible');

                        if (elTrigger.getAttribute('hd-trigger') == 'add-edit-ev') {
                            if ((block.offsetWidth + elTrigger.offsetLeft + elTrigger.offsetWidth)
                                > document.querySelector(genVar.clBlock).offsetWidth)
                            {
                                block.classList.remove('right');
                                block.classList.add('left');
                                block.style.left = elTrigger.offsetLeft - block.offsetWidth - 20 + 'px';
                            }
                            else
                            {
                                block.classList.remove('left');
                                block.classList.add('right');
                                block.style.left = elTrigger.offsetLeft + elTrigger.offsetWidth + 20 + 'px';
                            }

                            if (elTrigger.offsetTop == 0)
                            {
                                block.style.top = elTrigger.offsetTop + 'px';
                            }
                            else if ((block.offsetHeight + elTrigger.offsetTop) > document.querySelector(genVar.clBlock).offsetHeight)
                            {
                                block.classList.remove('top');
                                block.classList.add('bottom');
                                var i = 0;
                                do {
                                    block.style.top = elTrigger.offsetTop + elTrigger.offsetHeight - block.offsetHeight + i + 'px';
                                    i++;
                                } while (block.offsetHeight + block.offsetTop + 20 < document.querySelector(genVar.clBlock).offsetHeight);
                            }
                            else
                            {
                                block.classList.remove('bottom');
                                block.classList.add('top');
                                block.style.top = elTrigger.offsetTop - 20 + 'px';
                            }
                        }
                    }, 50)
                }
                else {
                    elTrigger.classList.remove('active');
                    block.classList.remove('visible');
                }
            });
            close.forEach(function (elClose, j) {
                elClose.addEventListener('click', function (e) {
                    e.preventDefault();
                    elTrigger.classList.remove('active');
                    block.classList.remove('visible');
                });
            });
        });
        window.addEventListener('click', function (e) {
            e.preventDefault();
            [].slice.call(document.querySelectorAll(genVar.trigger)).forEach(function (elTrigger, i) {
                if (elTrigger.classList.contains('active')) {
                    var block = document.querySelector('.hd-block[hd-block="' + elTrigger.getAttribute('hd-trigger') + '"]');
                    elTrigger.classList.remove('active');
                    block.classList.remove('visible');

                }
            })
        });
    }

    eventHandling ();

})(calendar, data);
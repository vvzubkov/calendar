/**
 * Created by Vova.Zubkov on 16.03.2015.
 */

var calendar = calendar || {},
    data = JSON.parse(localStorage.getItem("calendar"));

    data = data || {};

(function (calendar, data) {

    var genVar = {
            trigger: 'hd-trigger',
            block: 'hd-block',
            close: 'hd-close',
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
            time:{
                hour:'',
                minute:''
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

    function todayCheck ( curDate, todayDate, col ){
        if ( curDate.getDate() == todayDate.getDate() &&
            curDate.getMonth() == todayDate.getMonth() &&
            curDate.getFullYear() == todayDate.getFullYear())
        {
            col.classList.add('today')
        }
        else if (col.classList.contains('today'))
        {
            col.classList.remove('today')
        }
    }

    function clMove ( curDate, todayDate, data ) {
        curDate.setDate(curDate.getDate() - curDate.getDay() + 1);
        document.querySelector(genVar.clTitle).innerHTML = curDate.getMonthName() + ' ' + curDate.getFullYear();
        [].slice.call(document.querySelectorAll(genVar.clRow)).forEach(function (row, i) {
            [].slice.call(row.querySelectorAll(genVar.clCol)).forEach(function (col, j) {
                col.querySelector('.day-of-month').innerHTML = '' + genVar.curDate.getDate();
                for(var x in data)
                {
                    if ( parseInt(data[x].date.day,10) == parseInt(curDate.getDay(), 10) &&
                        parseInt(data[x].date.month,10) == parseInt(curDate.getMonthName(), 10) &&
                        parseInt(data[x].date.year,10) == parseInt(curDate.getFullYear(), 10))
                    {
                        col.setAttribute('date-id', '' + parseInt(curDate.getTime(), 10));
                    }
                }
                todayCheck ( curDate, todayDate, col );
                curDate.setDate(curDate.getDate() + 1);
            })
        });
    }

    function eventHandling (trigger, block, close) {
        var triggerList = [].slice.call(document.querySelectorAll('.' + trigger));

        triggerList.forEach(function (elTrigger, i) {
            var curBlock = document.querySelector('.' + block + '[' + block + '="' + elTrigger.getAttribute(trigger) + '"]'),
                closeList = [].slice.call(curBlock.querySelectorAll('.' + close));
                elTrigger.addEventListener('click', function (e) {
                e.preventDefault();
                if (!elTrigger.classList.contains('active')) {
                    [].slice.call(document.querySelectorAll(trigger)).forEach(function (elt, i) {
                        elt.classList.remove('active');
                    });
                    [].slice.call(document.querySelectorAll(block)).forEach(function (elb, i) {
                        elb.classList.remove('visible');
                    });

                    setTimeout(function () {
                        elTrigger.classList.add('active');
                        curBlock.classList.add('visible');

                        if (elTrigger.getAttribute(trigger) == 'add-edit-ev') {
                            if ((curBlock.offsetWidth + elTrigger.offsetLeft + elTrigger.offsetWidth)
                                > document.querySelector(genVar.clBlock).offsetWidth)
                            {
                                curBlock.classList.remove('right');
                                curBlock.classList.add('left');
                                curBlock.style.left = elTrigger.offsetLeft - curBlock.offsetWidth - 20 + 'px';
                            }
                            else
                            {
                                curBlock.classList.remove('left');
                                curBlock.classList.add('right');
                                curBlock.style.left = elTrigger.offsetLeft + elTrigger.offsetWidth + 20 + 'px';
                            }

                            if (elTrigger.offsetTop == 0)
                            {
                                curBlock.style.top = elTrigger.offsetTop + 'px';
                            }
                            else if ((curBlock.offsetHeight + elTrigger.offsetTop) > document.querySelector(genVar.clBlock).offsetHeight)
                            {
                                curBlock.classList.remove('top');
                                curBlock.classList.add('bottom');
                                var i = 0;
                                do {
                                    curBlock.style.top = elTrigger.offsetTop + elTrigger.offsetHeight - curBlock.offsetHeight + i + 'px';
                                    i++;
                                } while (curBlock.offsetHeight + curBlock.offsetTop + 20 < document.querySelector(genVar.clBlock).offsetHeight);
                            }
                            else
                            {
                                curBlock.classList.remove('bottom');
                                curBlock.classList.add('top');
                                curBlock.style.top = elTrigger.offsetTop - 20 + 'px';
                            }
                        }
                    }, 50)
                }
                else {
                    elTrigger.classList.remove('active');
                    curBlock.classList.remove('visible');
                }
            });
            closeList.forEach(function (elClose, j) {
                elClose.addEventListener('click', function (e) {
                    e.preventDefault();
                    elTrigger.classList.remove('active');
                    curBlock.classList.remove('visible');
                });
            });
        });

        window.addEventListener('click', function (e) {
            e.preventDefault();
            triggerList.forEach(function (elTrigger, i) {
                if (elTrigger.classList.contains('active')) {
                    var block = document.querySelector('.hd-block[hd-block="' + elTrigger.getAttribute('hd-trigger') + '"]');
                    elTrigger.classList.remove('active');
                    block.classList.remove('visible');

                }
            })
        });
    }

    calendar.init = function () {
        genVar.todayDate = new Date();
        genVar.curDate = new Date();
        //tempData.id = genVar.todayDate.getTime();
        //data[tempData.id] = tempData;
        //localStorage.setItem("calendar", JSON.stringify(data));
        data = JSON.parse(localStorage.getItem("calendar"));
        //localStorage.clear();
        //console.log(data);
        clMove ( genVar.curDate, genVar.todayDate, data);
    };

    calendar.movePrev = function () {
        var dt = 0;
        do {
            genVar.curDate.setDate(genVar.curDate.getDate() - 1);
            dt++;
        } while (dt < 70);
        data = JSON.parse(localStorage.getItem("calendar"));
        clMove ( genVar.curDate, genVar.todayDate, data);
    };

    calendar.moveNext = function () {
        data = JSON.parse(localStorage.getItem("calendar"));
        clMove ( genVar.curDate, genVar.todayDate, data);
    };

    calendar.addEvent = function () {

    };

    calendar.addEventShort = function () {

    };

    calendar.removeEvent = function () {

    };

    eventHandling (genVar.trigger, genVar.block, genVar.close);

})(calendar, data);
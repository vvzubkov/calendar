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
            editForm: 'editEvent',
            addForm: 'addEvent',
            dayList: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
            monthList: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
            todayDate: new Date(),
            curDate: new Date()
        },
        tempData = {
            id: '',
            title: '',
            date: '',
            participants: '',
            description: ''
        },
        editForm = {
            body: document.getElementById(genVar.editForm),
            title: document.getElementsByClassName(genVar.editForm + '-title'),
            date: document.getElementsByClassName(genVar.editForm + '-date'),
            participants: document.getElementsByClassName(genVar.editForm + '-participants'),
            description: document.getElementsByClassName(genVar.editForm + '-description')
        },
        addForm = {
            body: document.getElementById(genVar.addForm),
            title: document.getElementsByClassName(genVar.addForm + '-title')
        };

    (function () {
        Date.prototype.getMonthName = function () {
            return genVar.monthList[this.getMonth()];
        };
        Date.prototype.getDayName = function () {
            return genVar.dayList[this.getDay()];
        };
    })();

    function find (arr, value) {
        var tmp = arr.length;
        while (tmp--) {
            if (arr[tmp] == value) return tmp;
        }
        return false;
    }

    function todayCheck (curDate, todayDate, col) {
        if (curDate.getDate() == todayDate.getDate() &&
            curDate.getMonth() == todayDate.getMonth() &&
            curDate.getFullYear() == todayDate.getFullYear()) {
            col.classList.add('today')
        }
        else if (col.classList.contains('today')) {
            col.classList.remove('today')
        }
    }

    function findColDate (date) {
        [].slice.call(document.querySelectorAll(genVar.clRow)).forEach(function (row, i) {
            [].slice.call(row.querySelectorAll(genVar.clCol)).forEach(function (col, j) {
                if (col.classList.contains('active')) {
                    var dt = 0;
                    do {
                        date.setDate(date.getDate() + 1);
                        dt++;
                    } while (dt < (i * 7) + j);

                }
            })
        });
    }

    function clDraw (curDate, todayDate) {
        curDate.setDate(curDate.getDate() - curDate.getDay() + 1);
        document.querySelector(genVar.clTitle).innerHTML = curDate.getMonthName() + ' ' + curDate.getFullYear();
        [].slice.call(document.querySelectorAll(genVar.clRow)).forEach(function (row, i) {
            [].slice.call(row.querySelectorAll(genVar.clCol)).forEach(function (col, j) {
                col.querySelector('.day-of-month').innerHTML = '' + genVar.curDate.getDate();
                col.classList.remove('has-event');
                col.querySelector('.event-title').innerHTML = '';
                col.querySelector('.event-participants').innerHTML = '';
                col.querySelector('.event-description').innerHTML = '';

                var checkDate = new Date(curDate.getTime());
                    checkDate = checkDate.getTime();
                data = JSON.parse(localStorage.getItem("calendar"));

                for (var x in data) {
                    if (data[x].id == parseInt(checkDate, 10)) {
                        col.querySelector('.event-title').innerHTML = data[x].title.toString();
                        col.querySelector('.event-participants').innerHTML = data[x].participants.toString();
                        col.querySelector('.event-description').innerHTML = data[x].description.toString();
                        col.classList.add('has-event');
                    }
                }
                todayCheck(curDate, todayDate, col);
                curDate.setDate(curDate.getDate() + 1);
            })
        });
        var dt = 0;
        do {
            genVar.curDate.setDate(genVar.curDate.getDate() - 1);
            dt++;
        } while (dt < 35);
    }

    function hdBlockPosition (curBlock, elTrigger, clBlock) {
        if ((curBlock.offsetWidth + elTrigger.offsetLeft + elTrigger.offsetWidth)
            > document.querySelector(clBlock).offsetWidth) {
            curBlock.classList.remove('right');
            curBlock.classList.add('left');
            curBlock.style.left = elTrigger.offsetLeft - curBlock.offsetWidth - 20 + 'px';
        }
        else {
            curBlock.classList.remove('left');
            curBlock.classList.add('right');
            curBlock.style.left = elTrigger.offsetLeft + elTrigger.offsetWidth + 20 + 'px';
        }
        if (elTrigger.offsetTop == 0) {
            curBlock.style.top = elTrigger.offsetTop + 'px';
        }
        else if ((curBlock.offsetHeight + elTrigger.offsetTop) > document.querySelector(clBlock).offsetHeight) {
            curBlock.classList.remove('top');
            curBlock.classList.add('bottom');
            var i = 0;
            do {
                curBlock.style.top = elTrigger.offsetTop + elTrigger.offsetHeight - curBlock.offsetHeight + i + 'px';
                i++;
            } while (curBlock.offsetHeight + curBlock.offsetTop + 20 < document.querySelector(clBlock).offsetHeight);
        }
        else {
            curBlock.classList.remove('bottom');
            curBlock.classList.add('top');
            curBlock.style.top = elTrigger.offsetTop - 20 + 'px';
        }
    }

    function hdBlockClose () {
        [].slice.call(document.querySelectorAll('.' + genVar.trigger))
            .forEach(function (elt, i) {
                elt.classList.remove('active');
            });
        [].slice.call(document.querySelectorAll('.' + genVar.block))
            .forEach(function (elb, i) {
                elb.classList.remove('visible');
            });
        [].slice.call(document.querySelectorAll('form'))
            .forEach(function (elf, i) {
                [].slice.call(elf.querySelectorAll('input[type=text]'))
                    .forEach(function (eli, i) {
                        eli.value = '';
                    });
                [].slice.call(elf.querySelectorAll('textarea'))
                    .forEach(function (eli, i) {
                        eli.value = '';
                    });
            });
        editForm.title[0].removeAttribute('readonly');
        editForm.date[0].removeAttribute('readonly');
        editForm.participants[0].removeAttribute('readonly');
        editForm.description[0].removeAttribute('readonly');
    }

    function hdBlockOpen (elTrigger, curBlock) {
        elTrigger.classList.add('active');
        curBlock.classList.add('visible');

    }

    function eventHandling (trigger, block, close, clBlock) {
        var triggerList = [].slice.call(document.querySelectorAll('.' + trigger));

        triggerList.forEach(function (elTrigger, i) {
            var curBlock = document.querySelector('.' + block + '[' + block + '="' + elTrigger.getAttribute(trigger) + '"]'),
                closeList = [].slice.call(curBlock.querySelectorAll('.' + close));

            elTrigger.addEventListener('click', function (e) {
                e.preventDefault();
                if (!elTrigger.classList.contains('active')) {
                    hdBlockClose();
                    setTimeout(function () {
                        hdBlockOpen(elTrigger, curBlock);
                        if (elTrigger.getAttribute(genVar.trigger) == 'add-edit-ev') {
                            var date = new Date(genVar.curDate.getTime());
                            findColDate(date);
                            var checkDate = date.getTime();
                            data = JSON.parse(localStorage.getItem("calendar"));
                            editForm.date[0].setAttribute('placeholder', (date.getDate() + ', ' + date.getMonthName() + ', ' + date.getFullYear()).toString());
                            for (var x in data) {
                                if (data[x].id == parseInt(checkDate, 10)) {
                                    if (data[x].title.toString() == ''){
                                        editForm.title[0].removeAttribute('readonly');
                                    }
                                    else {
                                        editForm.title[0].value = data[x].title.toString();
                                        editForm.title[0].readOnly = true;
                                        editForm.title[0].addEventListener('click',function (){
                                            this.removeAttribute('readonly');
                                        });
                                    }

                                    if (data[x].date.toString() == ''){
                                        editForm.date[0].removeAttribute('readonly');
                                    }
                                    else {
                                        editForm.date[0].value = data[x].date.toString();
                                        editForm.date[0].readOnly = true;
                                        editForm.date[0].addEventListener('click',function (){
                                            this.removeAttribute('readonly');
                                        });
                                    }

                                    if (data[x].participants.toString() == ''){
                                        editForm.participants[0].removeAttribute('readonly');
                                    }
                                    else {
                                        editForm.participants[0].value = data[x].participants.toString();
                                        editForm.participants[0].readOnly = true;
                                        editForm.participants[0].addEventListener('click',function (){
                                            this.removeAttribute('readonly');
                                        });
                                    }

                                    if (data[x].description.toString() == ''){
                                        editForm.description[0].removeAttribute('readonly');
                                    }
                                    else {
                                        editForm.description[0].value = data[x].description.toString();
                                        editForm.description[0].readOnly = true;
                                        editForm.description[0].addEventListener('click',function (){
                                            this.removeAttribute('readonly');
                                        });
                                    }
                                }
                            }
                            hdBlockPosition(curBlock, elTrigger, clBlock);
                        }
                    }, 50);
                }
                else {
                    hdBlockClose();
                }
            });
            closeList.forEach(function (elClose, j) {
                elClose.addEventListener('click', function (e) {
                    e.preventDefault();
                    hdBlockClose();
                });
            });
        });
        window.addEventListener('click', function (e) {
            e.preventDefault();
            e = e || window.event;
            var target = e.target || e.srcElement;
            while (target != document) {
                if (/(^|\s)hd-block(\s|$)/.test(target.className)) {
                    return;
                }
                target = target.parentNode;
            }
            hdBlockClose();
        });
    }

    calendar.onStart = function () {
        genVar.curDate = new Date(genVar.todayDate.getTime());
        data = JSON.parse(localStorage.getItem("calendar"));
        clDraw(genVar.curDate, genVar.todayDate);
    };

    calendar.init = function () {
        genVar.todayDate = new Date();
        genVar.todayDate = new Date(genVar.todayDate.getFullYear() + ', ' + (genVar.todayDate.getMonth()+1) + ', ' + genVar.todayDate.getDate());
        genVar.curDate = new Date(genVar.todayDate.getTime());
        data = {};
        localStorage.setItem("calendar", JSON.stringify(data));
        data = JSON.parse(localStorage.getItem("calendar"));
        console.clear();
        clDraw(genVar.curDate, genVar.todayDate);
    };

    calendar.movePrev = function () {
        var dt = 0;
        do {
            genVar.curDate.setDate(genVar.curDate.getDate() - 1);
            dt++;
        } while (dt < 35);
        data = JSON.parse(localStorage.getItem("calendar"));
        clDraw(genVar.curDate, genVar.todayDate);
    };

    calendar.moveNext = function () {
        var dt = 0;
        do {
            genVar.curDate.setDate(genVar.curDate.getDate() + 1);
            dt++;
        } while (dt < 35);
        data = JSON.parse(localStorage.getItem("calendar"));
        clDraw(genVar.curDate, genVar.todayDate);
    };

    calendar.editEvent = function () {
        var date = new Date(genVar.curDate.getTime());

        findColDate(date);
        tempData.id = parseInt(date.getTime(), 10);
        if (editForm.title[0].value)
            tempData.title = editForm.title[0].value.toString();
        else tempData.title = 'Заголовок пуст';
        if (editForm.date[0].value)
            tempData.date = editForm.date[0].value;
        else tempData.date = editForm.date[0].getAttribute('placeholder').toString();
        tempData.participants = editForm.participants[0].value.toString();
        tempData.description = editForm.description[0].value.toString();

        data[tempData.id] = tempData;
        localStorage.setItem("calendar", JSON.stringify(data));

        hdBlockClose();

        data = JSON.parse(localStorage.getItem("calendar"));
        clDraw(genVar.curDate, genVar.todayDate);
    };

    calendar.addEvent = function () {
        var str = (addForm.title[0].value).toString();
        str = str.split(',');
        var strDate = str[0].split(' '),
            strTime = str[1],
            strTitle = str[2],
            date  = new Date(strDate[2] + ', ' + (find(genVar.monthList, strDate[1])+1) + ', ' + strDate[0]);

        tempData.id = parseInt(date.getTime(), 10);

        if (strTitle == undefined)
            tempData.title = 'Заголовок пуст';
        else tempData.title = str[2];

        if (strTime == undefined) tempData.date = strDate[0] + ', ' + strDate[1] + ', ' + strDate[2];
        else tempData.date = strDate[0] + ', ' + strDate[1] + ', ' + strDate[2] + ', ' + strTime;

        data[tempData.id] = tempData;
        localStorage.setItem("calendar", JSON.stringify(data));

        hdBlockClose();

        data = JSON.parse(localStorage.getItem("calendar"));
        clDraw(genVar.curDate, genVar.todayDate);
    };

    calendar.removeEvent = function () {
        var date = new Date(genVar.curDate.getTime());
        findColDate(date);

        data = JSON.parse(localStorage.getItem("calendar"));
        for (var x in data) {
            if (data[x].id == parseInt(date.getTime(), 10)) {
                delete data[x];
                localStorage.setItem("calendar", JSON.stringify(data));
            }
        }
        data = JSON.parse(localStorage.getItem("calendar"));
        clDraw(genVar.curDate, genVar.todayDate);
        hdBlockClose();
    };

    eventHandling(genVar.trigger, genVar.block, genVar.close, genVar.clBlock);

})(calendar, data);


function addEventKeyDown ()
{
    if (event.keyCode == 13)
    {
        event.cancelBubble = true;
        event.returnValue = false;
        calendar.addEvent();
    }
}
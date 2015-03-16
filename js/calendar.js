var calendar = (function () {

    var trigger = [].slice.call(document.querySelectorAll('.hd-trigger')),
        blocks = [].slice.call(document.querySelectorAll('.hd-block')),
        clBlock = document.querySelector('.cl-block'),
        clTable = document.querySelector('.cl-table');

    var days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    var months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

    (function () {
        Date.prototype.getMonthName = function () {
            return months[this.getMonth()];
        };
        Date.prototype.getDayName = function () {
            return days[this.getDay()];
        };
    })();

    var todayDate = new Date(),
        curDate = new Date();

    function init() {
        todayDate = new Date();
        curDate = new Date();
        curDate.setDate(curDate.getDate() - curDate.getDay() + 1);
        document.querySelector('.month-year-title').innerHTML = curDate.getMonthName() + ' ' + curDate.getFullYear();
        [].slice.call(document.querySelectorAll('.cl-table-row')).forEach(function (row, i) {
            [].slice.call(row.querySelectorAll('.cl-table-col')).forEach(function (col, j) {
                col.querySelector('.day-of-month').innerHTML = ''+ curDate.getDate();
                col.setAttribute('date-d',''+ parseInt(curDate.getDate(),10));
                col.setAttribute('date-m',''+ parseInt(curDate.getMonth()+1,10));
                col.setAttribute('date-y',''+ parseInt(curDate.getFullYear(),10));
                if (curDate.getDate() == todayDate.getDate()
                    && curDate.getMonth() == todayDate.getMonth()
                    && curDate.getFullYear() == todayDate.getFullYear())
                    col.classList.add('today');
                else col.classList.remove('today');
                curDate.setDate(curDate.getDate() + 1);
            })
        });
    }

    function clSlide() {
        var next = document.querySelector('.button-next'),
            prev = document.querySelector('.button-prev'),
            current = document.querySelector('.button-current');

        prev.addEventListener('click', function (e) {
            e.preventDefault();
            var dt = 0;
            do {
                console.log(dt);
                curDate.setDate(curDate.getDate() - 1);
                console.log(curDate);
                dt++;
            } while (dt < 70);
            document.querySelector('.month-year-title').innerHTML = curDate.getMonthName() + ' ' + curDate.getFullYear();
            [].slice.call(document.querySelectorAll('.cl-table-row')).forEach(function (row, i) {
                [].slice.call(row.querySelectorAll('.cl-table-col')).forEach(function (col, j) {
                    col.querySelector('.day-of-month').innerHTML = ''+ curDate.getDate();
                    col.setAttribute('date-d',''+ parseInt(curDate.getDate(),10));
                    col.setAttribute('date-m',''+ parseInt(curDate.getMonth()+1,10));
                    col.setAttribute('date-y',''+ parseInt(curDate.getFullYear(),10));
                    if (curDate.getDate() == todayDate.getDate()
                        && curDate.getMonth() == todayDate.getMonth()
                        && curDate.getFullYear() == todayDate.getFullYear())
                        col.classList.add('today');
                    else col.classList.remove('today');
                    curDate.setDate(curDate.getDate() + 1);
                })
            });
        });

        next.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector('.month-year-title').innerHTML = curDate.getMonthName() + ' ' + curDate.getFullYear();
            [].slice.call(document.querySelectorAll('.cl-table-row')).forEach(function (row, i) {
                [].slice.call(row.querySelectorAll('.cl-table-col')).forEach(function (col, j) {
                    col.querySelector('.day-of-month').innerHTML = ''+ curDate.getDate();
                    col.setAttribute('date-d',''+ parseInt(curDate.getDate(),10));
                    col.setAttribute('date-m',''+ parseInt(curDate.getMonth()+1,10));
                    col.setAttribute('date-y',''+ parseInt(curDate.getFullYear(),10));
                    if (curDate.getDate() == todayDate.getDate()
                        && curDate.getMonth() == todayDate.getMonth()
                        && curDate.getFullYear() == todayDate.getFullYear())
                        col.classList.add('today');
                    else col.classList.remove('today');
                    curDate.setDate(curDate.getDate() + 1);
                })
            });
        });

        current.addEventListener('click', function (e) {
            e.preventDefault();
            init();
        });
    }

    function eventHandling() {
        trigger.forEach(function (elTrigger, i) {
            var block = document.querySelector('.hd-block[hd-block="' + elTrigger.getAttribute('hd-trigger') + '"]'),
                close = [].slice.call(block.querySelectorAll('.hd-close'));
            elTrigger.addEventListener('click', function (e) {
                e.preventDefault();
                if (!elTrigger.classList.contains('active')) {
                    trigger.forEach(function (elt, i) {
                        elt.classList.remove('active');
                    });
                    blocks.forEach(function (elb, i) {
                        elb.classList.remove('visible');
                    });
                    setTimeout(function () {
                        elTrigger.classList.add('active');
                        block.classList.add('visible');

                        if (elTrigger.getAttribute('hd-trigger') == 'add-edit-ev') {
                            if ((block.offsetWidth + elTrigger.offsetLeft + elTrigger.offsetWidth) > clBlock.offsetWidth) {
                                block.classList.remove('right');
                                block.classList.add('left');
                                block.style.left = elTrigger.offsetLeft - block.offsetWidth - 20 + 'px';
                            }
                            else {
                                block.classList.remove('left');
                                block.classList.add('right');
                                block.style.left = elTrigger.offsetLeft + elTrigger.offsetWidth + 20 + 'px';
                            }

                            if (elTrigger.offsetTop == 0) {
                                block.style.top = elTrigger.offsetTop + 'px';
                            }
                            else if ((block.offsetHeight + elTrigger.offsetTop) > clBlock.offsetHeight) {
                                block.classList.remove('top');
                                block.classList.add('bottom');
                                var i = 0;
                                do {
                                    block.style.top = elTrigger.offsetTop + elTrigger.offsetHeight - block.offsetHeight + i + 'px';
                                    i++;
                                } while (block.offsetHeight + block.offsetTop + 20 < clBlock.offsetHeight);
                            }
                            else {
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
            trigger.forEach(function (elTrigger, i) {
                if (elTrigger.classList.contains('active')) {
                    var block = document.querySelector('.hd-block[hd-block="' + elTrigger.getAttribute('hd-trigger') + '"]');
                    elTrigger.classList.remove('active');
                    block.classList.remove('visible');

                }
            })
        });
    }

    init();

    eventHandling();

    clSlide();

})();




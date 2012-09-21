(function ($) {
    'use strict';
    var pluginName = 'dateRange',
        defaults = {
            days : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            months : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            dateSeperator : ' - ',
            rangePicker : true,
            readOnly : true,
            appendSelector : null,
            startDay : 0,
            calendar : '<table></table>',
            calendarBody : '<tbody></tbody>',
            calendarBodyCell : '<td></td>',
            calendarCaption : '<caption></caption>',
            calendarContainer : '<div id="calendar-container"></div>',
            calendarHeader : '<thead></thead>',
            calendarHeaderCell : '<th></th>',
            calendarNavigationNext : '<span class="next" title="Next">&#9654;</span>',
            calendarNavigationPrev : '<span class="prev" title="Previous">&#9664;</span>',
            calendarRow : '<tr></tr>'
        };

    Date.prototype.decrement = function () {
        this.setDate(this.getDate() - 1);
    };

    Date.prototype.increment = function () {
        this.setDate(this.getDate() + 1);
    };

    function Plugin(element, options) {
        this.element = element;
        this.options = $.extend({}, defaults, options);
        this.defaults = defaults;
        this.name = pluginName;
        options = this.options;

        var container,
            i,
            dateRange,
            over = false,
            open = false;

        for (i = 0; i < options.startDay; i += 1) {
            options.days.push(options.days.shift());
        }

        function generateCalendar(selectedDate) {
            var workDate =  new Date(selectedDate),
                workRow = $(options.calendarRow),
                workCalendar = $(options.calendar),
                workCalendarBody = $(options.calendarBody),
                timeElement = '<time></time>',
                abbrElement = '<abbr></abbr>',
                workDay,
                ariaSelected = false,
                workTime,
                workCell,
                parent,
                startDate,
                endDate,
                workAbbr,
                workHeaderCell,
                workCalendarHeader,
                workNextButton,
                workPrevButton,
                workCaption,
                count = 1;

            workDate.setDate(1);
            workDay = workDate.getDay();

            while (workDay !== options.startDay) {
                workDate.decrement();
                workDay = (workDay > 0) ? workDay - 1 : 6;
            }

            while (true) {
                workTime = $(timeElement).attr('datetime', workDate.toDateString()).html(workDate.getDate());
                workCell = $(options.calendarBodyCell).append(workTime);
                ariaSelected = false;

                if ((workDate.getDate() === selectedDate.getDate()) && workDate.getMonth() === selectedDate.getMonth()) {
                    ariaSelected = true;
                }

                if (workDate.getMonth() !== selectedDate.getMonth()) {
                    workCell.attr('aria-disabled', "true");
                } else {
                    workCell.attr('aria-disabled', "false");
                }

                workCell.attr('aria-selected', ariaSelected);
                workRow.append(workCell);
                workDate.increment();

                if (workDate.getDay() === options.startDay) {
                    $(workCalendarBody).append(workRow);
                    workRow = $(options.calendarRow);
                    if (workDate.getMonth() !== selectedDate.getMonth()) {
                        break;
                    }
                }
            }

            for (i = 0; i < options.days.length; i += 1) {
                workAbbr = $(abbrElement).attr('title', options.days[i]).html(options.days[i].substring(0, 2));
                workHeaderCell = $(options.calendarHeaderCell).append(workAbbr).attr('role', 'columnheader').attr('scope', 'col');
                workCalendarHeader = $(options.calendarHeader).append(workRow.append(workHeaderCell));
            }

            $(workCalendarBody).find('[aria-disabled="false"]').on("click", function () {
                $(this).parent().parent().find('[aria-selected="true"]').attr("aria-selected", "false");
                $(this).attr("aria-selected", "true");
                if (options.rangePicker) {
                    parent = $(this).parent().parent().parent().parent();
                    startDate = parent.children().first().find('[aria-selected="true"] time').attr('datetime');
                    endDate = parent.children(':nth-child(2)').find('[aria-selected="true"] time').attr('datetime');
                    $(element).val(startDate + options.dateSeperator + endDate);
                } else {
                    $(element).val($(this).find("time").attr("datetime"));
                }
                $(element).trigger('selected');
            });

            workNextButton = $(options.calendarNavigationNext).attr('role', 'button');
            workPrevButton = $(options.calendarNavigationPrev).attr('role', 'button');

            workPrevButton.on("click", function () {
                var newDate = new Date($(this).parent().parent().find('[aria-selected="true"] time').attr('datetime'));
                newDate.setMonth(selectedDate.getMonth() - 1);
                $(this).parent().parent().replaceWith(generateCalendar(newDate));
                $(this).trigger('previous');
            });

            workNextButton.on("click", function () {
                var newDate = new Date($(this).parent().parent().find('[aria-selected="true"] time').attr('datetime'));
                newDate.setMonth(selectedDate.getMonth() + 1);
                $(this).parent().parent().replaceWith(generateCalendar(newDate));
                $(this).trigger('next');
            });

            workCaption = $(options.calendarCaption).html(options.months[selectedDate.getMonth()] + ' ' + selectedDate.getFullYear());
            workCaption.prepend(workNextButton);
            workCaption.prepend(workPrevButton);
            workCalendar.append(workCaption);
            workCalendar.append(workCalendarHeader);
            return workCalendar.append(workCalendarBody);
        }

        function parseRange(rangeString) {
            var rangeArray = rangeString.split(options.dateSeperator),
                startDate = new Date(Date.parse(rangeArray[0].split(options.seperator))),
                endDate  = new Date(Date.parse(rangeArray[1].split(options.seperator)));
            return { startDate : startDate, endDate : endDate };
        }

        function positionBelow(element, target) {
            var offset = target.offset();
            offset.top += target.outerHeight(true);
            element.offset(offset);
        }

        this.reposition = function () {
            if (open) {
                positionBelow(container, $(':focus'));
            }
        };

        $(this.element).focus(function () {
            var startDate,
                endDate;

            if (!open) {
                element = this;
                startDate = new Date();
                endDate = new Date();
                endDate.setMonth(startDate.getMonth() + 1);
                dateRange = { startDate : startDate, endDate : endDate };

                if ($(element).val() !== '') {
                    if (options.rangePicker) {
                        dateRange = parseRange($(this).val());
                    } else {
                        startDate = new Date(Date.parse($(this).val()));
                    }
                }

                if (options.rangePicker) {
                    container = $(options.calendarContainer);
                    container.append(generateCalendar(dateRange.startDate));
                    container.append(generateCalendar(dateRange.endDate));
                } else {
                    container = $(options.calendarContainer);
                    container = container.append($(generateCalendar(startDate)));

                }

                container.hover(
                    function () { over = true; },
                    function () { over = false; $(element).focus(); }
				);

                if (options.appendSelector) {
                    $(options.appendSelector).append(container);
                } else {
                    $(this).after(container);
                }

                positionBelow(container, $(this));

                $(this).trigger('open');
                open = true;
            }
        });

        $(this.element).blur(function () {
            if (open && !over) {
                container.remove();
                $(this).trigger('close');
                open = false;
            }
        });

        this.init();
    }

    Plugin.prototype.init = function () {
        var reposition = this.reposition;

        if (this.options.readOnly) {
            $(this.element).attr("readonly", "readonly");
        }

        $(window).resize(function () {
            reposition();
        });
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
            }
        });
    };
}(jQuery));
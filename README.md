#jquery.dateRange

**A single field date range picker plugin**

##Features

* No external dependancies other than jQuery
* Adds WAI-ARIA roles
* Use as either a date picker or the default range picker
* Example CSS included
* Customize any piece of generated markup
* Bind to custom events

##Use

###Initialization

    $(document).ready(function() {
        var myplugin = new $.dateRange($('input'));
    });


###Default Options

    {
        days : ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
        months : ["January","February","March","April","May","June","July","August","September","October","November","December"],
        dateSeperator : ' - ',
        rangePicker : true,
        readOnly : true,
        calendar : '<table></table>',
        calendarBody : '<tbody></tbody>',
        calendarBodyCell : '<td></td>',
        calendarCaption : '<caption></caption>',
        calendarContainer : '<div id="calendar-container"></div>',
        calendarHeader : '<thead></thead>',
        calendarHeaderCell : '<th></th>',
        calendarNavigationNext : '<span class="next" title="Next">▶</span>',
        calendarNavigationPrev : '<span class="prev" title="Previous">◀</span>',
        calendarRow : '<tr></tr>'
    }

days - Array of days as strings, useful for localization
months - Array of months as strings, useful for localization
dateSeperator - The string of characters between the two date strings
rangePicker - Set to false to use as a normal date picker
readOnly - Set to false to allow the text field to be typed into

The other options change the default markup of the calendar, you can use divs or spans instead of the table markup.

##Custom Events

jQuery.dateRange will raise different custom events that can be bound to these are:

* open
* close
* previous
* next
* selected

They can be bound to either using jQuery's `bind` or as of 1.7 `on`.

    $(document).ready(function() {

        var target = $("input").dateRange();

        target.bind('selected', function() {
            alert('User selected a date');
        });

    });

##Dependencies

There are NO additional dependencies. (Other date-pickers often require Datejs or jQuery UI)

##Tests

Tests via QUnit included in source

##License

You may use this under the terms of either the MIT License or the GNU General Public License (GPL) Version 3.
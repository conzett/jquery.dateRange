#jquery.dateRange

* Will work on multiple fields without conflict
* Lightweight, less than 200 line before minification
* No dependencies on date.js or jQuery UI
* Sample CSS included

##Use

Initialize the plugin using this method to prevent multiple instantiations

$(document).ready(function() {
	var myplugin = new $.dateRange($('input'));
});


##Options

The following options can be customized (defaults shown)

days : ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],

months : ["January","February","March","April","May","June","July","August","September","October","November","December"],

calendarClass : "calendar",

containerClass : "calendarContainer",

prevButtonText : 'Prev',

nextButtonText : 'Next',

prevButtonClass : 'prev',

nextButtonClass : 'next',

dayAbbrLength : 2, // E.g. Mo versus Mon

dayDisabledClass : "disabled",

dayActiveClass : "active",

selectedClass : "selected",

dateSeparator : " - ", // The separator between both date strings in the field

digitSeparator : "/", // The separator between the date digits, change if you want 10-19-2012 instead of 10/19/2012

monthFirst : true, // Default is US style month first, set to false for day first

readOnly : true // Sets the text fields so they can not be typed into
; (function ($, window, document, undefined) {

    var pluginName = 'dateRange',
        defaults = {
            days : ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
			months : ["January","February","March","April","May","June","July","August","September","October","November","December"],
			dateSeperator : '-',
			rangePicker : true,
            calendar : '<table></table>',
            calendarBody : '<tbody></tbody>',
            calendarBodyCell : '<td></td>',
            calendarCaption : '<caption></caption>',            
            calendarHeader : '<thead></thead>',
            calendarHeaderCell : '<th></th>',
            calendarNavigationNext : '<a>Next</a>',
            calendarNavigationPrev : '<a>Prev</a>',
            calendarRow : '<tr></tr>',
        };

    Date.prototype.decrement = function(){
    	this.setDate(this.getDate() - 1);
    }
    
    Date.prototype.increment = function(){
    	this.setDate(this.getDate() + 1);
    }  

    function Plugin(element, options) {
        this.element = element;
        this.options = $.extend({}, defaults, options);

        this._defaults = defaults;
        this._name = pluginName;
        
        var options = this.options, container, i, element, dateRange, over = false, open = false;

        function generateCalendar(selectedDate) {
            workDate =  new Date(selectedDate),
            workDate.setDate(1),
            workRow = $(options.calendarRow),
            workCalendar = $(options.calendar),
            workCalendarBody = $(options.calendarBody),
            timeElement = '<time></time>',
            abbrElement = '<abbr></abbr>',
            workDay = workDate.getDay();

            while(workDay > 0)
            {
            	workDate.decrement();
            	workDay--;
            }

            while(true)
            {
            	ariaDisabled = false;
            	workTime = $(timeElement).attr('datetime', workDate.toDateString()).html(workDate.getDate());
            	workCell = $(options.calendarBodyCell).append(workTime);

            	if(workDate.getMonth() !== selectedDate.getMonth()) ariaDisabled = true;

            	workCell.attr('aria-disabled', ariaDisabled);
            	workCell.on("click", function(event){
            		$(element).val($(this).find("time").attr("datetime"));
					$(element).trigger('selected');
				})

            	workRow.append(workCell);
            	workDate.increment();

            	if(workDate.getDay() === 0)
            	{
            		$(workCalendarBody).append(workRow);
            		workRow = $(options.calendarRow);
            		if(workDate.getMonth() !== selectedDate.getMonth()) break;
            	}
            }

			for(i=0; i < options.days.length; i++){
            	workAbbr = $(abbrElement).attr('title', options.days[i]).html(options.days[i].substring(0,2));
            	workHeaderCell = $(options.calendarHeaderCell).append(workAbbr).attr('role', 'columnheader').attr('scope', 'col');
            	workCalendarHeader = $(options.calendarHeader).append(workRow.append(workHeaderCell));
            }
            
            workCalendar.append($(options.calendarCaption).html(options.months[selectedDate.getMonth()]));
            workCalendar.append(workCalendarHeader);
            return workCalendar.append(workCalendarBody);
        }

        function parseRange(rangeString) {
			rangeArray = rangeString.split(options.dateSeperator);
			startDate = new Date(Date.parse(rangeArray[0].split(options.seperator)));
			endDate  = new Date(Date.parse(rangeArray[1].split(options.seperator)));			
        	return {startDate : startDate, endDate : endDate}
        }

        $(this.element).focus(function() {
        	if(!open){

        		element = this;
        		startDate = new Date();

        		if($(element).val() !== ''){
        			if(options.rangePicker){
        				dateRange = parseRange($(this).val());
        			}else{
        				startDate = new Date(Date.parse($(this).val()));
        			}        				
        		}
	        	
	        	container = $(generateCalendar(startDate));
				container.hover(
					function(){ over = true; },
					function(){ over = false; $(element).focus(); }
				);

	        	$(this).after(container);
	        	$(this).trigger('open');
	        	open = true;
        	}
        });

        $(this.element).blur(function() {
        	if(open && !over){
	        	container.remove();
	        	$(this).trigger('close');
	        	open = false;
        	}
        });

        this.init();
    }

    Plugin.prototype.init = function () {
    	
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
            }
        });
    }    

})(jQuery, window, document);
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
            calendarContainer : '<div id="container"></div>',         
            calendarHeader : '<thead></thead>',
            calendarHeaderCell : '<th></th>',
            calendarNavigationNext : '<span class="next">Next</span>',
            calendarNavigationPrev : '<span class="prev">Prev</span>',
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
            	ariaDisabled = false, ariaSelected = false;
            	workTime = $(timeElement).attr('datetime', workDate.toDateString()).html(workDate.getDate());
            	workCell = $(options.calendarBodyCell).append(workTime);

            	if(workDate.getMonth() !== selectedDate.getMonth()) ariaDisabled = true;
            	if(workDate.getDate() === selectedDate.getDate()) ariaSelected = true;

            	workCell.attr('aria-disabled', ariaDisabled);
            	workCell.attr('aria-selected', ariaSelected);

            	workCell.on("click", function(event){            		           		
            		$(this).parent().parent().find('[aria-selected="true"]').attr("aria-selected", "false");
            		$(this).attr("aria-selected", "true");
            		if(options.rangePicker){
            			parent = $(this).parent().parent().parent().parent();
            			startDate = parent.children().first().find('[aria-selected="true"] time').attr('datetime');
            			endDate = parent.children(':nth-child(2)').find('[aria-selected="true"] time').attr('datetime');
            			$(element).val(startDate + options.dateSeperator + endDate);
            		}else{
            			$(element).val($(this).find("time").attr("datetime"));
            		}           		
					$(element).trigger('selected');
				});

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

            workNextButton = $(options.calendarNavigationNext).attr('role', 'button');
            workPrevButton = $(options.calendarNavigationPrev).attr('role', 'button');

            workPrevButton.on("click", function(){
            	var newDate = new Date(selectedDate);
            	newDate.setMonth(selectedDate.getMonth() -1);
            	$(this).parent().parent().replaceWith(generateCalendar(newDate));
            	$(this).trigger('previous');
            });

            workNextButton.on("click", function(){
            	var newDate = new Date(selectedDate);
            	newDate.setMonth(selectedDate.getMonth() +1);
            	$(this).parent().parent().replaceWith(generateCalendar(newDate));
            	$(this).trigger('next');
            });
            
            workCaption = $(options.calendarCaption).html(options.months[selectedDate.getMonth()]);
            workCaption.prepend(workNextButton);
            workCaption.prepend(workPrevButton);
            workCalendar.append(workCaption);
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
        		endDate = new Date();
        		endDate.setMonth(startDate.getMonth() +1);
        		dateRange = {startDate : startDate, endDate : endDate};

        		if($(element).val() !== ''){
        			if(options.rangePicker){
        				dateRange = parseRange($(this).val());
        			}else{
        				startDate = new Date(Date.parse($(this).val()));
        			}        				
        		}

        		if(options.rangePicker){
        			container = $(options.calendarContainer);
        			container.append(generateCalendar(dateRange.startDate));
        			container.append(generateCalendar(dateRange.endDate));
        		}else{
        			container = $(generateCalendar(startDate));
        		}	        	
	        	
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
@pavlov.specify "DateRange", ->
	[startDate, endDate] = []
	container = $('body').find("#calendar-container")
	wait = (time)->
		date = new Date()
		curDate = new Date() while(curDate - date < time)

	describe "DateRange", ->
		before ->
			$('#qunit-fixture').append('<input type="text" id="target"/>')
			$('#target').dateRange()

		describe "when the plugin is initialized", ->
			it "should decorate the Date prototype"
			it "should position the calendar under the target input field"
			it "should disable the target input field if readonly is true"
			it "should not insert the calendar containers yet", ->
				equal(container.length, 0, "Expect 0 calendar containers before focus" )

		describe "when the user focuses on input field", ->
			before ->
				$('#target').focus()
				wait(500)
				startDate = new Date()
				endDate = new Date()
				endDate.setMonth(startDate.getMonth() + 1)


			it "should insert the calendar container", ->
				equal(container.length, 1, "Expect 1 calendar container after focus" )
			it "should clear the initial value of the target field", ->
				equal($('#target').val(), "", "Expect initial value to be empty" )
			it "should append the calendar into the target container"
			it "should generate two calendars if the daterange option is true"
			it "should highlight the startDate"
			it "should highlight the endDate"


			describe "when the user clicks on a date on the calendar", ->
				before ->
					$('td time[datetime="'+startDate.toDateString()+'"]').parent().click()

				it "should write the clicked startDate into the input field", ->
					equal($('#target').val(), startDate.toDateString()  + " - " + endDate.toDateString(), "Correct value is now in text field" )
				it "should write the clicked endDate into the input field"
				it "should close the calendar"

		describe "when the window size changes", ->
			it "should reposition the calendar under the input field"

		describe "when the user clicks away", ->
			it "should hide the calendar"

		describe "generated calendar", ->
			it "should have the user specified startDate"
			it "should have the user specified endDate"

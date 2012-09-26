@pavlov.specify "DateRange", ->
	containerId = "#calendar-container"
	container = -> $('body').find(containerId)
	startDate = new Date()
	endDate = new Date()
	endDate.setMonth(startDate.getMonth() + 1)

	wait = (time)->
		date = new Date()
		curDate = new Date() while(curDate - date < time)

	describe "DateRange", ->
		before ->
			$('#qunit-fixture').append('<input type="text" id="target"/>')
			$('#target').dateRange()

		describe "when the plugin is initialized", ->
			it "should decorate the Date prototype", ->
				assert(Date.prototype.increment).isDefined()
				assert(Date.prototype.decrement).isDefined()
			it "should not insert the calendar containers yet", ->
				equal(container().length, 0, "Expect 0 calendar containers before focus" )

		describe "with default options", ->
			describe "when the user focuses on input field", ->
				before ->
					$('#target').focus()
					wait(500)
					startDate = new Date()
					endDate = new Date()
					endDate.setMonth(startDate.getMonth() + 1)


				it "should insert the calendar container", ->
					equal(container().length, 1, "Expect 1 calendar container after focus" )
				it "should clear the initial value of the target field", ->
					equal($('#target').val(), "", "Expect initial value to be empty" )
				it "should append the calendar after the target input field", ->
					assert($('#target').next().attr("id")).isEqualTo(containerId.slice(1))

				describe "should position the calendar below the target input field", ->
					[containerOffset, targetOffset] = []
					before ->
						containerOffset = container().offset()
						targetOffset = $('#target').offset()

					it "by default", ->
						assert(targetOffset.left).isEqualTo(containerOffset.left)

						assert(targetOffset.top).isEqualTo(containerOffset.top - $('#target').outerHeight(true))

					it "even when the window size changes", ->
						window.resizeTo(300,600)
						assert(targetOffset.left).isEqualTo(containerOffset.left)

						assert(targetOffset.top).isEqualTo(containerOffset.top - $('#target').outerHeight(true))


				it "should generate two calendars", ->
					assert(container().find("table").length).isEqualTo(2, "2 tables found")

				it "should highlight the startDate", ->
					highlitedDateString = container().find("table:first").find("[aria-selected='true']").find("time").attr("datetime")
					todaysDateString = (new Date()).toDateString()
					assert(todaysDateString).isEqualTo(highlitedDateString)

				it "should highlight the endDate", ->
					highlitedDateString = container().find("table:eq(1)").find("[aria-selected='true']").find("time").attr("datetime")
					monthFromTodaysDateString = endDate.toDateString()

					assert(monthFromTodaysDateString).isEqualTo(highlitedDateString)

				describe "when the user clicks on a date on the calendar", ->
					before ->
						selector = "td time[datetime='#{startDate.toDateString()}']"
						todayCell = $(selector)
						todayCellParent = todayCell.parent()
						todayCellParent.click()

					it "should write the correct startDate into the input field", ->
						equal($('#target').val(), startDate.toDateString()  + " - " + endDate.toDateString(), "Correct value is now in text field" )

				describe "when the user clicks away", ->
					before ->
						$("#target").focus().blur()

					it "should hide the calendar", ->
						assert(container().length).isEqualTo(0)


		describe "with custom options", ->
			it "should append the calendar into a new appendage if appendSelector is specified", ->
				# Setup
				$('#target').remove()
				$('#qunit-fixture').append('<div id="new_appendage"/><input type="text" id="target"/>')
				$('#target').dateRange(appendSelector: "#new_appendage")
				$("#target").focus()

				# verify
				assert($('#new_appendage > div').attr("id")).isEqualTo(containerId.slice(1))

			it "should disable the target input field if readonly is true", ->
				# Setup
				$('#target').remove()
				$('#qunit-fixture').append('<input type="text" id="target"/>')
				$('#target').dateRange(readonly: true)
				$("#target").focus()

				assert($("#target").attr("readonly")).isEqualTo("readonly")


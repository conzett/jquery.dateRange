function wait(time) 
{
	var date = new Date();
	var curDate = null;
	do { curDate = new Date(); } 
	while(curDate-date < time);
} 

test("Basic tests", function() {

	$('#qunit-fixture').append('<input type="text" id="target"/>');
    $('#target').dateRange();

    var container = $('body').find("#calendar-container");

    equal(container.length, 0, "Expect 0 calendar containers before focus" );

    $('#target').focus();
    wait(500);
    container = $('body').find("#calendar-container");

	equal(container.length, 1, "Expect 1 calendar container after focus" );
	equal($('#target').val(), "", "Expect initial value to be empty" );

	var startDate = new Date();
	var endDate = new Date();
	endDate.setMonth(startDate.getMonth() + 1);

	$('td time[datetime="'+startDate.toDateString()+'"]').parent().click();

	equal($('#target').val(), startDate.toDateString()  + " - " + endDate.toDateString(), "Correct value is now in text field" );

});
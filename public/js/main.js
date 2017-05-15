$(document).ready(function(){

	$('.edit-recipe').on('click',function(){
		$('#edit-form-name').val($(this).data('name'));
		$('#edit-form-ingredientes').val($(this).data('ingredientes'));
		$('#edit-form-directions').val($(this).data('directions'));
		$('#edit-form-id').val($(this).data('id'));

	});

	$('.input-group input').each(function() {
	    $(this).datepicker('clearDates');
	});


	var options = {
		now:"00:00",

	};

	$('.timepicker').wickedpicker('options');

});



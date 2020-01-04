function initFormField(field) {
	const inputValue = field.val();

	field.val('');

	field.intlTelInput({
		// initialCountry: 'us',
		geoIpLookup: function(callback) {
			$.get('//ipinfo.io', function() {}, 'jsonp').always(function(resp) {
				var countryCode = (resp && resp.country) ? resp.country : '';
				callback(countryCode);
			});
		},
		preferredCountries: [],
		excludeCountries: [ 'kp' ],
		formatOnDisplay: false,
		separateDialCode: true,
		nationalMode: false
	});

	field.intlTelInput('setNumber', inputValue);
}


jQuery(document).ready(function() {
	var form = jQuery('.gform_wrapper form');
	var field = jQuery('.gfield input[type=tel]');

	/**
	 * Update the hidden input on form submit
	 */
	form.submit(function(e) {
		field.each(function (index, value){
			jQuery(this).val(jQuery(this).intlTelInput('getNumber'));
		});
	});
});

jQuery(document).on('gform_post_render', function(){
	const field = jQuery('.gfield input[type=tel]');

	initFormField(field);
});

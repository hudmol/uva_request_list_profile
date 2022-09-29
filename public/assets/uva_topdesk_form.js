$(function() {

    // all items selected on load
    $('.rl-item-check').prop('checked', true);

    // reset user type
    $(".rl-uva-user-type-fields").hide();
    $('#user_type_select>option:eq(0)').prop('selected', true);

    // reset terms and conditions
    $('input[name=terms_and_conditions]').prop('checked', false);

    // hide unneeded more info link
    $('.rl-ha-expand-help').hide();

  $.fn.combobox.defaults.template = '<div class="combobox-container input-group"><input type="hidden" /><input type="text" autocomplete="off"/><span class="input-group-btn btn dropdown-toggle" data-dropdown="dropdown"><span class="caret"/><span class="combobox-clear"><span class="icon-remove"></span></span></span></div>';
  $(function() {
    var initDateFields = function(scope) {
      scope = scope || $(document.body);
      $(".date-field:not(.initialised)", scope).each(function() {
        var $dateInput = $(this);

        if ($dateInput.parent().is(".input-group")) {
          $dateInput.parent().addClass("date");
        } else {
          $dateInput.wrap("<div class='input-group date'></div>");
        }

        $dateInput.addClass("initialised");

        var $addon = $("<span class='input-group-addon'><i class='glyphicon glyphicon-calendar'></i></span>");
        $dateInput.after($addon);

        $dateInput.datepicker($dateInput.data());

        $addon.on("click", function() {
          $dateInput.focus().select();
        });
      });
    };
    initDateFields();
  });


  $("#user_type_select").change(function() {
    var selected = this.selectedOptions[0];

    $(".rl-uva-user-type-fields").slideUp();

    if (selected.value == 'internal') {
      $('.rl-uva-user-type-external-fields').hide();
      $(".rl-uva-user-type-internal-fields").show();
      $(".rl-uva-user-type-fields").slideDown();
    } else if (selected.value == 'external') {
      $('.rl-uva-user-type-internal-fields').hide();
      $(".rl-uva-user-type-external-fields").show();
      $(".rl-uva-user-type-fields").slideDown();
    } else {
    }
  });


  $('.rl-ha-list-input').on('change keyup paste', function() {
    $(this).css('border', '1px solid #ccc');
    var srcVal = $(this).val();
    if (srcVal.length > 20) { srcVal = srcVal.substr(0,20) + '...' }
    var itemForms = $('.rl-ha-item-form-' + $(this).parents('.rl-ha-options-form').data('request-type'));
    itemForms.find('[name^="' + $(this).attr('name') + '_"]').attr('placeholder', srcVal);

    if ($(this).is('select')) {
      var selected = this.selectedOptions[0].text;
      if (selected != '...') { selected = '(' + selected + ')' }

      itemForms.find('select[name^="' + $(this).attr('name') + '_"]').children('option:first-child').text(selected);
    }
  });

  $('.rl-ha-item-input').on('change keyup paste', function() {
    var allInputs = $(this).parents('.rl-ha-item-form-table').find('.rl-ha-item-input');
    if (allInputs.filter(function() { return $(this).val() != ''}).length > 0) {
      $(this).parents('.rl-list-item').find('.rl-edited-indicator').show();
    } else {
      $(this).parents('.rl-list-item').find('.rl-edited-indicator').hide();
    }
  });

  $('.rl-ha-expand-help').click(function(e) {
    $('.rl-ha-expanded-help').slideToggle('normal',
					  function() {
					      var expandHelp = $('.rl-ha-expand-help');
					      var label = expandHelp.data('expand-label');
					      if ($(this).is(':visible')) {
						  label = expandHelp.data('collapse-label');
					      }
					      expandHelp.html(label);
      });
  });

  $('.rl-uva-list-input').on('change keyup paste', function(e) {
      $(this).closest('.form-group').css('background', 'initial');
  });

  $('.uva-submit-requests').click(function(e) {
      e.preventDefault();
	    var self = window.request_list;
	    var startListLength = self.getList().length;
	    var handler = $('#rl-handler-uva_handler');
	    var checkedItems = handler.find('.rl-list').children('.rl-list-item').has('.rl-item-check:checked');

	    // Don't allow submission of an empty list
	    if (checkedItems.length == 0) {
	        self.showAlertModal(HARVARD_AEON_MESSAGES['empty_list_error_message']);
	        return false;
	    }

	    // Don't allow submission if required fields are unfilled
	    var unfilled_fields = $('.rl-uva-list-input:visible').filter('.required')
                                                           .filter(function() {
                                                               if ($(this).is('[type=checkbox]')) {
                                                                   return !$(this).prop('checked');
                                                               } else {
                                                                   return $(this).val() == "";
                                                               }
                                                           });

      const validationFails = Array();

	    var libcard = $('.rl-uva-list-input:visible').filter('[name=library_card]');
      if (libcard.length && !libcard.val().trim().match(/92\d\d\d\d\d\d\d/)) {
          validationFails.push(libcard);
      }

      // @uva.nl, @student.uva.nl, @amc.uva.nl or @hva.nl
	    var internalEmail = $('.rl-uva-list-input:visible').filter('[name=internal_email]');
      if (internalEmail.length && !internalEmail.val().trim().match(/^\S+\@(uva|student\.uva|amc\.uva|hva)\.nl$/)) {
          validationFails.push(internalEmail);
      }

	    if (unfilled_fields.length > 0 || validationFails.length > 0) {
          var msg = '';
          if (unfilled_fields.length > 0) {
	            msg += '<p>' + HARVARD_AEON_MESSAGES['unfilled_fields_error_message'] + "</p><ul>";
              unfilled_fields.each(function(ix, uf) { msg += '<li>' + $(uf).closest('.form-group').children('label').text() + "</li>"; });
              msg += '</ul>';
          }

          if (validationFails.length > 0) {
	            msg += '<p>Please enter a correct value for:</p><ul>';
              $(validationFails).each(function(ix, vf) { msg += '<li>' + $(vf).closest('.form-group').children('label').text() +
                                                                '<br/>' + $(vf).attr('title') + "</li>"; });
              msg += '</ul>';
          }

	        self.showAlertModal(msg);
	        unfilled_fields.closest('.form-group').css('background', '#fdd');
	        $(validationFails).each(function(ix, vf) { $(vf).closest('.form-group').css('background', '#fdd'); });
	        return false;
	    }

      // build up the request data
      var requestData = {};
      var items = {};

      $('.rl-form').find('input').each(function(ix, input) {

          // skip hidden list inputs
          if ($(input).hasClass('rl-uva-list-input') && $(input).is(':hidden')) {
              return;
          }

          // skip unchecked items
	        if ($(input).parents('.rl-list-item').length && !$(input).parents('.rl-list-item').find('.rl-item-check').is(':checked')) {
              return;
          }

          var name = $(input).prop('name');
          var value = $(input).val();

          if (name.startsWith('item-check-')) {
              return;
          }

          if (name == 'Request') {
              return;
          }

          var splitName = name.split('__');
          if (splitName.length > 1) {
              var key = splitName.slice(-1)[0];
              if (!items.hasOwnProperty(key)) {
                  items[key] = {};
              }
              splitName.pop();
              items[key][splitName.join('__')] = value;
          } else {
              requestData[name] = value;
          }
      });

      // special handling for desired materials
      $('.rl-form').find('.rl-list-item textarea').each(function(ix, textarea) {
          $(textarea).closest('.rl-list-item').find('.rl-item-form').find('input[name=Request]').each(function(ix, input) {
              // if the item is unchecked then there won't be an entry in items
              if (items.hasOwnProperty($(input).val())) {
                  items[$(input).val()][$(textarea).prop('name')] = $(textarea).val();
              }
          });
      });

      requestData['items'] = Object.values(items);

      var rdhi = $("<input>", {type: 'hidden', name: 'request_data', value: JSON.stringify(requestData)})

      handler.find('.rl-form').append(rdhi);

	    handler.find('.rl-list').children('.rl-list-item').has('.rl-item-check:checked').each(function(ix, rli) {
          self.removeFromList($(rli).data('uri'), true, true);
	    });

      handler.find('.rl-form').submit();

      return true;
  });

});

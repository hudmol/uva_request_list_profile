$(function() {

    // all items selected on load
    $('.rl-item-check').prop('checked', true);

    // reset user type
    $(".rl-uva-user-type-fields").hide();
    $('#user_type_select>option:eq(0)').prop('selected', true);

    // reset terms and conditions
    $('input[name=terms_and_conditions]').prop('checked', false);

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

});

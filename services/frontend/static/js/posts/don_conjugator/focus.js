// register jQuery extension
jQuery.extend(jQuery.expr[':'], {
    focusable: function (el, index, selector) {
        // return $(el).is('a, button, :input, [tabindex]');
        return $(el).is('.answer, #next-button');
    }
});

$(document).on('keypress', 'input,select,button', function (e) {
    
    if (e.which == 13) {
        if (e.target.tagName == "INPUT") {
            e.preventDefault();
        }
        // Get all focusable elements on the page
        var $canfocus = $(':focusable');
        var index = $canfocus.index(document.activeElement) + 1;
        
        if (index >= $canfocus.length) index = 0;
        $canfocus.eq(index).focus();
    }
});
(function(window, document, undefined) {
  $(document).ready(function() {
    var $wrapper = $('#wrapper'),
    $main_icon = $('#main_icon');

    $("#menu-toggle").click(function(e) {
      e.preventDefault();
      $wrapper.toggleClass("active");

      if (!$wrapper.hasClass('active')) {
        $main_icon
        .addClass('glyphicon-chevron-right');
      } else {
        $main_icon
        .removeClass('glyphicon-chevron-right');
      }
    });

  });
})(window, document);

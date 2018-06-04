(function (window, $) {
  "use strict";
  $(document).ready(function () {
    $(".gist-picker").each(function () {
      createGistPicker($(this));
    });
  });

  function createGistPicker ($element) {
    const titles = $element.find(".gist-wrapper").map(function () {
      return $(this).data("title");
    }).get();
    createPickerButtons($element, titles);
    $element.find(".gist-picker-button").first().click();
  }

  function createPickerButtons($gistPicker, titles) {
    titles.slice().reverse().forEach(title => {
      $gistPicker.prepend(
        $("<button />")
        .addClass("gist-picker-button")
        .text(title)
        .click(buttonClickFactory($gistPicker))
      );
    });
  }

  function buttonClickFactory ($gistPicker) {
    return function () {
      const $button = $(this);
      showGist($gistPicker, $button.text());
      $gistPicker.find(".gist-picker-button").removeClass("active");
      $button.addClass("active");
    }
  }

  function showGist($gistPicker, title) {
    const $gists = $gistPicker.find(".gist-wrapper");
    $gists.each(function (index) {
      const $gist = $(this);
      if ($gist.data("title") === title) {
        $gist.show();
      } else {
        $gist.hide();
      }
    });
  }

})(window, $);

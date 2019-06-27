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

  //----------- HIDE DATES FOR OLD POSTS ------------//

  const HIDE_POSTS_CUTOFF_S = 6 * 86400000;  // days

  $(document).ready(() => {
    $('.dt-published').each(function () {
      const $this = $(this);

      const today = new Date();
      const date = new Date($this.attr('datetime'));

      console.log(today.getTime() - date.getTime(), HIDE_POSTS_CUTOFF_S, $this.attr('datetime'));

      if (today.getTime() - date.getTime() < HIDE_POSTS_CUTOFF_S) {
        $this.show();
      }
    });
  });

})(window, $);

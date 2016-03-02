
function initPortfolio() {
    
    function createGifSquare(project, index) {
        var open = "<li data-target='#image-carousel' data-slide-to='" + index + "'><div ";
        var _class = " class='ch-item' ";
        if (index === 0) {
            _class = " class='ch-item selected'";
        }
        var style = ' style=\"background-image: url(\'images/' + project.image + '.gif\')">';
        var info = "<div class='ch-info'><h3>" + 
                        project.title + "</h3><p>" + 
                        project.blip + "</p></div>";
        var close = "</li></div>";
        var html = open + _class + style + info + close;
        $("#gif-list").append(html);
    }
    function createCarouselIndicator(project, index) {
        var html = "<li data-target='#image-carousel'" + 
                      " data-slide-to='" + index + "'";
        if (index === 0) {
            html += " class='active'";
        }
        html += "></li>";
        $("#indicators").append(html);
    }
    function createCarouselImage(project, index) {
        var html = "<div class='item ";
        if (index === 0) {
            html += " active";
        }
        html += "'><div class='carousel-image' style=\"background-image: url('images/" + project.image + ".png') \"</div>'>" +
                "<div class='carousel-caption'><h3>" + project.title + "</h3>" +
                "<p>" + project.description + "</p></div></div>";
        $("#carousel-wrapper").append(html);
    }
    for (var i = 0; i < Projects.length; i++) {
        createGifSquare(Projects[i], i);
        createCarouselIndicator(Projects[i], i);
        createCarouselImage(Projects[i], i);
    }
    function selectProject(index) {
       var project = Projects[index];
        $("#descriptions h1").text(project.title);
        $("#descriptions h4").text(project.technologies.join(", "));
        $("#descriptions p").html(project.about);
        $("#descriptions h6").html("<a href='" + project.repository + "'>GitHub Repository</a>");
        var n = index + 1;
        $("#gif-list li div.ch-item").removeClass("selected");
        $("#gif-list li:nth-child(" + n + ") div.ch-item").addClass("selected"); 
    }
    $(".ch-item").on("click", function () {
        console.log(this);
        $("html, body").animate({
            scrollTop: $(document).height()
        }, "slow");
    });

    $("#image-carousel").on("slid.bs.carousel", function () {
        var index = $(this).find(".active").index();
        selectProject(index);
    });
    $('.carousel-control.left').click(function() {
        $('#image-carousel').carousel('prev');
    });

    $('.carousel-control.right').click(function() {
        $('#image-carousel').carousel('next');
    });
  
    selectProject(0);

}
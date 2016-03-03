$(document).ready(function () {

    $("#a-nav, #dw-nav").on("click", function () {
        $(".zoomContainer").remove();
        $("#main-container").load("views/about.html");
    });
    $("#s-nav").on("click", function () {
        $("#main-container").load("views/skills.html", initSkills);
    });
    $("#p-nav").on("click", function () {
        $(".zoomContainer").remove();
        $("#main-container").load("views/portfolio.html", initPortfolio);
    });

    $("#main-container").load("views/portfolio.html", initPortfolio);

});
var PROJECTS = [
    {
        title: "Social ME",
        description: "A messenger app where users can add friends, start group chats, and send photo messages - all in real-time",
        blip: "MEAN Stack + Sockets",
        about: "Using a combination of sockets and ajax, the user never needs to leave the page.  <a href='http://52.36.153.231'>The site</a> is responsive to the browser size to give the optimal experience.  Behind the scenes is a RESTful API communicating with a NoSQL Database.",
        technologies: [
            "Angular", "Node.js", "Express.js", "MongoDB", "BootStrap", "iOS", "Socket.io"
        ],
        repository: "https://github.com/David-Wolgemuth/social-me",
        image: "social-me"
    },
    {
        title: "Asteroid Man",
        description: "One-button FallDown-inspired game, optimized for mobile browsers",
        blip: "HTML 5 Canvas + JavaScript",
        about: "Using the HTML 5 canvas and plain JavaScript, it can be easily enjoyed on mobile. No downloads / installation required.  <a href='http://david-wolgemuth.github.io/asteroid-man/'>Play it here</a> and be sure to turn on your audio.",
        technologies: [
            "HTML 5 Canvas", "JavaScript", "jQuery", "Sprite-Sheets", "WebAudioAPI"
        ],
        repository: "https://github.com/David-Wolgemuth/asteroid-man",
        image: "asteroid-man"
    },
    {
        title: "Musical Trivia",
        description: "iOS Multiplayer Trivia Game testing your understanding of music theory",
        blip: "iOS + Node.js / Sockets",
        about: "Play \"Zen\" mode, against the clock, or against your friends to test your knowledge of modal key-signatures, triads, and ability to distinguish intervals played by synthesizer.",
        technologies: [
            "Swift", "iOS", "AudioKit", "Node", "Socket.io"
        ],
        repository: "https://github.com/David-Wolgemuth/MusicalTrivia",
        image: "musical-trivia"
    },
    {
        title: "Mahjong Solitaire",
        description: "The classic game of mahjong",
        blip: "tKinter Canvas + Python",
        about: "I had so much fun with this project and consider it the nail in the coffin of my deciding to pursue a career in software.  The biggest challenges were producing the 3d stack illusion and registering mouse-clicks on the correct tiles.",
        technologies: [
            "Python", "tKinter canvas"
        ],
        repository: "https://github.com/David-Wolgemuth/Mahjong",
        image: "mahjong"
    },
    {
        title: "W.O.T.W.",
        description: "OSX Platformer, don't let the rectangles hit you!",
        blip: "Python + Pygame",
        about: "10 levels of madness and various AI bad-guys who fly, jump and shoot at you.  Keeps track of high scores and unlocked levels.",
        technologies: [
            "Python", "Pygame"
        ],
        repository: "https://github.com/David-Wolgemuth/Wrath-of-the-Wrectangles",
        image: "wotw",
    },
    {
        title: "Wake Racer Records",
        description: "Website for atheletes to create and compare times as they train",
        blip: "PHP Codeignitor + MySQL",
        about: "jQuery and ajax enable the user to seamlessly browse and filter records in the database.  90% of this project was worked on while my partner and I were on opposite sides of the country and had to rely on github and video-conferencing.",
        technologies: [
            "PHP", "Apache", "Codeignitor", "MySQL", "jQuery", "BootStrap"
        ],
        repository: "https://github.com/David-Wolgemuth/wake-racer",
        image: "wake-racer"
    }
];


$(document).ready(function () {
    PROJECTS.forEach(function (project) {
        var html =  "<div class=\"project row\">" + 
                        "<img class=\"img-responsive col-md-6 col-lg-6\" alt=\"" + project.title + "\" src=\"images/" + project.image + ".png\">" +
                        "<div class=\"col-md-6 col-lg-6\">" + 
                            "<h1>" + project.title + " <small>" + project.blip + "</small></h1>" +
                            "<p>" + project.about + "</p>" +
                            "<a href=\"" + project.repository + "\">GitHub Respository</a>" +
                        "</div>" +
                    "</div><hr class=\"blue\">";
        $("#projects").append(html);
    });

});
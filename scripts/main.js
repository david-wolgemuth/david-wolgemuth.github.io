
var previewModal = document.getElementById("preview-modal");
var previewModalContent = document.getElementById("preview-modal-content");

window.onclick = function (event)
{
    if (event.target == previewModal) {
        previewModalContent.innerHTML = "";
        previewModal.style.visibility = "hidden";
    }
};

(function addProjectsToParent()
{
    var projects = document.getElementById("projects");
    for (var i = 0; i < PROJECTS.length; i++) {
        var div = createProjectElement(PROJECTS[i]);
        projects.appendChild(div);
        if (i != PROJECTS.length - 1) {
            var hr = constructElement({ tag: "hr", class: "blue" });
            projects.appendChild(hr);
        }
    }
}) ();

function createProjectElement(project)
{
    var div = constructElement({ tag: "div", class: "project row" });
    div.appendChild(constructElement({ 
        tag: "img", 
        class: "img-responsive col-md-6 col-lg-6" ,
        alt: project.title,
        src: "images/projects/" + project.image + ".png"
    }));
    var text = constructElement({ tag: "div", class: "col-md-6 col-lg-6" });
    appendChildren(text, [{ 
        tag: "h3", 
        html: project.title + " <small> " + project.blip + "</small>" 
    }, {
        tag: "p",
        html: project.description
    }, {
        tag: "p",
        html: project.about
    }]);

    var links = constructElement({ tag: "div", class: "links" });
    links.appendChild(constructElement({
        tag: "a",
        href: project.repository,
        html: "Check Out the Code"
    }));
    if (project.site) {
        links.appendChild(constructElement({
            tag: "a",
            href: project.site,
            html: "Visit the LIVE</strong> Site!"
        }));
    }

    var preview = constructElement({
        tag: "button",
        html: "See It In Action",
        class: "btn btn-blue btn-block"
    });
    preview.onclick = function ()
    {
        var img = constructElement({
            tag: "img",
            src: "images/gifs/" + project.image + ".gif",
            alt: project.title,
            class: "img img-responsive"
        });
        previewModal.style.visibility = "visible";
        previewModalContent.appendChild(img);
    };
    links.appendChild(preview);
    text.appendChild(links);

    div.appendChild(text);

    return div;
}

function appendChildren(parent, children)
{
    children.forEach(function (child) {
        parent.appendChild(constructElement(child));
    });
}

function constructElement(args)
{
    if (!args.tag) {
        return;
    }
    var element = document.createElement(args.tag);
    element.innerHTML = args.html || "";
    element.className = args.class || "";
    element.src = args.src;
    element.alt = args.alt;
    element.img = args.img;
    element.href = args.href;
    return element;
}


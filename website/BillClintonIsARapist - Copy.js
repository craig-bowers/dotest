const url = new URL("/website/", "http://localhost:8000/");
let currentPath = url.pathname;

let filesDiv = document.querySelector("[data-files");
let selector = document.querySelector("[data-selector]");

selector.addEventListener("change", () => {
    selector.value;
});


async function fileListUpdate(path) {
    let files;
    let isFolder;
    files = await GET(path).then(resp => {
        files = resp;
    }, err => {
        if (err) console.error(err);
    }).then(() => {
        isFolder = files.endsWith('directoryIdentifier');
    }).then(() => {
        if (!isFolder) throw false;
        files = files.slice(0, files.indexOf("directoryIdentifier"));
        currentPath = path;
        filesDiv.innerHTML = "";
        selector.innerHTML = "";
        let ul = document.createElement("ul");
        ul.setAttribute("data-ul", '');
        fileReg = /.*/g;
        const options = files.match(fileReg);
        for (let opt of options) {
            if (opt.length > 0) {
                let li = document.createElement("li");
                li.innerText = opt;
                li.setAttribute("data-li", '')
                ul.append(li);
                option = document.createElement("option");
                option.innerText = opt;
                selector.append(option);
            }
        }
        filesDiv.append(ul);
    });
}

async function GET(path) {
    try {
        let resp = await fetch(path, {
            method: "GET",
            headers: {
                'Content-type': 'text/plain',
            }
        });
        return await resp.text();
    }
    catch (err) {
        if (err) throw err;
    }
}

let content = document.querySelector("[data-content]");

async function fillTextArea(path) {
    GET(path).then(resp => {
        content.value = resp;
    });
}

// First load
(async () => {
    await fileListUpdate(currentPath);
    fillTextArea(currentPath + selector.value);
})();


let loadBtn = document.querySelector("[data-load]"); // Load btn node

loadBtn.addEventListener("click", async event => {
    event.preventDefault();
    let downURL = currentPath + selector.value + '/';
    fileListUpdate(downURL).catch(resp => {
        if (resp == false) fillTextArea(currentPath + selector.value);
    });

});

let up = document.querySelector("[data-up]"); // Folder up

up.addEventListener("click", async event => {
    event.preventDefault();
    upURL = currentPath.slice(0, currentPath.lastIndexOf("/", currentPath.length - 2) + 1);
    try {
        if (currentPath == "/website/") console.log("You can't go up");
        else if (currentPath == "/website/") throw "WTF you doing m8?";
        else await fileListUpdate(upURL);
        currentPath = upURL;
    } catch (err) {
        if (err) console.error(err);
    }
});

content.addEventListener("change", (event) => { // Updates textarea value
    content.value = event.target.value;
});

let save = document.querySelector("[data-save]");

// async function SAVE(path, content) {
//     try {
//         let resp = await fetch(path)
//     }
// }
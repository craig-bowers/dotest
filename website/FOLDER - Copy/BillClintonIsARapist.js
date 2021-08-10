const url = new URL("/website", "http://localhost:8000/");
let currentPath = url.pathname;

let filesDiv = document.querySelector("[data-files");
let selector = document.querySelector("[data-selector]");

selector.addEventListener("change", () => {
    selector.value;
});


async function fileListUpdate(path) {
    let files;
    try {
        files = await GET(path);
    } catch (err) {
        if (err) console.error(err);
    } finally {
        if (files.isDirectory == "false") throw false;
        currentPath = path;
        if (!currentPath.endsWith("/")) {
            currentPath = path += "/";
        }
        filesDiv.innerHTML = "";
        selector.innerHTML = "";
        let ul = document.createElement("ul");
        ul.setAttribute("data-ul", '');
        fileReg = /.*/g;
        const options = files.body.match(fileReg);
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
    };
}

async function GET(path) {
    if (!path.startsWith("/website")) {
        throw "WTF you doing m8?";
    }
    let fetched = {};
    try {
        let resp = await fetch(path, {
            method: "GET",
            headers: {
                'Content-type': 'text/plain',
            }
        });
        fetched.body = await resp.text();
        fetched.isDirectory = await resp.headers.get('isDirectory');
    } catch (err) {
        if (err) throw err;
    } finally {
        return fetched;
    }
}

let content = document.querySelector("[data-content]");

async function fillTextArea(path) {
    try {
        await GET(path).then(resp => {
            content.value = resp.body;
        });
    } catch (err) {
        if (err) console.error(err);
    }
}


async function freshLoad() {
    await fileListUpdate(currentPath);
    fillTextArea(currentPath + selector.value);
};
freshLoad();

let loadBtn = document.querySelector("[data-load]"); // Load btn node

loadBtn.addEventListener("click", async event => {
    event.preventDefault();
    let downURL = currentPath + selector.value;
    try {
        await fileListUpdate(downURL);

    } catch (isDirectory) {
        if (!isDirectory) {
            fillTextArea(currentPath + selector.value);

        }
    }
});

let up = document.querySelector("[data-up]"); // Folder up

up.addEventListener("click", async event => {
    event.preventDefault();
    upURL = currentPath.slice(0, currentPath.lastIndexOf("/", currentPath.length - 2) + 1);
    try {
        if (currentPath == "/website/") {
            throw "You can't go up";
        }
        else if (!currentPath.startsWith("/website/")) {
            throw "WTF you doing m8?";
        }
        else await fileListUpdate(upURL);
        currentPath = upURL;
    } catch (err) {
        if (err) console.error(err);
        currentPath = "/website/";

    }
});

content.addEventListener("change", (event) => { // Updates textarea value
    content.value = event.target.value;
});

let save = document.querySelector("[data-save]");

async function SAVE(path) {
    try {
        let resp = await fetch(path, {
            method: "PUT",
            headers: {
                'Content-type': 'text/plain'
            },
            body: content.value
        });
    } catch (err) {
        if (err) throw err;
    }
}

save.addEventListener("click", async event => {
    event.preventDefault();
    await SAVE(currentPath + selector.value);
});

let del = document.querySelector("[data-delete]");

async function DELETE(path) {
    try {
        await fetch(path, {
            method: "DELETE"
        });
    } catch (err) {
        if (err) console.error(err);
    }
}

del.addEventListener("click", async event => {
    event.preventDefault();
    try {
        await DELETE(currentPath + selector.value);
        freshLoad();
    } catch (err) {
        console.error(err)
    }
});
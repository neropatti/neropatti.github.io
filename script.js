if (navigator.getAutoplayPolicy("mediaelement") !== "disallowed") {
    let vids = [...document.getElementsByTagName('video')];
    vids.forEach(x => {
        if (x.hasAttribute("neropatti_disable_controls")) {
            x.controls = false;
        }
    })
}


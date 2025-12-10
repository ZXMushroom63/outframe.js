/**
 * keep track of which elements have been popped out
 * @type {Set<HTMLElement>}
 */
const outframedElements = new Set();

const outframedDocuments = new Set();

class OutframeResponse {
    constructor() {
        /**
         * the placeholder element
         * @type {HTMLElement}
         */
        this.placeholder = null;

        /**
         * event handler for after the element has been returned to it's previous position.
         * @type {Function|null}
         */
        this.onclose = null;

        /**
         * event handler for before the element has been returned to it's previous position.
         * @type {Function|null}
         */
        this.onbeforeclose = null;

        /**
         * the temporary document. can be used to patch querySelector calls
         * @type {HTMLDocument}
         */
        this.document = null;
    }
}

/**
* Get an  array of external HTMLDocument objects used by outframe.
* @returns {Array<HTMLDocument>} array of documents
*/
export function getOutframeDocuments() {
    return [...outframedDocuments];
}

/**
* Move a container element to a new window. Should be called after a user interaction (eg: click event)
* @param {HTMLElement} targetElement the target element to move to a new window
* @param {Object} [opts=] options for outframe.js
* @param {string} [opts.windowName="Outframe.js Window"] the title of the window containing the new element. defaults to `Outframe.js Window`
* @param {boolean} [opts.createPlaceholder=false] create a placeholder element with same stylesheet size? defaults to `false`
* @param {string} [opts.placeholderBackground="rgba(0,0,0,0.5)"] if `createPlaceholder` is `true`, this specifies the CSS `background` value to use. defaults to `rgba(0,0,0,0.5)`
* @param {number} [opts.width=] width of the new window. uses `targetElement`'s width if unspecified.
* @param {number} [opts.height=] height of the new window. uses `targetElement`'s height if unspecified.
* @param {boolean} [opts.forwardEvents=true] whether or not to forward frame events to the main window. defaults to 'true'
* @returns {OutframeResponse} object containing information about the framing
*/
export function outframe(targetElement, opts) {
    if (outframedElements.has(targetElement)) {
        throw new Error("Element is already outframed");
    }
    if (!HTMLElement.prototype.moveBefore) {
        throw new Error("Your browser does not support HTMLElement.moveBefore(); aborting...");
    }

    const response = new OutframeResponse();

    opts = opts || {};
    opts.windowName ??= "Outframe.js Window";
    opts.createPlaceholder ||= false;
    opts.placeholderBackground ??= "rgba(0,0,0,0.5)";
    opts.forwardEvents ??= true;

    if (!('width' in opts) || !('height' in opts)) {
        const rect = targetElement.getBoundingClientRect();
        opts.width ??= rect.width;
        opts.height ??= rect.height;
    }

    const frame = window.open("", "_blank", "menubar=no;toolbar=no;status=no;location=false;toolbar=false;popup=true;");
    if (!frame) {
        throw new Error("Failed to open new window.");
    }

    if (opts.createPlaceholder) {
        const cssSnapshot = targetElement.computedStyleMap();
        response.placeholder = document.createElement("div");
        response.placeholder.style = "all:initial !important";
        ["width", "height", "display", "max-width", "max-height", "min-width", "min-height", "position", "z-index", "transform", "top", "left", "bottom", "right", "inset"].forEach(name => {
            if (cssSnapshot.has(name)) {
                response.placeholder.style.width = cssSnapshot.get(name) + " !important";
            }
        });
        response.placeholder.style.backgroundColor = "";
        response.placeholder.style.backgroundImage = "";
        response.placeholder.style.background = opts.placeholderBackground + " !important";
        targetElement.before(response.placeholder);
    } else {
        response.placeholder = document.createElement("outframe-placeholder");
        response.placeholder.style = "all:initial !important";
        response.placeholder.display = "none !important";
        targetElement.before(response.placeholder);
    }
    outframedElements.add(targetElement);

    frame.document.documentElement.innerHTML = `
    <head>
        <title>Outframe.js Window</title>
        <base href="${location.href}">
    </head>
    <style>
    html, body {
        margin: 0 !important;
        padding: 0! important;
        width: 100vw !important;
        height: 100vh !important;
    }
    body>* {
        width: 100vw !important;
        height: 100vw !important;
    }
    </style>
    <body>
    </body>
    `;
    frame.document.querySelector("title").innerText = opts.windowName;
    frame.document.adoptNode(targetElement);
    frame.document.body.appendChild(targetElement);

    const styleElements = document.querySelectorAll('style,link[rel=stylesheet],link[rel=icon],meta[name=viewport]');
    styleElements.forEach(styleElement => {
        const imported = frame.document.importNode(styleElement, true);
        frame.document.head.appendChild(imported);
    });

    frame.onbeforeunload = function (e) {
        if (response.onbeforeclose) {
            response.onbeforeclose(e);
        }
        try {
            document.adoptNode(targetElement);
            response.placeholder.parentElement.insertBefore(targetElement, response.placeholder);
            response.placeholder.remove();
        } catch (error) {
            console.log("[Outframe.js] failed to return element");
        }

        outframedElements.delete(targetElement);
        outframedDocuments.delete(response.document);

        if (response.onclose) {
            response.onclose(e);
        }
    }
    response.document = frame.document;
    outframedDocuments.add(response.document);
    if (opts.forwardEvents) {
        Object.keys(frame).forEach(key => {
            if (key.startsWith("on")) {
                const type = key.slice(2);
                frame.addEventListener(type, event => {
                    console.log(`Forwarding ${type} event.`);
                    const clone = new CustomEvent(type, {
                        bubbles: event.bubbles,
                        cancelable: event.cancelable,
                        detail: event.detail
                    });
                    for (let prop in event) {
                        if (prop === "isTrusted") {
                            continue;
                        }
                        let descriptor = Object.getOwnPropertyDescriptor(event, prop);
                        if (descriptor && (descriptor.get || descriptor.set)) {
                            Object.defineProperty(clone, prop, descriptor);
                        } else {
                            clone[prop] = event[prop];
                        };
                    }
                    window.dispatchEvent(clone);
                });
                frame.document.addEventListener(type, event => {
                    console.log(`Forwarding ${type} event.`);
                    const clone = new CustomEvent(type, {
                        bubbles: event.bubbles,
                        cancelable: event.cancelable,
                        detail: event.detail
                    });
                    for (let prop in event) {
                        if (prop === "isTrusted") {
                            continue;
                        }
                        let descriptor = Object.getOwnPropertyDescriptor(event, prop);
                        if (descriptor && (descriptor.get || descriptor.set)) {
                            Object.defineProperty(clone, prop, descriptor);
                        } else {
                            clone[prop] = event[prop];
                        };
                    }
                    document.dispatchEvent(clone);
                });
            }
        });
    }
    return response;
}
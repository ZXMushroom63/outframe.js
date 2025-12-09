/**
 * keep track of which elements have been popped out
 * @type {Set<HTMLElement>}
 */
const outframedElements = new Set();

class OutframeResponse {
    constructor() {
        this.placeholder = null;
    }
}
/**
* Move a container element to a new window. Should be called after a user interaction (eg: click event)
* @param {HTMLElement} containerElement the target element to move to a new window
* @param {Object} opts options for outframe.js
* @param {string} [opts.windowName="Outframe.js Window"] the title of the window containing the new element. defaults to `Outframe.js Window`
* @param {boolean} [opts.createPlaceholder=false] create a placeholder element with same stylesheet size? defaults to `false`
* @param {string} [opts.placeholderBackground="rgba(0,0,0,0.5)"] if `createPlaceholder` is `true`, this specifies the CSS `background` value to use. defaults to `rgba(0,0,0,0.5)`

* @returns {OutframeResponse} object containing information about the framing
*/
export function outframe(containerElement, opts) {
    window.open("", "_blank", "menubar=no;toolbar=no;")

    const response = new OutframeResponse();
    return response;
}
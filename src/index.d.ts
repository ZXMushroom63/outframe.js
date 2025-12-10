class OutframeResponse {
    constructor();

    /**
     * the placeholder element
     * @type {HTMLElement}
     */
    placeholder: HTMLElement;

    /**
     * event handler for after the element has been returned to it's previous position.
     * @type {Function|null}
     */
    onclose: ((this: Window, ev: Event) => any) | null;

    /**
     * event handler for before the element has been returned to it's previous position.
     * @type {Function|null}
     */
    onbeforeclose: ((this: Window, ev: BeforeUnloadEvent) => any) | null;

    /**
     * the temporary document. can be used to patch querySelector calls
     * @type {HTMLDocument}
     */
    document: HTMLDocument;
}

export interface OutframeOptions {
    /**
     * options for outframe.js
     * @param {string} [opts.windowName="Outframe.js Window"] the title of the window containing the new element. defaults to `Outframe.js Window`
     */
    windowName?: string;

    /**
     * @param {boolean} [opts.createPlaceholder=false] create a placeholder element with same stylesheet size? defaults to `false`
     */
    createPlaceholder?: boolean;

    /**
     * @param {string} [opts.placeholderBackground="rgba(0,0,0,0.5)"] if `createPlaceholder` is `true`, this specifies the CSS `background` value to use. defaults to `rgba(0,0,0,0.5)`
     */
    placeholderBackground?: string;

    /**
     * @param {number} [opts.width=] width of the new window. uses `targetElement`'s width if unspecified.
     */
    width?: number;

    /**
     * @param {number} [opts.height=] height of the new window. uses `targetElement`'s height if unspecified.
     */
    height?: number;

    /**
     * @param {boolean} [opts.forwardEvents=true] whether or not to forward frame events to the main window. defaults to 'true'
     */
    forwardEvents?: boolean;
    
    /**
     * @param {boolean} [opts.readOnly=false] whether or not to disable user interaction in the popout. defaults to 'false'
     */
    readOnly?: boolean;
}


/**
* Move a container element to a new window. Should be called after a user interaction (eg: click event)
* @param {HTMLElement} targetElement the target element to move to a new window
* @param {Object} [opts=] options for outframe.js
* @returns {OutframeResponse} object containing information about the framing
*/
export function outframe(targetElement: HTMLElement, opts?: OutframeOptions): OutframeResponse;


/**
* Get an  array of external HTMLDocument objects used by outframe.
* @returns {Array<HTMLDocument>} array of documents
*/
export function getOutframeDocuments(): Array<HTMLDocument>;
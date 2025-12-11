# outframe.js API
Quick demo over [here](https://zxmushroom63.github.io/outframe.js/)

## Exports
- `outframe(targetElement: HTMLElement, opts?: Object): OutframeResponse;`
  - 'outframes' the `targetElement` to a new window
- `getOutframeDocuments(): Array<HTMLDocument>;`
  - returns a list of currently used Documents by outframe (excluding the main page)

<br>

- `opts` object structure:
  - `windowName?: string;`
    - the title of the window containing the new element. defaults to `Outframe.js Window`
  - `createPlaceholder?: boolean;`
    - create a placeholder element with same stylesheet size? defaults to `false`
  - `fixedSizing?: boolean;`
    - use a fixed bounding box size for the placeholder? defaults to `false`
  - `placeholderBackground?: string;`
    - if `createPlaceholder` is `true`, this specifies the CSS `background` value to use. defaults to `rgba(0,0,0,0.5)`
  - `forwardEvents?: boolean;`
    - whether or not to forward frame events to the main window. defaults to 'true'
  - `readOnly?: boolean;`
    - whether or not to disable user interaction in the popout. defaults to 'false'
  - `width?: number;`
    - width of the new window. uses `targetElement`'s width if unspecified.
  - `height?: number;`
    - height of the new window. uses `targetElement`'s height if unspecified.

- `class OutframeResponse`
  - `placeholder: HTMLElement`
    - the placeholder element used in place of the target element.
  - `document: HTMLDocument`
    - the temporary document. can be used to patch querySelector calls
  - `onbeforeclose: ((ev: Event) => any) | null`
    - event handler for before the element has been returned to it's previous position. (ev is from `beforeunload`)
  - `onclose: ((ev: Event) => any) | null`
    - event handler for after the element has been returned to it's previous position. (ev is from `beforeunload`)
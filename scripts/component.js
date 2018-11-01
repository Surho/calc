export default class Component {
    constructor( {element} ) {
        this.element = element;
    }

    trigger(eventName, {details}) {
        let event = new CustomEvent(eventName, {
            bubbles: true,
            details: details
        });
        this.element.dispatchEvent(event);
        console.log(event.details);
    }
}
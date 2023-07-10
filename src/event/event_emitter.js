/**
 * Class that represents an event bus, by which send and receive event specifying an handler.
 */
class EventEmitter {

    /**
     * Empty constructor of the class.
     */
    constructor() {
        this.listeners = [];
    }

    /**
     * Emit a new event on the event bus.
     * @param eventName {String} the name of the event.
     * @param data {String} the data to send.
     */
    emit(eventName, data) {
        this.listeners
            .filter(({ name }) => name === eventName)
            .forEach(
                ({ callback }) => {
                    setTimeout(callback.apply(this, [data]), 0)
                });
    }

    /**
     * Handle an event received
     * @param name {String} the name of the event.
     * @param callback the callback to call when the event arrives.
     */
    on(name, callback) {
        if (
            typeof callback === 'function'
            && typeof name === 'string'
        ) {
            this.listeners.push({ name, callback });
        }
    }

    /**
     * Destroy the event bus.
     */
    destroy() {
        this.listeners.length = 0;
    }
}

const eventBus = new EventEmitter();

export {eventBus}
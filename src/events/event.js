module.exports = class Event {

    static parse(message) {
        this.action(message)
        return true
    }

    static action(message) {}
}
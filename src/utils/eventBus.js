const eventBus = {
  listeners: {},

emit(event) {
  if (this.listeners[event]) {
this.listeners[event].forEach(callback => callback());
}
},

on(event, callback) {
  if (!this.listeners[event]) {
this.listeners[event] = [];
}
this.listeners[event].push(callback);
},

off(event, callback) {
  if (this.listeners[event]) {
this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
}
}
};

export default eventBus;
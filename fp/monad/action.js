// excutor,js

import { tagged } from 'daggy';

export const Action = tagged('Action', ['action']);

Action.prototype.equal = function(that) {
    return this.action === that.action;
}

Action.prototype.toString = function(that) {
    return this.action;
}

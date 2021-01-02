// excutor,js

import { tagged } from 'daggy';

export const Executor = f =>
({
 run: f,
 action: a => Executor(f[a.action]),
 map: g => Reader(x => g(f(x))),
 chain: g => Reader(x => g(f(x)).run(x))
})

Executor.of = x => Reader(() => x)
export const Action = tagged('Action', ['action']);

Action.prototype.equal = function(that) {
    return this.action === that.action;
}

Action.prototype.toString = function(that) {
    return this.action;
}

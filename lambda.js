// ZERO := ƛfx.x 
const ZERO = f => x => x;

// T = K := ƛxy.x
const K = x => y => x;
// T := ƛxy.x
const T = x => y => x;

// F = KI : = ƛxy.y
const KI = x => y => y;
// F : = ƛxy.y
const F = x => y => y;
// ONCE := ƛfx.fx
const ONCE = f => x => f(x);
// SUCCESSOR := λnfx.f(nfx)
const SUCC = num => f => x => f(num(f)(x));

// ADD := ƛnk.n(SUCC)k
const ADD = n => k => n(SUCC)(k);
// B := λab.a∘b = compose
const B = a => b => x =>a(b(x));

// MULT := λab.a∘b = compose
const MULT = B;

// NOT := ƛb.bFT
const NOT = b => b(F)(T)

// AND := ƛpq.pTq
const AND = p => q => p(q)(F);


// OR := ƛpq.pT.q
const OR = p => q => p(T)(q);

// I := ƛx.x
const I = x => x;


// is0 := ƛn.n(KF)T
const is0 = n => n(K(F))(T);

// SUBTITUTION := ƛfgx.(fx)(gx)
const S = f => g => x => f(x)(g(x));



const PAIR = a => b => f(a)(b);

module.exports = {
    ZERO, SUCC, ONCE, B, PAIR, S
}

// var space = {
//     a: 1,
//     b: 2,
//     c: function () {
//         console.log('我是c');
//         return this.a;
//     },
//     d: function () {
//         console.log('我是d');
//         return this.b;
//     },
// };
//
// console.log(space.a);
// console.log(space.b);
// console.log(space.c());
// console.log(space.d());

// function Class() {
//     this.a = 1;
//     this.b = 2;
// }
//
// Class.prototype.c = function () {
//     console.log('我是c');
//     return this.a;
// };
// Class.prototype.d = function () {
//     console.log('我是d');
//     return this.b;
// };
//
// var instance = new Class();
// console.log(instance.a);
// console.log(instance.b);
// console.log(instance.c());
// console.log(instance.d());

(function(window) {
    let a = 1;
    let b = 2;

    function c() {
        console.log("我是c");
        return a;
    }

    function d() {
        console.log("我是d");
        return b;
    }

    window.e = {
        c,
        d
    };
})(window);

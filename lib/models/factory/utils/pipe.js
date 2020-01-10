module.exports = function(target, mixins) {
    return mixins.reduce((target, mixin) => {
        return Object.assign(target, mixin(target));
    }, target);
};
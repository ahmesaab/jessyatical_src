/**
 * Created by Ahmed on 7/22/2016.
 */

Utils = {
    isPositiveInt:function(number)
    {
        return typeof(number) != "boolean" &&
            !isNaN(number) && number.indexOf('.')==-1 && number.indexOf('-')==-1
    },
    dateBySubtractingDays:function(date, days) {
        return new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate() - days,
            date.getHours(),
            date.getMinutes(),
            date.getSeconds(),
            date.getMilliseconds()
        );
    }
};

module.exports = Utils;

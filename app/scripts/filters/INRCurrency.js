MobiDash.filter('INRCurrency', function() {
    return function(amount, showDecimals, symbol) {
        if (!amount || amount.length <= 0 || amount === undefined) {
            return "0.00";
        }
        var vamount = amount.toString();
        var symbolToUse = symbol || '₹';
        showDecimals = true;
        var afterPoint = '';
        if (showDecimals && vamount.split(".").length > 1) {
            afterPoint = '.' + vamount.split(".")[1];
            if (afterPoint.length == 1) {
                afterPoint += '00';
            } else if (afterPoint.length == 2) {
                afterPoint += '0';
            }

        } else {
            afterPoint = '.00';
        }
        vamount = vamount.split('.')[0];
        vamount = vamount.toString();
        var lastThree = vamount.substring(vamount.length - 3);
        var otherNumbers = vamount.substring(0, vamount.length - 3);
        if (otherNumbers != '')
            lastThree = ',' + lastThree;
        var formattedAmount = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterPoint;
        return formattedAmount.replace('-,', '-');

    };
});
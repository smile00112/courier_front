const MINUTE = 60 * 1000;
const HOUR = 60 * 60 * 1000;

const dateDiff = (date_1, date_2) => {
    var date_diff = date_1 - date_2 ;
    date_diff = ( Math.abs( date_diff / MINUTE ) < 60 ) ?  Math.floor(date_diff / MINUTE )+' м' : Math.floor(date_diff / HOUR )+' ч' 
    return date_1 ? date_diff : 'no_date'
}

export default dateDiff; 

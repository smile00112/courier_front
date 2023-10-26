const MINUTE = 60 * 1000;
const HOUR = 60 * 60 * 1000;
const DAY = 24 * 60 * 60 * 1000;

export const dateDiff = (date_1, date_2) => {
    let date_diff = date_1 - date_2 ;
    let time =
        ( Math.abs(date_diff / MINUTE ) < 60 ) ?
            Math.abs(Math.floor(date_diff / MINUTE ))+' м' :
            ( ( Math.abs(date_diff / HOUR ) < 24 ) ? Math.abs(Math.floor(date_diff / HOUR ))+' ч' : Math.abs(Math.floor(date_diff / DAY ))+' дн');

    if(date_diff < 0)
        date_diff = `вышло ${time} назад`;
    else
        date_diff = time;
    return date_1 ? date_diff : 'no_date'
}
export const timeDiff = (date_1, date_2) => {
    var date_diff = date_1 - date_2 ;
    return ( Math.abs( date_diff / MINUTE ) < 60 ) ?  Math.floor(date_diff / MINUTE ) : Math.floor(date_diff / HOUR )
}

//export default dateDiff;
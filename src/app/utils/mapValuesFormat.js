const MINUTE = 60;
const HOUR = 60 * 60;
const DAY = 24 * 60 * 60;

export const getPrettyTime = (time) => {
    return time > 0 ? Math.round( time / MINUTE ) + ' мин' : '';
}
export const getPrettyDistance = (distance) => {
    return  distance > 0 ? ( Math.round( (distance / 1000) * 100) / 100 ) + ' км' : '';
}


//export default dateDiff;
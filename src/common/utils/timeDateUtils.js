import moment from 'moment';

export const localTimeConvertion = time => {
    // console.log(time);
    // let selectedTimer = new Date(time).toISOString().replace('T', ' ').replace('Z', '');
    // return new Date(moment().format(selectedTimer)).toLocaleString()
    return moment.utc(time).format('dddd, MMMM YYYY h:mm A');
};
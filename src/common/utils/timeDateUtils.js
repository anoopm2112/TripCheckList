import moment from 'moment';

export const localTimeConvertion = time => {
    let selectedTimer = new Date(time).toISOString().replace('T', ' ').replace('Z', '');
    return new Date(moment().format(selectedTimer)).toLocaleString()
};
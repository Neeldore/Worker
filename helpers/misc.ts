import { Moment } from 'moment';
import { GO_BACK } from './constants';
import * as moment from 'moment-timezone';

export function _throw(m = 'Generic error') {
	throw new Error(m);
}

export function checkOrEscape(ans, prop) {
	return ans[prop] === GO_BACK.value ? _throw() : ans;
}

export function getRandomNumber(max = 10000000, min = 1000) {
	return Math.floor(Math.random() * max + min);
}

export const formatDate = (date: Date | string, timezone: string, time?: string, condition?: any, isEndOfDay?: boolean) => {
	let dateString;
	if (!date) {
		return null;
	}
	if (!(date instanceof Date)) {
		date = new Date(date);
		dateString = date;
	}
	dateString = `${date.getFullYear()}-${date.getMonth() < 9 ? '0' : ''}${date.getMonth() + 1}-${date.getDate() < 10 ? '0' : ''}${date.getDate()}`;
	let momentDate: Moment = moment.tz(dateString, timezone);
	if (isEndOfDay) {
		momentDate.set('h', 23);
		momentDate.set('m', 59);
		momentDate.set('s', 59);
	} else {
		momentDate.set('h', 0);
		momentDate.set('m', 0);
		momentDate.set('s', 0);
	}
	const { hours, minutes } = getTimeObject(time);
	if (!condition || condition()) {
		momentDate = addTimeToDate(momentDate, { hours, minutes });
	}
	return momentDate.isValid() ? momentDate.format() : null;
};

const getTimeObject = (time: string) => {
	if (!time) {
		return {
			hours: 0,
			minutes: 0,
		};
	}
	const colonIndex = time.indexOf(':');
	let hours = +time.substring(0, colonIndex);
	const minutes = +time.substr(colonIndex + 1, 2);
	if (time.endsWith('AM') && hours == 12) {
		hours = 0;
	} else if (time.endsWith('PM') && hours !== 12) {
		hours = hours + 12;
	}
	return {
		hours,
		minutes,
	};
};

const addTimeToDate = (date: Moment, timeObj: any) => {
	if (date.isValid()) {
		date.add(timeObj.hours, 'h');
		date.add(timeObj.minutes, 'm');
	}
	return date;
};

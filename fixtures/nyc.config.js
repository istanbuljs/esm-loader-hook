import loader from '@istanbuljs/load-nyc-config';

export default {
	include: loader.isLoading() ? ['hooked.js'] : []
};

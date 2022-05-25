export default {
	input: 'src/purecloud-guest-chat-client/index.js',
	output: {
		file: 'dist/web-amd/purecloud-guest-chat-client.js',
		format: 'amd'
	},
	external: [
		'axios'
	]
};
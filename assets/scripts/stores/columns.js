/**
 * Register a store so that our column component
 * can communicate with our columns component
 */

const { registerStore } = wp.data;

const DEFAULT_STATE = {};

const actions = {
	getParent(clientId) {
		return {
			type: 'GET_PARENT'
		};
	}
}

registerStore( 'radblocks/columns', {
	reducer(state = DEFAULT_STATE, action) {
		if (action.type === "GET_PARENT") {
			console.log("hello world!", state);
		}
	},
	actions
});

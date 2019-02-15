/**
 * A helper function to make block names that are prefixed with our
 * namespace
 */
const { applyFilters } = wp.hooks;
// this filter will let others change it later
const pluginName = applyFilters('bootstrap-blocks-namespace', 'rad-bootstrap-blocks');

module.exports = (name = '') => {
	return pluginName + '/' + name;
};

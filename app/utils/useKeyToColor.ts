export default (str: string) => {
	const colors = [
		"red",
		"orange",
		"amber",
		"yellow",
		"lime",
		"green",
		"emerald",
		"teal",
		"cyan",
		"sky",
		"blue",
		"indigo",
		"violet",
		"purple",
		"fuchsia",
		"pink",
		"rose",
	];
	let hash = 1;
	for (let i = 0; i < str.length; i++) {
		hash = (hash + str.charCodeAt(i)) % colors.length;
	}
	return colors[hash];
};

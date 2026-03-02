/**
 *
 * format params JOHN DOE, S.Kom., M.Kom. => John Doe, S.Kom., M.Kom.
 */
export const sentenceCaseWithTitle = (str: string) => {
	const slited = str.split(",");
	for (let i = 0; i < slited.length; i++) {
		if (i === 0) {
			slited[i] = slited[i]
				.toLowerCase()
				.split(" ")
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(" ");
		}
	}
	return slited.join(",");
};

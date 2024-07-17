/** @type {import("myst-common").MystPlugin} */
export default {
	name: "any-directive",
	directives: [
		{
			name: "any",
			doc: "Embed any component",
			arg: {
				type: String,
				required: true,
				doc: "",
			},
			options: {
				styles: {
					type: String,
					required: false,
					doc: "URL to the CSS file",
				},
			},
			body: {
				doc: "JSON object with props to pass down to the component",
				type: String,
				required: true,
			},
			validate(data, _vfile) {
				// TODO: validate the URL for the esm
				return data;
			},
			run(data, _vfile, _opts) {
				const body = /** @type {string} */ (data?.body ?? "{}");
				return [
					{
						type: "any",
						import: data.arg,
						styles: data.options?.styles ?? "",
						data: { json: JSON.parse(body) },
					},
				];
			},
		},
	],
	roles: [],
	transforms: [],
};

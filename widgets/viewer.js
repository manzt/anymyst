import * as vizarr from "https://hms-dbmi.github.io/vizarr/index.js";

export default {
	async render({ model, el }) {
		let div = document.createElement("div");
		Object.assign(div.style, {
			height: model.get("height"),
			backgroundColor: "black",
		});
		// hard code closed for now
		let viewer = await vizarr.createViewer(div, { menuOpen: false });
		viewer.addImage({ source: model.get("source") });
		el.appendChild(div);
		return () => viewer.destory?.();
	},
};

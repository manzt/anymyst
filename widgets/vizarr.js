import * as vizarr from "https://hms-dbmi.github.io/vizarr/index.js";


export default {
  async render({ model, el }) {
    console.log("vizarr", vizarr);
    let div = document.createElement("div");
    Object.assign(div.style, {
      height: model.get("height"),
      backgroundColor: "black",
    });
    let viewer = await vizarr.createViewer(div);
    viewer.addImage({ source: model.get("source") });
    el.appendChild(div);
  },
};

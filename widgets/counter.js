import confetti from "https://esm.sh/canvas-confetti";

function render({ model, el }) {
	const button = document.createElement("button");
	button.innerHTML = `count is ${model.get("value")}`;
	button.addEventListener("click", () => {
		model.set("value", model.get("value") + 1);
		model.save_changes();
	});
	model.on("change:value", () => {
		button.innerHTML = `count is ${model.get("value")}`;
		confetti({ angle: model.get("value") * 5 });
	});
	el.appendChild(button);
}
export default { render };

import * as React from "react";
import type { NodeRenderer } from "@myst-theme/providers";

/**
 * A shim for the anywidget model interface
 * @see {@link https://github.com/manzt/anywidget/tree/main/packages/types}
 */
class AnyModel {
	#state: Record<string, any>;
	#target = new EventTarget();
	constructor(state: Record<string, any>) {
		this.#state = state;
	}
	get(name: string) {
		return this.#state[name];
	}
	set(key: string, value: unknown) {
		this.#state[key] = value;
		this.#target.dispatchEvent(
			new CustomEvent(`change:${key}`, { detail: value }),
		);
		this.#target.dispatchEvent(
			new CustomEvent("change", { detail: value }),
		);
	}
	on(name: string, callback: () => void | Promise<void>) {
		this.#target.addEventListener(name, callback);
	}
	off(name: string, callback: () => void | Promise<void>) {
		// TODO
	}
	send(msg: any, callbacks?: unknown, buffers?: ArrayBuffer[]) {
		// TODO: impeThrow?
		console.error(`model.send is not yet implemented for anyhtmlwidget`);
	}
	save_changes() {
		// nothing to sync but necessary
	}
	get widget_manager() {
		throw new Error("widget_manager is not implemented for this type");
	}
}

type AnyMystDirective = {
	/** The type of the directive */
	type: "any";
	/** The ES module to import */
	import: string;
	/** The data to pass to the model */
	data: { json: Record<string, unknown> };
};

export const AnyMystRenderer: NodeRenderer = ({
	node,
}: {
	node: AnyMystDirective;
}) => {
	const model = new AnyModel(node.data.json);
	const ref = React.useRef<HTMLDivElement>(null);
	React.useEffect(() => {
		import(node.import).then(async (mod) => {
			const { render, initialize } = mod.default ?? {};
			// TODO: assert that the module has the right shape
			if (initialize) {
				await initialize({ model });
			}
			ref.current?.replaceChildren();
			await render({ model, el: ref.current });
		});
	}, []);
	return <div ref={ref} />;
};
